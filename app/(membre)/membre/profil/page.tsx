'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REGIONS } from '@/lib/constants';
import { membersApi, uploadApi } from '@/lib/api';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^(\+221)?[0-9]{9}$/, 'Numéro invalide'),
  address: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  region: z.string().min(1, 'Région requise'),
  bio: z.string().optional(),
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

  const member = data?.data;

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      region: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (member) {
      profileForm.reset({
        firstName: member.user?.firstName || '',
        lastName: member.user?.lastName || '',
        email: member.user?.email || '',
        phone: member.telephone || '',
        address: member.adresse || '',
        city: member.ville || '',
        region: member.region || '',
        bio: member.bio || '',
      });
    }
  }, [member, profileForm]);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return membersApi.updateMe({
        telephone: data.phone,
        adresse: data.address,
        ville: data.city,
        region: data.region,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', 'profile'] });
      toast.success('Profil mis à jour', {
        description: 'Vos informations ont été enregistrées avec succès.'
      });
    },
    onError: () => {
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la mise à jour du profil.'
      });
    }
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => uploadApi.uploadMemberPhoto(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['member', 'profile'] });
      setPhotoPreview(result.url);
      toast.success('Photo mise à jour');
    },
    onError: () => {
      toast.error('Erreur lors de l\'upload de la photo');
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Prévisualisation locale immédiate
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
    onError: (err: unknown) => {
      const apiError = err as { response?: { data?: { error?: string } } };
      toast.error(apiError?.response?.data?.error ?? 'Erreur lors du changement de mot de passe');
    },
  });

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

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
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations de profil.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={photoPreview || member?.photoUrl || undefined} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {profileForm.watch('firstName')?.[0] || 'U'}{profileForm.watch('lastName')?.[0] || 'S'}
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
                        {uploadPhotoMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                        Changer la photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, PNG ou WebP. Max 5MB.
                      </p>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          className="pl-10"
                          {...profileForm.register('firstName')}
                          disabled
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Le prénom ne peut être modifié.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        {...profileForm.register('lastName')}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Le nom ne peut être modifié.</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          {...profileForm.register('email')}
                          disabled
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">L&apos;email ne peut être modifié.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          {...profileForm.register('phone')}
                        />
                      </div>
                      {profileForm.formState.errors.phone && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="address"
                        className="pl-10"
                        {...profileForm.register('address')}
                      />
                    </div>
                    {profileForm.formState.errors.address && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        {...profileForm.register('city')}
                      />
                      {profileForm.formState.errors.city && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Région</Label>
                      <Select
                        value={profileForm.watch('region')}
                        onValueChange={(value) => profileForm.setValue('region', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGIONS.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {profileForm.formState.errors.region && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.region.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      placeholder="Parlez-nous de vous..."
                      {...profileForm.register('bio')}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Changer de mot de passe
                  </CardTitle>
                  <CardDescription>
                    Assurez-vous d&apos;utiliser un mot de passe fort et unique.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...passwordForm.register('currentPassword')}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register('newPassword')}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      className="gap-2"
                    >
                      {changePasswordMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                      Mettre à jour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Choisissez comment vous souhaitez être informé.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des emails pour les mises à jour importantes.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des SMS pour les rappels urgents.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sms: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Alertes compétitions</Label>
                    <p className="text-sm text-muted-foreground">
                      Soyez informé des prochaines compétitions.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.competitions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, competitions: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez notre newsletter mensuelle.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newsletter: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
