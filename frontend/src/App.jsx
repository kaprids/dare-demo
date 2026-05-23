import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import AccessGate from './components/AccessGate';
import OpeningScene from './components/OpeningScene';
import MainDemo from './components/MainDemo';
import EndingScene from './components/EndingScene';

export default function App() {
  const [phase, setPhase] = useState('gate'); // gate | opening | main | ending

  const handleVerified = useCallback(() => setPhase('opening'), []);
  const handleOpeningComplete = useCallback(() => setPhase('main'), []);
  const handleEnding = useCallback(() => setPhase('ending'), []);
  const handleRestart = useCallback(() => setPhase('opening'), []);

  return (
    <div className="w-full h-full bg-tencent-dark overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'gate' && (
          <AccessGate key="gate" onVerified={handleVerified} />
        )}
        {phase === 'opening' && (
          <OpeningScene key="opening" onComplete={handleOpeningComplete} />
        )}
        {phase === 'main' && (
          <MainDemo key="main" onEnding={handleEnding} />
        )}
        {phase === 'ending' && (
          <EndingScene key="ending" onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  );
}
