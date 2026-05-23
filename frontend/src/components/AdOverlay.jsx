import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '../hooks/useTypewriter';

export default function AdOverlay({ scene, isDare, adStep, rewrittenAd }) {
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (adStep >= 2) {
      const t = setTimeout(() => setShowComparison(true), 500);
      return () => clearTimeout(t);
    }
    setShowComparison(false);
  }, [adStep]);

  if (isDare) {
    return <DareAd scene={scene} adStep={adStep} showComparison={showComparison} rewrittenAd={rewrittenAd} />;
  }
  return <TraditionalAd scene={scene} />;
}

function TraditionalAd({ scene }) {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.95 }}
        transition={{ duration: 0.1 }}
      />
      <motion.div
        className="relative text-center p-8"
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="text-6xl mb-4">☕</div>
        <p className="text-4xl font-black text-gray-900 mb-3">{scene.originalAd.tagline}</p>
        <p className="text-gray-600 text-lg mb-6">{scene.originalAd.description}</p>
        <div className="flex gap-4 justify-center">
          <div className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold text-lg">立即购买</div>
          <div className="border-2 border-gray-300 text-gray-500 px-8 py-3 rounded-lg text-lg">5秒后可跳过</div>
        </div>
      </motion.div>
      <motion.div
        className="absolute top-4 right-4 bg-red-500/90 px-4 py-2 rounded-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-white font-bold text-sm">跳过率：{scene.metrics.skipRate.before}%</span>
      </motion.div>
    </motion.div>
  );
}

function DareAd({ scene, adStep, showComparison, rewrittenAd }) {
  // 优先用 API 改写文案
  const aiText = rewrittenAd || scene.aiAd.tagline.replace(/\n/g, ' ');
  const { displayed: tagline, isDone: taglineDone } = useTypewriter(
    aiText,
    60,
    adStep >= 2 ? 800 : 99999
  );

  return (
    <motion.div
      className="absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: scene.bgGradient }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.92 }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="w-full h-px bg-white animate-scan" />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center p-6">
        {adStep >= 1 && adStep < 2 && (
          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              className="w-8 h-8 border-2 border-t-transparent rounded-full mx-auto mb-4"
              style={{ borderColor: scene.accentColor, borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-white/60 text-sm">AI 正在分析画面情绪...</p>
          </motion.div>
        )}

        {showComparison && (
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                className="glass rounded-xl p-4 opacity-50"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 0.5 }}
              >
                <p className="text-xs text-gray-500 mb-2">原始广告</p>
                <p className="text-gray-400 text-sm line-through">{scene.originalAd.tagline}</p>
                <div className="mt-2 h-16 bg-gray-800/50 rounded flex items-center justify-center">
                  <span className="text-gray-600 text-xs">普通商业海报</span>
                </div>
              </motion.div>

              <motion.div
                className="rounded-xl p-4 border"
                style={{ borderColor: scene.accentColor + '44', background: scene.accentColor + '11' }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs mb-2" style={{ color: scene.accentColor }}>
                  AI 重构广告
                  {rewrittenAd && <span className="ml-1 text-green-400/60">（LLM生成）</span>}
                </p>
                <p className="text-white text-lg font-bold whitespace-pre-line leading-relaxed">
                  {tagline}
                  {!taglineDone && (
                    <motion.span
                      className="inline-block w-0.5 h-5 ml-0.5"
                      style={{ background: scene.accentColor }}
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                  )}
                </p>
                <div
                  className="mt-2 h-16 rounded flex items-center justify-center text-xs"
                  style={{ background: scene.accentColor + '15', color: scene.accentColor + 'cc' }}
                >
                  {scene.aiAd.visualDesc}
                </div>
              </motion.div>
            </div>

            <motion.p
              className="text-center text-white/40 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              静默融入 · 无强制跳转 · 无声音打断 · 像剧情的延续
            </motion.p>
          </motion.div>
        )}
      </div>

      {showComparison && (
        <motion.div
          className="absolute top-4 right-4 px-4 py-2 rounded-lg"
          style={{ background: scene.accentColor + '22' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span className="font-bold text-sm" style={{ color: scene.accentColor }}>
            广告接受度：{scene.metrics.immersion}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
