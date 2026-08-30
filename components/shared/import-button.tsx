'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import type { ImportReport } from '@/lib/api/clubs';
import { toast } from 'sonner';

interface ImportButtonProps {
    /** Label used in dialog titles/toasts, e.g. "clubs" or "membres" */
    label: string;
    /** Columns expected in the Excel file, shown as a hint before upload */
    columnsHint: string;
    /** Calls the backend import endpoint with the chosen file */
    importFn: (file: File) => Promise<ImportReport>;
    /** Called after a successful import so the caller can refetch its list */
    onImported?: () => void;
    className?: string;
}

/**
 * Reusable "Importer Excel" button — opens a dialog with a hint of the
 * expected columns, lets the admin pick a .xlsx file, then shows a
 * row-by-row report (créés / erreurs) after upload.
 */
export function ImportButton({ label, columnsHint, importFn, onImported, className }: ImportButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [report, setReport] = useState<ImportReport | null>(null);

    const reset = () => {
        setReport(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFile = async (file: File) => {
        setIsImporting(true);
        setReport(null);
        try {
            const result = await importFn(file);
            setReport(result);
            if (result.created > 0) {
                toast.success(`${result.created} ${label} importé(s)`);
                onImported?.();
            }
            if (result.errors.length > 0 && result.created === 0) {
                toast.error("Aucune ligne n'a pu être importée");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.error ?? "Erreur lors de l'import");
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                className={`gap-2 ${className ?? ''}`}
                onClick={() => setOpen(true)}
            >
                <Upload className="w-4 h-4" />
                Importer Excel
            </Button>

            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Importer des {label} depuis Excel</DialogTitle>
                        <DialogDescription>
                            Fichier .xlsx avec une ligne d&apos;en-têtes. Colonnes attendues : {columnsHint}.
                        </DialogDescription>
                    </DialogHeader>

                    {!report ? (
                        <div className="space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFile(file);
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isImporting}
                                className="w-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        <p className="text-sm">Import en cours...</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8" />
                                        <p className="text-sm">Cliquer pour choisir un fichier .xlsx</p>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-emerald-600">
                                <CheckCircle2 className="w-5 h-5" />
                                <p className="font-medium">{report.created} sur {report.total} ligne(s) importée(s)</p>
                            </div>
                            {report.errors.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-amber-600">
                                        <AlertTriangle className="w-4 h-4" />
                                        <p className="text-sm font-medium">{report.errors.length} ligne(s) ignorée(s)</p>
                                    </div>
                                    <div className="max-h-56 overflow-y-auto rounded-lg border divide-y text-sm">
                                        {report.errors.map((e, i) => (
                                            <div key={i} className="px-3 py-2 flex gap-2">
                                                <span className="text-muted-foreground shrink-0">Ligne {e.row}</span>
                                                <span>{e.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        {report ? (
                            <Button onClick={() => setOpen(false)} className="bg-accent hover:bg-accent/90">
                                Fermer
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={() => setOpen(false)} disabled={isImporting}>
                                Annuler
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
