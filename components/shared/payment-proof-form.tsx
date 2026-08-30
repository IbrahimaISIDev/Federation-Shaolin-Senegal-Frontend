'use client';

import { useRef, useState } from 'react';
import { Loader2, Upload, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadApi } from '@/lib/api/upload';
import { toast } from 'sonner';

interface PaymentProofFormProps {
    onSubmit: (data: { reference: string; preuveUrl: string }) => Promise<void>;
    submitLabel?: string;
}

/**
 * Formulaire de preuve de paiement manuel : référence de transaction +
 * capture d'écran/photo du reçu. Réutilisé pour l'affiliation et le
 * renouvellement de licence.
 */
export function PaymentProofForm({ onSubmit, submitLabel = 'Envoyer ma preuve de paiement' }: PaymentProofFormProps) {
    const [reference, setReference] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reference.trim()) {
            toast.error('Merci de saisir la référence de la transaction');
            return;
        }
        if (!file) {
            toast.error('Merci d\'ajouter une capture d\'écran ou une photo du reçu');
            return;
        }

        setUploading(true);
        try {
            const { url } = await uploadApi.uploadPaymentProof(file);
            setUploading(false);
            setSubmitting(true);
            await onSubmit({ reference: reference.trim(), preuveUrl: url });
        } catch {
            toast.error("Erreur lors de l'envoi de la preuve. Réessayez.");
        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };

    const isBusy = uploading || submitting;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="reference">Référence de la transaction *</Label>
                <Input
                    id="reference"
                    placeholder="Ex : WAVE-XXXXXXX ou référence Orange Money"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Capture d&apos;écran ou photo du reçu *</Label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                />
                {preview ? (
                    <div className="relative w-full max-w-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Aperçu de la preuve" className="w-full rounded-lg border" />
                        <button
                            type="button"
                            onClick={() => { setFile(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white"
                            aria-label="Retirer le fichier"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                        <Upload className="h-5 w-5" />
                        Choisir un fichier
                    </button>
                )}
            </div>

            <Button type="submit" disabled={isBusy} className="w-full gap-2 bg-accent hover:bg-accent/90">
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {uploading ? 'Envoi de la preuve…' : submitting ? 'Envoi…' : submitLabel}
            </Button>
        </form>
    );
}
