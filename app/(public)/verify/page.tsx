'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle2, XCircle, Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { licensesApi, type VerifyResult } from '@/lib/api/licenses';

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyFallback() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Loader2 className="w-12 h-12 animate-spin text-muted-foreground mx-auto" />
    </div>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    licensesApi
      .verify(token)
      .then((res) => setResult(res.data))
      .catch(() => setError("La vérification a échoué. Réessayez dans un instant."))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-foreground">Vérification de licence</h1>
          <p className="text-sm text-muted-foreground">
            Fédération ADSS — Association Disciples Shaolin Si Sénégal
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          </div>
        ) : !token ? (
          <StatusCard
            icon={<ShieldAlert className="w-16 h-16 text-amber-500" />}
            title="Aucun code fourni"
            message="Ce lien de vérification est incomplet. Scannez à nouveau le QR code de la licence."
            tone="amber"
          />
        ) : error ? (
          <StatusCard
            icon={<ShieldAlert className="w-16 h-16 text-amber-500" />}
            title="Erreur de vérification"
            message={error}
            tone="amber"
          />
        ) : result?.valid ? (
          <ValidCard result={result} />
        ) : (
          <StatusCard
            icon={<XCircle className="w-16 h-16 text-destructive" />}
            title="Licence non valide"
            message={result?.reason ?? "Ce QR code n'a pas pu être vérifié."}
            tone="destructive"
          />
        )}
      </div>
    </div>
  );
}

function ValidCard({ result }: { result: VerifyResult }) {
  const member = result.member!;
  const license = result.license!;

  return (
    <Card className="overflow-hidden">
      <div className="bg-green-50 border-b border-green-200 px-6 py-4 flex items-center gap-3">
        <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
        <div>
          <p className="font-semibold text-green-800">Licence valide</p>
          <p className="text-sm text-green-700">Saison {license.annee}</p>
        </div>
      </div>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center gap-4">
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={`${member.prenom} ${member.nom}`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground">
              {member.prenom[0]}
              {member.nom[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">
              {member.prenom} {member.nom}
            </p>
            <p className="text-sm text-muted-foreground">{member.club}</p>
          </div>
        </div>

        <Separator />

        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          {member.grade && (
            <>
              <dt className="text-muted-foreground">Grade</dt>
              <dd className="text-right font-medium">{member.grade}</dd>
            </>
          )}
          {member.discipline && (
            <>
              <dt className="text-muted-foreground">Discipline</dt>
              <dd className="text-right font-medium">{member.discipline}</dd>
            </>
          )}
          <dt className="text-muted-foreground">Région</dt>
          <dd className="text-right font-medium">{member.region}</dd>
          <dt className="text-muted-foreground">Statut</dt>
          <dd className="text-right">
            <Badge variant="default" className="bg-green-600">
              {license.status}
            </Badge>
          </dd>
          {license.dateFin && (
            <>
              <dt className="text-muted-foreground">Valide jusqu&apos;au</dt>
              <dd className="text-right font-medium">
                {new Date(license.dateFin).toLocaleDateString('fr-FR')}
              </dd>
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

function StatusCard({
  icon,
  title,
  message,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  tone: 'amber' | 'destructive';
}) {
  const toneClasses =
    tone === 'amber'
      ? 'bg-amber-50 border-amber-200 text-amber-800'
      : 'bg-red-50 border-red-200 text-destructive';

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="flex justify-center">{icon}</div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <div className={`rounded-xl border p-4 text-sm ${toneClasses}`}>{message}</div>
      </CardContent>
    </Card>
  );
}
