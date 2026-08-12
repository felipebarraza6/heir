import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './sections/landing/Landing';
import ProApp from './sections/pro/ProApp';
import PatientApp from './sections/patient/PatientApp';

type View = 'landing' | 'pro' | 'patient';

export default function App() {
  const [view, setView] = useState<View>('landing');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {view === 'landing' && <Landing onEnter={setView} />}
        {view === 'pro' && (
          <ProApp onBack={() => setView('landing')} onSwitchToPatient={() => setView('patient')} />
        )}
        {view === 'patient' && (
          <PatientApp onBack={() => setView('landing')} onSwitchToPro={() => setView('pro')} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
