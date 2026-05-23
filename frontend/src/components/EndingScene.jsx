import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const metrics = [
  { label: '完播率', value: '+58%', delay: 0.5 },
  { label: 'CTR', value: '+216%', delay: 0.8 },
  { label: 'eCPM', value: '+37%', delay: 1.1 },
  { label: '会员留存', value: '+15%', delay: 1.4 },
];

export default function EndingScene({ onRestart }) {
  const [showMetrics, setShowMetrics] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowMetrics(true), 500);
    const t2 = setTimeout(() => setShowFinal(true), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      className="w-full h-full bg-black flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated metrics */}
      {showMetrics && (
        <div className="flex gap-8 mb-16">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: m.delay, type: 'spring' }}
            >
              <motion.p
                className="text-4xl font-black text-gradient mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: m.delay + 0.2, type: 'spring', stiffness: 200 }}
              >
                {m.value}
              </motion.p>
              <p className="text-sm text-gray-500">{m.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Final message */}
      {showFinal && (
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-2xl text-white/90 font-light leading-relaxed mb-8">
              "DARE 不只是优化广告，
              <br />
              而是在重新定义广告与用户的关系。"
            </p>
          </motion.div>

          <motion.h1
            className="text-6xl font-black tracking-wider text-gradient mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
            DARE
          </motion.h1>

          <motion.p
            className="text-gray-500 text-sm tracking-widest mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Dynamic Ad Reshaping Engine
          </motion.p>

          <motion.p
            className="text-gray-600 text-xs mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            腾讯视频未来广告体验原型 · PCG 校园 AI 产品创意大赛
          </motion.p>

          {/* Restart button */}
          <motion.button
            onClick={onRestart}
            className="px-8 py-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            重新体验
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
