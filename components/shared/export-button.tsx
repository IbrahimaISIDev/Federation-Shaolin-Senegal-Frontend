'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToExcel, EXPORT_CONFIGS, ExportEntity } from '@/lib/utils/export-excel';

interface ExportButtonProps {
    /** The entity type to export — must match a key in EXPORT_CONFIGS */
    entity: ExportEntity;
    /** The data to export */
    getData: () => Promise<Record<string, unknown>[]> | Record<string, unknown>[];
    /** Optional: show as icon-only button */
    iconOnly?: boolean;
    /** Optional className */
    className?: string;
}

/**
 * Reusable Export-to-Excel button for any admin list page.
 *
 * Usage:
 * ```tsx
 * <ExportButton entity="membres" getData={() => mockMembers} />
 * ```
 */
export function ExportButton({ entity, getData, iconOnly, className }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const config = EXPORT_CONFIGS[entity];

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await getData();
            exportToExcel({ data, ...config });
        } catch (error) {
            console.error('[ExportButton]', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className={`gap-2 ${className ?? ''}`}
            title={`Exporter ${config.sheetName} en Excel`}
        >
            {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Download className="w-4 h-4" />
            )}
            {!iconOnly && (isExporting ? 'Export...' : 'Exporter Excel')}
        </Button>
    );
}

/**
 * Dropdown variant — export multiple entities from one button (useful for the Reports page).
 */
interface MultiExportButtonProps {
    exports: {
        label: string;
        entity: ExportEntity;
        getData: () => Promise<Record<string, unknown>[]> | Record<string, unknown>[];
    }[];
    className?: string;
}

export function MultiExportButton({ exports, className }: MultiExportButtonProps) {
    const [loadingEntity, setLoadingEntity] = useState<ExportEntity | null>(null);

    const handle = async (entity: ExportEntity, getData: () => Promise<Record<string, unknown>[]> | Record<string, unknown>[]) => {
        setLoadingEntity(entity);
        try {
            const data = await getData();
            exportToExcel({ data, ...EXPORT_CONFIGS[entity] });
        } catch (e) {
            console.error('[MultiExportButton]', e);
        } finally {
            setLoadingEntity(null);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={!!loadingEntity} className={`gap-2 ${className ?? ''}`}>
                    {loadingEntity ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Exporter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                {exports.map((item) => (
                    <DropdownMenuItem
                        key={item.entity}
                        disabled={loadingEntity === item.entity}
                        onClick={() => handle(item.entity, item.getData)}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
