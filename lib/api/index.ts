// ─── lib/api/index.ts — Barrel export ─────────────────────────────────────────
// Import everything from one place: import { membersApi, clubsApi, ... } from '@/lib/api'

export { authApi } from './auth';
export type { AuthUser, LoginPayload, RegisterPayload } from './auth';

export { clubsApi } from './clubs';
export type { Club, ClubListParams, PaginatedResponse } from './clubs';

export { membersApi } from './members';
export type { Member, MemberListParams, UpdateMemberPayload } from './members';

export { actualitesApi } from './actualites';
export type { Actualite, ActualiteListParams, CreateActualitePayload } from './actualites';

export { competitionsApi } from './competitions';
export type { Competition, CompetitionListParams, CreateCompetitionPayload } from './competitions';

export { licensesApi } from './licenses';
export type { License } from './licenses';

export { uploadApi } from './upload';
export type { UploadResult } from './upload';

export { statsApi } from './stats';
export type { DashboardStats } from './stats';

export { contactApi } from './contact';
export type { ContactPayload } from './contact';

export { clubApi } from './club';

export { regionsApi } from './regions';
export type { Region } from './regions';

export { default as apiClient, api } from './client';
