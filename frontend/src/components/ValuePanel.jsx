import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scenes } from '../data/scenes';

export default function ValuePanel({ currentScene, isDare, isPaused }) {
  const scene = scenes[currentScene];
  const [showFlow, setShowFlow] = useState(false);

  useEffect(() => {
    if (isPaused && isDare) {
      const t = setTimeout(() => setShowFlow(true), 6000);
      return () => clearTimeout(t);
    }
    setShowFlow(false);
  }, [isPaused, isDare, currentScene]);

  return (
    <motion.div
      className="h-full flex flex-col p-3 overflow-y-auto"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-xs font-bold text-white/80 mb-1">三方价值</h3>
        <div className="h-px bg-white/10" />
      </div>

      {/* User Value */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass rounded-lg p-2.5 mb-2"
          >
            <p className="text-xs font-bold text-white/80 mb-2 flex items-center gap-1">
              👤 用户价值
            </p>
            <div className="space-y-1.5">
              <MetricRow
                label="打断感"
                before={isDare ? '高' : '高'}
                after={isDare ? '低' : '高'}
                isBetter={isDare}
                color={scene.accentColor}
                show={true}
              />
              <MetricRow
                label="沉浸感"
                value={isDare ? scene.metrics.immersion : '—'}
                color={scene.accentColor}
                show={true}
                isDare={isDare}
              />
              <MetricRow
                label="投诉风险"
                value={isDare ? scene.metrics.complaintRisk : '+12%'}
                color={isDare ? scene.accentColor : '#ef4444'}
                show={true}
                isDare={isDare}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advertiser Value */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-lg p-2.5 mb-2"
          >
            <p className="text-xs font-bold text-white/80 mb-2 flex items-center gap-1">
              📊 广告主ROI
            </p>
            <div className="space-y-1.5">
              <MetricRow
                label="CTR"
                before={scene.metrics.ctr.before}
                after={isDare ? scene.metrics.ctr.after : scene.metrics.ctr.before}
                color={scene.accentColor}
                show={true}
                isDare={isDare}
              />
              <MetricRow
                label="完播率"
                before={scene.metrics.completionRate.before}
                after={isDare ? scene.metrics.completionRate.after : scene.metrics.completionRate.before}
                color={scene.accentColor}
                show={true}
                isDare={isDare}
              />
              <MetricRow
                label="情绪匹配"
                value={isDare ? scene.metrics.emotionMatch : '—'}
                color={scene.accentColor}
                show={true}
                isDare={isDare}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform Value */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-lg p-2.5 mb-2"
          >
            <p className="text-xs font-bold text-white/80 mb-2 flex items-center gap-1">
              🏢 平台收益
            </p>
            <div className="space-y-1.5">
              <MetricRow
                label="eCPM"
                value={isDare ? scene.metrics.ecpm : '—'}
                color={scene.accentColor}
                show={true}
                isDare={isDare}
              />
              <MetricRow
                label="库存效率"
                value={isDare ? scene.metrics.adEfficiency : '—'}
                color={scene.accentColor}
                show={true}
                isDare={isDare}
              />
              <MetricRow
                label="单次曝光"
                value={isDare ? scene.metrics.exposureValue : '—'}
                color={scene.accentColor}
                show={true}
                isDare={isDare}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Value Flow Animation */}
      <AnimatePresence>
        {showFlow && isDare && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-auto pt-2 border-t border-white/5"
          >
            <p className="text-xs text-gray-500 mb-2">价值流动</p>
            <div className="space-y-1">
              {[
                '用户情绪匹配 ↑',
                '广告接受度 ↑',
                '完播率 ↑',
                'CTR ↑',
                'eCPM ↑',
                '平台收入 ↑',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <motion.div
                    className="w-1 h-1 rounded-full"
                    style={{ background: scene.accentColor }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ delay: i * 0.2, duration: 0.5 }}
                  />
                  <span className="text-xs" style={{ color: scene.accentColor + 'cc' }}>
                    {item}
                  </span>
                  {i < 5 && (
                    <motion.span
                      className="text-xs text-white/20 ml-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.2 + 0.1 }}
                    >
                      ↓
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle state */}
      <AnimatePresence>
        {!isPaused && (
          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-gray-600 text-xs text-center">
              暂停视频后
              <br />
              查看三方价值变化
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MetricRow({ label, before, after, value, color, show, isDare }) {
  if (!show) return null;

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      {value !== undefined ? (
        <span
          className="text-xs font-mono font-bold"
          style={{ color: isDare ? color : '#888' }}
        >
          {value}
        </span>
      ) : (
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-600 line-through">{before}</span>
          <span className="text-xs text-white/30">→</span>
          <motion.span
            className="text-xs font-mono font-bold"
            style={{ color }}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {after}
          </motion.span>
        </div>
      )}
    </div>
  );
}
