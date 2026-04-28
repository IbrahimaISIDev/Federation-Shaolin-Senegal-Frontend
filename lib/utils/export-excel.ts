import * as XLSX from 'xlsx';

export interface ExportConfig {
    /** The data rows to export */
    data: Record<string, unknown>[];
    /** Sheet name inside the workbook */
    sheetName: string;
    /** Downloaded file name (without extension) */
    fileName: string;
    /** Optional: map of column keys to display headers */
    headers?: Record<string, string>;
}

/**
 * Export an array of objects to an `.xlsx` file and trigger browser download.
 */
export function exportToExcel({ data, sheetName, fileName, headers }: ExportConfig) {
    if (data.length === 0) {
        console.warn('[exportToExcel] No data to export.');
        return;
    }

    // Remap keys to human-readable headers if provided
    const rows = headers
        ? data.map((row) =>
            Object.fromEntries(
                Object.entries(headers).map(([key, label]) => [label, row[key] ?? ''])
            )
        )
        : data;

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
}

// ─── Pre-configured exporters ─────────────────────────────────────────────────

export const EXPORT_CONFIGS = {
    membres: {
        sheetName: 'Membres',
        fileName: 'shaolin_membres',
        headers: {
            firstName: 'Prénom',
            lastName: 'Nom',
            email: 'Email',
            phone: 'Téléphone',
            gender: 'Sexe',
            birthDate: 'Date de naissance',
            nationality: 'Nationalité',
            city: 'Ville',
            region: 'Région',
            clubName: 'Club',
            discipline: 'Discipline',
            grade: 'Grade',
            status: 'Statut',
            licenseNumber: 'N° Licence',
            registeredAt: 'Date d\'inscription',
        },
    },
    clubs: {
        sheetName: 'Clubs',
        fileName: 'shaolin_clubs',
        headers: {
            code: 'Code',
            name: 'Nom',
            region: 'Région',
            city: 'Ville',
            phone: 'Téléphone',
            email: 'Email',
            presidentName: 'Président',
            membersCount: 'Nb. Membres',
            status: 'Statut',
            createdAt: 'Date d\'affiliation',
        },
    },
    competitions: {
        sheetName: 'Compétitions',
        fileName: 'shaolin_competitions',
        headers: {
            title: 'Titre',
            discipline: 'Discipline',
            date: 'Date',
            location: 'Lieu',
            status: 'Statut',
            participants: 'Participants',
            maxParticipants: 'Max. Participants',
        },
    },
    licences: {
        sheetName: 'Licences',
        fileName: 'shaolin_licences',
        headers: {
            licenseNumber: 'N° Licence',
            memberName: 'Membre',
            clubName: 'Club',
            discipline: 'Discipline',
            grade: 'Grade',
            issueDate: 'Date délivrance',
            expiryDate: 'Date expiration',
            status: 'Statut',
        },
    },
    actualites: {
        sheetName: 'Actualités',
        fileName: 'shaolin_actualites',
        headers: {
            title: 'Titre',
            slug: 'Slug',
            category: 'Catégorie',
            status: 'Statut',
            author: 'Auteur',
            publishedAt: 'Date de publication',
        },
    },
} as const;

export type ExportEntity = keyof typeof EXPORT_CONFIGS;
