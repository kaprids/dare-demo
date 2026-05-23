import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OpeningScene({ onComplete }) {
  const [step, setStep] = useState(0); // 0=ad-play, 1=shake, 2=blackout, 3=reveal

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 3000),
      setTimeout(() => setStep(2), 4500),
      setTimeout(() => setStep(3), 6500),
      setTimeout(() => onComplete(), 9000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="w-full h-full relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Simulated "video" playing */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900">
        {/* Fake video frame lines */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="h-px bg-white/20"
              style={{ marginTop: `${i * 5}%` }}
            />
          ))}
        </div>

        {/* Scene description */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 0 && step < 2 ? 1 : 0 }}
          >
            <div className="text-6xl mb-6">🌧️</div>
            <p className="text-gray-400 text-lg mb-2">《暗夜追凶》第6集</p>
            <p className="text-gray-300 text-xl max-w-md mx-auto leading-relaxed">
              男主站在雨中，凝视着废弃工厂。
              <br />
              钢琴低频BGM缓缓响起...
            </p>
          </motion.div>
        </div>

        {/* Fake player controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3 text-white/50 text-sm">
            <span>▶</span>
            <div className="flex-1 h-1 bg-white/20 rounded-full">
              <motion.div
                className="h-full bg-white/40 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: step >= 0 && step < 2 ? '68%' : '68%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </div>
            <span>42:18 / 1:02:00</span>
          </div>
        </div>

        {/* Skip rate badge */}
        <AnimatePresence>
          {step >= 1 && step < 2 && (
            <motion.div
              className="absolute top-6 right-6 bg-red-500/90 px-4 py-2 rounded-lg text-white font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              用户跳过率：78%
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ad interruption - the "crash" */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              className="absolute inset-0 bg-white flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0.8, 1],
              }}
              transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }}
            >
              <motion.div
                className="text-center"
                animate={{
                  x: [0, -5, 5, -3, 3, 0],
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-5xl mb-4">☕</div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  醒醒咖啡，醇香提神！
                </p>
                <p className="text-gray-600 text-lg">
                  全新口味，限时特惠！立即购买！
                </p>
                <div className="mt-6 flex gap-4 justify-center">
                  <div className="bg-red-500 text-white px-6 py-2 rounded font-bold text-lg">
                    立即购买
                  </div>
                  <div className="border-2 border-gray-400 text-gray-600 px-6 py-2 rounded text-lg">
                    5秒后可跳过
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Blackout */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            className="absolute inset-0 bg-black flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-2xl text-gray-300 text-center max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              "问题不是广告存在，
              <br />
              而是广告出现的方式。"
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DARE reveal */}
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <h1 className="text-7xl font-black tracking-wider mb-4 text-gradient">
                DARE
              </h1>
              <p className="text-xl text-gray-400 tracking-widest mb-2">
                Dynamic Ad Reshaping Engine
              </p>
              <p className="text-lg text-gray-500">
                不是让广告消失，而是让广告值得被看见
              </p>
            </motion.div>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <motion.div
                  className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
