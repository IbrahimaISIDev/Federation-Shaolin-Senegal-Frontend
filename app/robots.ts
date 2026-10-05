import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// Espaces privés et parcours transactionnels exclus de l'indexation
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin',
                '/membre',
                '/club',
                '/connexion',
                '/mot-de-passe-oublie',
                '/reinitialiser-mot-de-passe',
                '/affiliation/paiement',
                '/verify',
            ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
