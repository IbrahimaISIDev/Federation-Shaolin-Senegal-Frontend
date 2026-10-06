'use client';

import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/lib/api/content';
import { CONTENT_DEFAULTS, type ContentKey, type ContentOf } from './defaults';

/**
 * Contenu éditorial modifiable depuis l'admin, avec repli sur le contenu par
 * défaut (rien enregistré, chargement en cours ou API indisponible) : la page
 * s'affiche toujours immédiatement et complètement.
 */
export function useSiteContent<K extends ContentKey>(key: K) {
  const { data } = useQuery({
    queryKey: ['content', key],
    queryFn: () => contentApi.get<ContentOf<K>>(key),
  });
  return {
    content: (data?.data ?? CONTENT_DEFAULTS[key]) as ContentOf<K>,
    isCustom: !!data?.data,
    updatedAt: data?.updatedAt ?? null,
  };
}
