import { useEffect, type ReactNode } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { SessionProvider, useSession, roleHome, type AppRole } from '@/lib/session';
import Landing from '@/sections/landing/Landing';
import ProApp from '@/sections/pro/ProApp';
import PatientApp from '@/sections/patient/PatientApp';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';

/** Guard de rutas autenticadas por rol de producto. */
function RequireRole({ allow, children }: { allow: AppRole[]; children: ReactNode }) {
  const { isAuthenticated, role, hydrated } = useSession();
  const location = useLocation();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#17140f]">
        <Loader2 className="h-6 w-6 animate-spin text-[#d4694a]" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (role && !allow.includes(role)) {
    return <Navigate to={roleHome(role)} replace />;
  }
  return <>{children}</>;
}

function LandingRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSession();

  return (
    <Landing
      onEnter={(view) => {
        if (view === 'patient') {
          navigate('/demo/paciente');
          return;
        }
        // Panel profesional: si ya hay sesión, directo al home del rol; si no, login.
        navigate(isAuthenticated && role ? roleHome(role) : '/login');
      }}
    />
  );
}

function PatientHome() {
  const { logout } = useSession();
  const navigate = useNavigate();
  return (
    <PatientApp
      onBack={() => {
        void logout().then(() => navigate('/'));
      }}
      onSwitchToPro={() => navigate('/login')}
    />
  );
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<LandingRoute />} />
          <Route path="/login" element={<Login />} />

          {/* Vistas reales (Yggdra) */}
          <Route
            path="/panel"
            element={
              <RequireRole allow={['profesional', 'superadmin']}>
                <Dashboard />
              </RequireRole>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireRole allow={['superadmin']}>
                <Admin />
              </RequireRole>
            }
          />
          <Route
            path="/paciente"
            element={
              <RequireRole allow={['paciente']}>
                <PatientHome />
              </RequireRole>
            }
          />

          {/* Demo visual original */}
          <Route path="/demo/pro" element={<DemoPro />} />
          <Route path="/demo/paciente" element={<DemoPatient />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function DemoPro() {
  const navigate = useNavigate();
  return <ProApp onBack={() => navigate('/')} onSwitchToPatient={() => navigate('/demo/paciente')} />;
}

function DemoPatient() {
  const navigate = useNavigate();
  return <PatientApp onBack={() => navigate('/')} onSwitchToPro={() => navigate('/demo/pro')} />;
}

export default function App() {
  return (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  );
}
