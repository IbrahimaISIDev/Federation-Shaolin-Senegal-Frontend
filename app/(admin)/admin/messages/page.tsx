'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { Mail, MailOpen, Search, Trash2, Reply, Phone, Loader2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { messagesApi, type ContactMessage } from '@/lib/api/messages';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'unread' | 'read';
const PAGE_SIZE = 20;

function formatDate(d: string) {
    return new Date(d).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Numéro sénégalais au format international pour WhatsApp (77 123 45 67 → 221771234567)
function whatsappNumber(phone: string) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 9) return `221${digits}`;
    return digits.replace(/^00/, '');
}

export default function AdminMessagesPage() {
    const [filter, setFilter] = useState<Filter>('all');
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 300);
    const [page, setPage] = useState(1);
    const [openId, setOpenId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'messages', filter, debouncedSearch, page],
        queryFn: () => messagesApi.list({
            status: filter === 'all' ? undefined : filter,
            search: debouncedSearch || undefined,
            page,
            limit: PAGE_SIZE,
        }),
    });
    const messages = data?.data ?? [];
    const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
    };

    const readMutation = useMutation({
        mutationFn: ({ id, isRead }: { id: number; isRead: boolean }) => messagesApi.setRead(id, isRead),
        onSuccess: invalidate,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => messagesApi.delete(id),
        onSuccess: () => { toast.success('Message supprimé'); invalidate(); },
        onError: () => toast.error('Erreur lors de la suppression'),
    });

    // Ouvrir un message le marque comme lu
    const toggleOpen = (m: ContactMessage) => {
        setOpenId((cur) => (cur === m.id ? null : m.id));
        if (!m.isRead) readMutation.mutate({ id: m.id, isRead: true });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Messages</h1>
                <p className="text-muted-foreground">
                    Messages reçus via le formulaire de contact du site
                    {data ? ` — ${data.unread} non lu${data.unread > 1 ? 's' : ''}` : ''}.
                </p>
            </div>

            <Card>
                <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher (nom, email, sujet, contenu)…"
                            className="pl-10"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="flex gap-1 rounded-lg border p-1">
                        {([['all', 'Tous'], ['unread', 'Non lus'], ['read', 'Lus']] as const).map(([v, label]) => (
                            <Button key={v} variant="ghost" size="sm" className={cn(filter === v && 'bg-muted')} onClick={() => { setFilter(v); setPage(1); }}>
                                {label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : messages.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed bg-muted/20 py-20 text-center">
                    <Inbox className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Aucun message.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((m) => {
                        const open = openId === m.id;
                        return (
                            <Card key={m.id} className={cn('transition-shadow', !m.isRead && 'border-accent/40 bg-accent/5')}>
                                <CardContent className="p-0">
                                    <button type="button" onClick={() => toggleOpen(m)} className="flex w-full items-start gap-3 p-4 text-left">
                                        {m.isRead
                                            ? <MailOpen className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                                            : <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" />}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={cn('font-medium', !m.isRead && 'font-semibold')}>{m.name}</span>
                                                {!m.isRead && <Badge className="bg-accent text-accent-foreground">Nouveau</Badge>}
                                                <span className="ml-auto text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
                                            </div>
                                            <p className="truncate text-sm font-medium text-foreground">{m.subject}</p>
                                            {!open && <p className="truncate text-sm text-muted-foreground">{m.message}</p>}
                                        </div>
                                    </button>

                                    {open && (
                                        <div className="space-y-4 border-t px-4 pb-4 pt-4 sm:pl-12">
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{m.message}</p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <a href={`mailto:${m.email}`} className="hover:text-accent">{m.email}</a>
                                                {m.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {m.phone}</span>}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Button size="sm" className="gap-2 bg-accent hover:bg-accent/90" asChild>
                                                    <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re : ${m.subject}`)}`}>
                                                        <Reply className="h-4 w-4" /> Répondre par email
                                                    </a>
                                                </Button>
                                                {m.phone && (
                                                    <Button size="sm" variant="outline" className="gap-2" asChild>
                                                        <a href={`https://wa.me/${whatsappNumber(m.phone)}`} target="_blank" rel="noopener noreferrer">
                                                            WhatsApp
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="outline" className="gap-2" onClick={() => readMutation.mutate({ id: m.id, isRead: false })}>
                                                    <Mail className="h-4 w-4" /> Marquer non lu
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-2 text-destructive hover:text-destructive"
                                                    onClick={() => { if (confirm('Supprimer ce message ?')) deleteMutation.mutate(m.id); }}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Supprimer
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Page précédente">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
                    <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Page suivante">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
