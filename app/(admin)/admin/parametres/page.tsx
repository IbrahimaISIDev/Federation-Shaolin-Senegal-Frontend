'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Settings, Shield, Bell, Globe, Database, Save, Loader2, ArrowRight, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { settingsApi, type UpdateSettingsPayload } from '@/lib/api/settings';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

export default function AdminParametresPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { logout } = useAuthStore();

    // ── Informations générales & notifications ─────────────────────────────────
    const { data, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: () => settingsApi.get(),
    });
    const settings = data?.data;

    const { register, handleSubmit, watch, setValue, reset } = useForm<UpdateSettingsPayload>();

    useEffect(() => {
        if (settings) {
            reset({
                orgName: settings.orgName,
                contactEmail: settings.contactEmail ?? '',
                contactPhone: settings.contactPhone ?? '',
                website: settings.website ?? '',
                paymentWaveNumber: settings.paymentWaveNumber ?? '',
                paymentOMNumber: settings.paymentOMNumber ?? '',
                notifyNewMember: settings.notifyNewMember,
                notifyNewAffiliation: settings.notifyNewAffiliation,
                notifyCompetitions: settings.notifyCompetitions,
                notifyNewsletter: settings.notifyNewsletter,
            });
        }
    }, [settings, reset]);

    const updateMutation = useMutation({
        mutationFn: (payload: UpdateSettingsPayload) => settingsApi.update(payload),
        onSuccess: () => {
            toast.success('Paramètres enregistrés');
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
        onError: () => toast.error("Erreur lors de l'enregistrement"),
    });

    const onSave = (data: UpdateSettingsPayload) => updateMutation.mutate(data);

    const notifyNewMember = watch('notifyNewMember');
    const notifyNewAffiliation = watch('notifyNewAffiliation');
    const notifyCompetitions = watch('notifyCompetitions');
    const notifyNewsletter = watch('notifyNewsletter');

    // ── Sécurité : changement de mot de passe ───────────────────────────────────
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const changePasswordMutation = useMutation({
        mutationFn: () => authApi.changePassword({ currentPassword, newPassword }),
        onSuccess: () => {
            toast.success('Mot de passe mis à jour. Reconnecte-toi.');
            logout();
            router.push('/connexion');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.error ?? 'Erreur lors du changement de mot de passe');
        },
    });

    const handleChangePassword = () => {
        if (newPassword.length < 8) {
            toast.error('Le nouveau mot de passe doit faire au moins 8 caractères');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        changePasswordMutation.mutate();
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold">Paramètres</h1>
                <p className="text-muted-foreground">Configuration générale du back-office.</p>
            </div>

            {/* Informations générales */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <CardTitle>Informations générales</CardTitle>
                    </div>
                    <CardDescription>
                        Informations publiques de l&apos;association — affichées dans l&apos;en-tête, le pied de page et la page Contact du site.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label>Nom de l&apos;organisation</Label>
                                <Input {...register('orgName')} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email de contact</Label>
                                    <Input type="email" {...register('contactEmail')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Téléphone</Label>
                                    <Input type="tel" {...register('contactPhone')} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Site web</Label>
                                <Input type="url" placeholder="https://shaolin-senegal.com" {...register('website')} />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Paiement manuel */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <CardTitle>Paiement</CardTitle>
                    </div>
                    <CardDescription>
                        Numéros affichés aux candidats à l&apos;affiliation et aux membres qui renouvellent leur licence,
                        pour le paiement manuel (Wave / Orange Money).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Numéro Wave</Label>
                                <Input type="tel" autoComplete="off" placeholder="Non renseigné — ex : 77 000 00 00" {...register('paymentWaveNumber')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Numéro Orange Money</Label>
                                <Input type="tel" autoComplete="off" placeholder="Non renseigné — ex : 77 000 00 00" {...register('paymentOMNumber')} />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>
                        Préférences enregistrées — ne pilotent pas encore l&apos;envoi des emails transactionnels existants.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { key: 'notifyNewMember' as const, value: notifyNewMember, label: 'Nouveau membre inscrit', desc: 'Recevoir un email pour chaque nouvel adhérent.' },
                        { key: 'notifyNewAffiliation' as const, value: notifyNewAffiliation, label: 'Nouvelle demande d\'affiliation', desc: 'Notification lors d\'un dépôt de dossier.' },
                        { key: 'notifyCompetitions' as const, value: notifyCompetitions, label: 'Inscriptions compétitions', desc: 'Alerte lors d\'une inscription à une compétition.' },
                        { key: 'notifyNewsletter' as const, value: notifyNewsletter, label: 'Rapport hebdomadaire', desc: 'Résumé d\'activité chaque semaine.' },
                    ].map((item, idx, arr) => (
                        <div key={item.key}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                                <Switch
                                    checked={!!item.value}
                                    onCheckedChange={(v) => setValue(item.key, v)}
                                />
                            </div>
                            {idx < arr.length - 1 && <Separator className="mt-4" />}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSubmit(onSave)} disabled={updateMutation.isPending} className="bg-accent hover:bg-accent/90 gap-2">
                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Enregistrer les paramètres
                </Button>
            </div>

            {/* Sécurité */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <CardTitle>Sécurité</CardTitle>
                    </div>
                    <CardDescription>Changer le mot de passe de ton compte administrateur.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                            <p className="font-medium text-sm">Authentification à deux facteurs</p>
                            <p className="text-xs text-muted-foreground">Protection renforcée pour le compte admin.</p>
                        </div>
                        <Badge variant="outline">Non disponible</Badge>
                    </div>
                    <div className="space-y-2">
                        <Label>Mot de passe actuel</Label>
                        <Input type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Nouveau mot de passe</Label>
                        <Input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Confirmer le mot de passe</Label>
                        <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={handleChangePassword}
                            disabled={changePasswordMutation.isPending || !currentPassword || !newPassword}
                            className="gap-2"
                        >
                            {changePasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                            Changer le mot de passe
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Données */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        <CardTitle>Données</CardTitle>
                    </div>
                    <CardDescription>Export et sauvegarde des données.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="gap-2" asChild>
                        <Link href="/admin/rapports">
                            <Database className="w-4 h-4" /> Exporter les données (membres, clubs, compétitions...)
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
