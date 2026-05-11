'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Loader2,
  Shield,
  Bell,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { membersApi, uploadApi } from '@/lib/api';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

const profileSchema = z.object({
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  adresse: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Mot de passe actuel requis'),
  newPassword: z.string().min(8, 'Minimum 8 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    competitions: true,
    newsletter: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['member', 'profile'],
    queryFn: () => membersApi.me(),
    staleTime: 5 * 60 * 1000,
  });

  const member = (data as any)?.data;

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { prenom: '', nom: '', email: '', phone: '', adresse: '' },
  });

  useEffect(() => {
    if (member) {
      profileForm.reset({
        prenom: member.prenom ?? '',
        nom: member.nom ?? '',
        email: member.user?.email ?? '',
        phone: member.user?.phone ?? '',
        adresse: member.adresse ?? '',
      });
    }
  }, [member, profileForm]);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      membersApi.updateMe({
        telephone: data.phone || undefined,
        adresse: data.adresse || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'profile'] });
      toast.success('Profil mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour du profil'),
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => uploadApi.uploadMemberPhoto(file),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ['member', 'profile'] });
      setPhotoPreview(result.url);
      toast.success('Photo mise à jour');
    },
    onError: () => toast.error('Erreur lors de l\'upload de la photo'),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    uploadPhotoMutation.mutate(file);
  };

  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordFormData) =>
      authApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    onSuccess: () => {
      toast.success('Mot de passe mis à jour', {
        description: 'Vous allez être déconnecté pour sécuriser votre session.',
      });
      passwordForm.reset();
      setTimeout(() => logout(), 2000);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error ?? 'Erreur lors du changement de mot de passe'),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground gap-2">
        <Loader2 className="w-6 h-6 animate-spin" /> Chargement de votre profil...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon Profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" /><span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" /><span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" /><span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Profil */}
        <TabsContent value="profile">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={profileForm.handleSubmit((d) => updateProfileMutation.mutate(d))}>
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Mettez à jour vos informations de profil.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={photoPreview || member?.photoUrl || undefined} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {member?.prenom?.[0] ?? 'U'}{member?.nom?.[0] ?? 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        disabled={uploadPhotoMutation.isPending}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadPhotoMutation.isPending
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Camera className="w-4 h-4" />}
                        Changer la photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">JPG, PNG ou WebP. Max 5MB.</p>
                    </div>
                  </div>

                  {/* Nom / Prénom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="prenom" className="pl-10" {...profileForm.register('prenom')} disabled />
                      </div>
                      <p className="text-xs text-muted-foreground">Le prénom ne peut être modifié.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input id="nom" {...profileForm.register('nom')} disabled />
                      <p className="text-xs text-muted-foreground">Le nom ne peut être modifié.</p>
                    </div>
                  </div>

                  {/* Email / Téléphone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="email" type="email" className="pl-10" {...profileForm.register('email')} disabled />
                      </div>
                      <p className="text-xs text-muted-foreground">L&apos;email ne peut être modifié.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="phone" type="tel" className="pl-10" {...profileForm.register('phone')} />
                      </div>
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="adresse" className="pl-10" {...profileForm.register('adresse')} />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      {updateProfileMutation.isPending
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Save className="w-4 h-4" />}
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </motion.div>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={passwordForm.handleSubmit((d) => changePasswordMutation.mutate(d))}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Changer de mot de passe
                  </CardTitle>
                  <CardDescription>Assurez-vous d&apos;utiliser un mot de passe fort et unique.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>
                        {field === 'currentPassword' ? 'Mot de passe actuel'
                          : field === 'newPassword' ? 'Nouveau mot de passe'
                          : 'Confirmer le mot de passe'}
                      </Label>
                      <Input id={field} type="password" {...passwordForm.register(field)} />
                      {passwordForm.formState.errors[field] && (
                        <p className="text-sm text-destructive">{passwordForm.formState.errors[field]?.message}</p>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={changePasswordMutation.isPending} className="gap-2">
                      {changePasswordMutation.isPending
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Key className="w-4 h-4" />}
                      Mettre à jour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </motion.div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être informé.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'email' as const, title: 'Notifications par email', desc: 'Recevez des emails pour les mises à jour importantes.' },
                  { key: 'sms' as const, title: 'Notifications SMS', desc: 'Recevez des SMS pour les rappels urgents.' },
                  { key: 'competitions' as const, title: 'Alertes compétitions', desc: 'Soyez informé des prochaines compétitions.' },
                  { key: 'newsletter' as const, title: 'Newsletter', desc: 'Recevez notre newsletter mensuelle.' },
                ].map(({ key, title, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">{title}</Label>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={notifications[key]}
                      onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
