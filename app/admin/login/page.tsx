import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const session = await verifySession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Acceso administrador</h1>
          <p className="mt-2 text-sm text-gray-600">Introduce tus credenciales para acceder al panel.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}