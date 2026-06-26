import { useAuth } from "@workspace/replit-auth-web";
import { Shield, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F4C75] via-[#0F4C75]/90 to-[#1B998B]/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#0F4C75] px-8 py-8 text-white text-center">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-xl">PS</span>
            </div>
            <h1 className="text-2xl font-bold">Psicossocial & Recrutamento IA</h1>
            <p className="text-white/70 mt-1 text-sm">Plataforma SaaS B2B</p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#0F4C75]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="h-4 w-4 text-[#0F4C75]" />
                </div>
                <div>
                  <div className="font-semibold text-sm">NR-1 Psicossocial</div>
                  <div className="text-xs text-muted-foreground">Gestão de riscos conforme a legislação brasileira vigente</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#1B998B]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase className="h-4 w-4 text-[#1B998B]" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Recrutamento com IA</div>
                  <div className="text-xs text-muted-foreground">Análise de fit cultural e pipeline inteligente de candidatos</div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => login()}
              className="w-full bg-[#0F4C75] hover:bg-[#0F4C75]/90 text-white h-11 text-base font-semibold"
            >
              Entrar na plataforma
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Acesso seguro e criptografado. Conformidade LGPD.
            </p>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          © 2026 Psicossocial & Recrutamento IA · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
