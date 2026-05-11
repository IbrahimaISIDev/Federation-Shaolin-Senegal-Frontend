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

export const paymentApi = {
  initiateWave: (demandeId: number) =>
    api.post<WaveInitiateResponse>('/payments/wave/initiate', { demandeId }),

  initiateOm: (demandeId: number) =>
    api.post<OmInitiateResponse>('/payments/om/initiate', { demandeId }),

  checkStatus: (demandeId: number) =>
    api.get<PaymentStatusResponse>(`/payments/status/${demandeId}`),
};
