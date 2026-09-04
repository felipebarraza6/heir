import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useSession, roleHome } from '@/lib/session';
import { forgotPassword } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const { login } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const role = await login(email, password);
      navigate(from ?? roleHome(role), { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 400 || err.status === 401
            ? 'Credenciales inválidas. Revisa tu correo y contraseña.'
            : err.message,
        );
      } else {
        setError('No se pudo conectar con el servidor Yggdra. Verifica que la API esté activa.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function onForgot() {
    setError('');
    setNotice('');
    if (!email.trim()) {
      setError('Ingresa tu correo para recuperar la contraseña.');
      return;
    }
    try {
      await forgotPassword(email);
      setNotice('Si el correo existe en el sistema, recibirás un enlace de recuperación.');
    } catch {
      setError('No se pudo procesar la solicitud.');
    }
  }

  return (
    <div className="paper-grain flex min-h-screen items-center justify-center bg-[#17140f] px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#a79e91] transition-colors hover:text-[#ece7e0]"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al inicio
        </Link>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#ece7e0]">
          Entrar a <span className="text-[#d4694a]">HEIR</span>
        </h1>
        <p className="mb-8 text-sm text-[#a79e91]">
          Profesionales, pacientes y administración — una sola cuenta Yggdra.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#a79e91]">Correo</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.cl"
              className="border-[rgba(236,231,224,0.15)] bg-[#1f1a13] text-[#ece7e0] placeholder:text-[#a79e91]/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#a79e91]">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-[rgba(236,231,224,0.15)] bg-[#1f1a13] text-[#ece7e0] placeholder:text-[#a79e91]/50"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {notice && <p className="text-sm text-[#a3c98a]">{notice}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4694a] text-white hover:bg-[#e07a5a]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ingresar
          </Button>

          <button
            type="button"
            onClick={onForgot}
            className="w-full text-center text-xs text-[#a79e91] underline-offset-4 transition-colors hover:text-[#ece7e0] hover:underline"
          >
            Olvidé mi contraseña
          </button>
        </form>
      </motion.div>
    </div>
  );
}
