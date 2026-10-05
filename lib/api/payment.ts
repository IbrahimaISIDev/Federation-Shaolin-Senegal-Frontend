import { api } from './client';

export interface WaveInitiateResponse {
  success: boolean;
  data: { checkoutUrl: string; sessionId: string; montant: number };
}

export interface OmInitiateResponse {
  success: boolean;
  data: { paymentUrl: string; orderId: string; montant: number };
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    paid: boolean;
    demandeId: number;
    status: string;
    paidAt?: string;
    type?: string;
    prenom?: string;
    nom?: string;
    montant?: number;
    paymentProvider?: string;
  };
}

// token : jeton d'accès à la demande, remis à la soumission (accessToken)
export const paymentApi = {
  initiateWave: (demandeId: number, token: string) =>
    api.post<WaveInitiateResponse>('/payments/wave/initiate', { demandeId, token }),

  initiateOm: (demandeId: number, token: string) =>
    api.post<OmInitiateResponse>('/payments/om/initiate', { demandeId, token }),

  checkStatus: (demandeId: number, token: string) =>
    api.get<PaymentStatusResponse>(`/payments/status/${demandeId}`, { params: { t: token } }),
};
