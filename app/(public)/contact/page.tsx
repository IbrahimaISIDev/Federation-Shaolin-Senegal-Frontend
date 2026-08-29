'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactApi } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { settingsApi } from '@/lib/api/settings';

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Veuillez sélectionner un sujet'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjects = [
  { id: 'info', label: 'Demande d\'informations générales' },
  { id: 'affiliation', label: 'Affiliation / Licence' },
  { id: 'competition', label: 'Compétitions' },
  { id: 'club', label: 'Création de club' },
  { id: 'partenariat', label: 'Partenariat' },
  { id: 'presse', label: 'Presse / Média' },
  { id: 'autre', label: 'Autre' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get(),
    staleTime: 5 * 60 * 1000,
  });
  const contactPhone = settingsData?.data.contactPhone || '+221 77 265 74 26';
  const contactEmail = settingsData?.data.contactEmail || 'contact@shaolin-senegal.sn';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const subject = watch('subject');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await contactApi.send(data);
      setIsSubmitted(true);
      reset();
    } catch {
      // Error handled silently — form stays open so user can retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Une question ? Une suggestion ? N&apos;hésitez pas à nous contacter.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Informations de contact
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Adresse</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          123 Avenue Cheikh Anta Diop<br />
                          Dakar, Sénégal
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Téléphone</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          +221 33 123 45 67<br />
                          {contactPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Email</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {contactEmail}<br />
                          info@shaolin-senegal.sn
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Horaires</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Lundi - Vendredi: 9h - 18h<br />
                          Samedi: 9h - 13h
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Suivez-nous
                  </h2>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5 text-primary" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-primary" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5 text-primary" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 md:p-8">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-success" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Message envoyé !
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Nous vous répondrons dans les plus brefs délais.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>
                        Envoyer un autre message
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-foreground mb-6">
                        Envoyez-nous un message
                      </h2>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nom complet *</Label>
                            <Input
                              id="name"
                              placeholder="Votre nom"
                              {...register('name')}
                              className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && (
                              <p className="text-sm text-destructive">
                                {errors.name.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="votre@email.com"
                              {...register('email')}
                              className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && (
                              <p className="text-sm text-destructive">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone (optionnel)</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="77 123 45 67"
                              {...register('phone')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="subject">Sujet *</Label>
                            <Select
                              value={subject}
                              onValueChange={(value) =>
                                setValue('subject', value, { shouldValidate: true })
                              }
                            >
                              <SelectTrigger
                                className={errors.subject ? 'border-destructive' : ''}
                              >
                                <SelectValue placeholder="Sélectionner un sujet" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects.map((s) => (
                                  <SelectItem key={s.id} value={s.id}>
                                    {s.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.subject && (
                              <p className="text-sm text-destructive">
                                {errors.subject.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="Votre message..."
                            rows={6}
                            {...register('message')}
                            className={errors.message ? 'border-destructive' : ''}
                          />
                          {errors.message && (
                            <p className="text-sm text-destructive">
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Envoyer le message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Carte interactive</p>
            <p className="text-sm text-muted-foreground/70">
              123 Avenue Cheikh Anta Diop, Dakar
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
