import type { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shaolin-senegal.sn';

const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                        changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/clubs`,             changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/competitions`,      changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/actualites`,        changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/galerie`,           changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/affiliation`,       changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`,           changeFrequency: 'yearly',  priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const [clubsRes, articlesRes, compsRes] = await Promise.all([
            fetch(`${API_URL}/clubs?limit=200`,       { next: { revalidate: 3600 } }),
            fetch(`${API_URL}/actualites?limit=200`,  { next: { revalidate: 3600 } }),
            fetch(`${API_URL}/competitions?limit=100`,{ next: { revalidate: 3600 } }),
        ]);

        const clubs:        any[] = clubsRes.ok    ? ((await clubsRes.json()).data    ?? []) : [];
        const articles:     any[] = articlesRes.ok ? ((await articlesRes.json()).data ?? []) : [];
        const competitions: any[] = compsRes.ok    ? ((await compsRes.json()).data    ?? []) : [];

        return [
            ...staticRoutes,
            ...clubs.map((c) => ({
                url:             `${BASE_URL}/clubs/${c.id}`,
                changeFrequency: 'monthly' as const,
                priority:        0.5,
            })),
            ...articles.map((a) => ({
                url:             `${BASE_URL}/actualites/${a.slug}`,
                lastModified:    new Date(a.updatedAt ?? a.createdAt),
                changeFrequency: 'monthly' as const,
                priority:        0.7,
            })),
            ...competitions.map((c) => ({
                url:             `${BASE_URL}/competitions/${c.id}`,
                changeFrequency: 'weekly' as const,
                priority:        0.6,
            })),
        ];
    } catch {
        return staticRoutes;
    }
}
