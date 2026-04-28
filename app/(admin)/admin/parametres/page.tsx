'use client';

import { useState } from 'react';
import { Settings, Shield, Bell, Globe, Database, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function AdminParametresPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [notifications, setNotifications] = useState({
        newMember: true,
        newAffiliation: true,
        competitions: false,
        newsletter: false,
    });

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 1200));
        setIsSaving(false);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold">Paramètres</h1>
                <p className="text-muted-foreground">Configuration générale du back-office.</p>
            </div>

            {/* Informations générales */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <CardTitle>Informations générales</CardTitle>
                    </div>
                    <CardDescription>Informations publiques de la fédération.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nom de l&apos;organisation</Label>
                        <Input defaultValue="Fédération Sénégalaise des Arts Martiaux Shaolin" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Email de contact</Label>
                            <Input type="email" defaultValue="contact@shaolin-senegal.sn" />
                        </div>
                        <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input type="tel" defaultValue="+221 33 000 00 00" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Site web</Label>
                        <Input type="url" defaultValue="https://shaolin-senegal.sn" />
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>Choisissez les événements qui déclenchent des alertes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { key: 'newMember' as const, label: 'Nouveau membre inscrit', desc: 'Recevoir un email pour chaque nouvel adhérent.' },
                        { key: 'newAffiliation' as const, label: 'Nouvelle demande d\'affiliation', desc: 'Notification lors d\'un dépôt de dossier.' },
                        { key: 'competitions' as const, label: 'Inscriptions compétitions', desc: 'Alerte lors d\'une inscription à une compétition.' },
                        { key: 'newsletter' as const, label: 'Rapport hebdomadaire', desc: 'Résumé d\'activité chaque semaine.' },
                    ].map((item, idx, arr) => (
                        <div key={item.key}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                                <Switch
                                    checked={notifications[item.key]}
                                    onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
                                />
                            </div>
                            {idx < arr.length - 1 && <Separator className="mt-4" />}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Sécurité */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <CardTitle>Sécurité</CardTitle>
                    </div>
                    <CardDescription>Gestion des accès administrateurs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                            <p className="font-medium text-sm">Authentification à deux facteurs</p>
                            <p className="text-xs text-muted-foreground">Protection renforcée pour le compte admin.</p>
                        </div>
                        <Badge variant="outline">Non configuré</Badge>
                    </div>
                    <div className="space-y-2">
                        <Label>Nouveau mot de passe</Label>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                        <Label>Confirmer le mot de passe</Label>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                </CardContent>
            </Card>

            {/* Données */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        <CardTitle>Données</CardTitle>
                    </div>
                    <CardDescription>Export et sauvegarde des données.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="gap-2">
                        <Database className="w-4 h-4" /> Exporter les membres (CSV)
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Database className="w-4 h-4" /> Exporter les clubs (CSV)
                    </Button>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="bg-accent hover:bg-accent/90 gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Enregistrer les paramètres
                </Button>
            </div>
        </div>
    );
}
