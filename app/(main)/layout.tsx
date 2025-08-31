
import Link from "next/link";
import { hasEnvVars } from "@/lib/utils/supabase/check-env-vars";
import AuthButton from "@/components/dashboard/header-auth";
import { EnvVarWarning } from "@/components/dashboard/env-var-warning";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col items-center w-screen">
      {/* <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm border-b-foreground/10 h-16">
              <div className="w-full max-w-7xl mx-auto flex justify-between items-center h-full px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <Link
                    href={"/"}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-amber-600 font-bold text-lg hover:opacity-80 transition-opacity"
                  >
                    Paycasso
                  </Link>
                  <div className="flex items-center gap-2"></div>
                </div>
                
              </div>
            </nav> */}
      <div className="ml-18 px-16 py-8 w-full">
        <div className="flex justify-between items-center mb-8 w-full">
          <div>
            <h1 className="text-3xl font-semibold mb-1">
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm">
              You Paycasso Escrow at a glance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
            <div className="flex items-center space-x-2">
            </div>
          </div>
        </div>
      </div>
      {children}
    </main>
  );
}
