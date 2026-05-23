import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scenes } from '../data/scenes';
import { useAnimatedNumber } from '../hooks/useTypewriter';

export default function AIAnalysis({ currentScene, isPaused, analysisResult, rewrittenAd, isAnalyzing, isDare }) {
  const [activeStep, setActiveStep] = useState(-1);
  const scene = scenes[currentScene];

  // 优先用 API 结果，降级用预设
  const mood = analysisResult?.mood || scene.mood;
  const moodIntensity = analysisResult?.intensity || scene.moodIntensity;
  const moodSources = analysisResult?.sources || scene.moodSources;
  const aiTagline = rewrittenAd || scene.aiAd.tagline.replace(/\n/g, ' ');

  const intensity = useAnimatedNumber(
    isPaused ? moodIntensity : 0,
    1200,
    isPaused ? 2800 : 99999
  );

  useEffect(() => {
    if (isPaused && isDare) {
      setActiveStep(-1);
      const delays = [0, 1500, 2500, 4000, 5500, 7500];
      const timers = delays.map((d, i) => setTimeout(() => setActiveStep(i), d));
      return () => timers.forEach(clearTimeout);
    } else {
      setActiveStep(-1);
    }
  }, [isPaused, currentScene, isDare]);

  return (
    <motion.div
      className="h-full flex flex-col p-4 overflow-y-auto"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* 标题 */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white/80 mb-1 flex items-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ background: scene.accentColor }}
            animate={isPaused ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          AI 实时分析
          {analysisResult && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 ml-1">
              LIVE
            </span>
          )}
        </h3>
        <div className="h-px bg-white/10" />
      </div>

      <div className="flex-1 space-y-3">
        {/* 空闲状态 */}
        <AnimatePresence>
          {!isPaused && (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-4xl mb-3 opacity-30">🤖</div>
              <p className="text-gray-600 text-sm">点击视频暂停按钮</p>
              <p className="text-gray-600 text-sm">触发 AI 情绪分析</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 传统广告模式提示 */}
        <AnimatePresence>
          {isPaused && !isDare && (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-4xl mb-3 opacity-30">📺</div>
              <p className="text-gray-600 text-sm">传统广告模式</p>
              <p className="text-gray-500 text-xs mt-2">无 AI 分析，广告与内容割裂</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 0: 正在分析 */}
        <AnimatePresence>
          {isPaused && isDare && activeStep >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <motion.div
                className="w-4 h-4 border-2 border-t-transparent rounded-full"
                style={{ borderColor: scene.accentColor, borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              <span className="text-white/60 text-xs">
                {isAnalyzing ? '正在通过视觉模型分析画面...' : '正在分析当前内容情绪...'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: 分析完成 */}
        <AnimatePresence>
          {isPaused && isDare && activeStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs" style={{ color: scene.accentColor }}>✓</span>
              <span className="text-white/80 text-xs">情绪识别完成</span>
              {analysisResult && (
                <span className="text-xs text-green-400/60">（视觉模型）</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 2: 情绪详情 */}
        <AnimatePresence>
          {isPaused && isDare && activeStep >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">当前情绪</span>
                <span className="text-sm font-bold" style={{ color: scene.accentColor }}>
                  {mood}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">情绪强度</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: scene.accentColor }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${intensity}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono" style={{ color: scene.accentColor }}>
                    {intensity}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: 识别来源 */}
        <AnimatePresence>
          {isPaused && isDare && activeStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-3"
            >
              <p className="text-xs text-gray-400 mb-2">识别来源</p>
              <div className="space-y-1.5">
                {moodSources.map((source, i) => (
                  <motion.div
                    key={source}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <span className="text-xs" style={{ color: scene.accentColor }}>✔</span>
                    <span className="text-xs text-white/70">{source}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: 生成广告 */}
        <AnimatePresence>
          {isPaused && isDare && activeStep >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <motion.div
                className="w-4 h-4 border-2 border-t-transparent rounded-full"
                style={{ borderColor: scene.accentColor, borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              <span className="text-white/60 text-xs">
                {rewrittenAd ? 'AI 文案改写完成' : '正在生成情绪匹配广告...'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 5: AI 改写结果 */}
        <AnimatePresence>
          {isPaused && isDare && activeStep >= 5 && rewrittenAd && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-3 border"
              style={{ borderColor: scene.accentColor + '33', background: scene.accentColor + '0a' }}
            >
              <p className="text-xs mb-1.5" style={{ color: scene.accentColor }}>AI 改写文案</p>
              <p className="text-white text-sm font-medium leading-relaxed">
                {rewrittenAd}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 5 无 API 时的完成状态 */}
        <AnimatePresence>
          {isPaused && isDare && activeStep >= 5 && !rewrittenAd && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs" style={{ color: scene.accentColor }}>✓</span>
              <span className="text-xs font-medium" style={{ color: scene.accentColor }}>
                广告生成完成
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 处理链路 */}
      <AnimatePresence>
        {isPaused && isDare && activeStep >= 5 && (
          <motion.div
            className="mt-3 pt-3 border-t border-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-gray-600 mb-2">处理链路</p>
            <div className="flex flex-wrap gap-1">
              {['视觉模型', '情绪识别', 'LLM改写', '安全审核', '渲染'].map((tag, i) => (
                <motion.span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: scene.accentColor + '15', color: scene.accentColor + 'aa' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
