import { api } from './client';

export interface ContactPayload {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export const contactApi = {
    send: (data: ContactPayload) =>
        api.post<{ message: string }>('/contact', data),
};
