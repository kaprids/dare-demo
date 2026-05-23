import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import VideoPlayer from './VideoPlayer';
import AIAnalysis from './AIAnalysis';
import ValuePanel from './ValuePanel';

export default function MainDemo({ onEnding }) {
  const [currentScene, setCurrentScene] = useState('suspense');
  const [isDare, setIsDare] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // 真实 API 分析结果
  const [analysisResult, setAnalysisResult] = useState(null);
  const [rewrittenAd, setRewrittenAd] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSceneChange = useCallback((scene) => {
    setCurrentScene(scene);
    setIsPaused(false);
    setAnalysisResult(null);
    setRewrittenAd(null);
  }, []);

  const handleModeToggle = useCallback(() => {
    setIsDare((prev) => !prev);
  }, []);

  const handlePauseToggle = useCallback(() => {
    setIsPaused((prev) => !prev);
    if (isPaused) {
      setAnalysisResult(null);
      setRewrittenAd(null);
    }
  }, [isPaused]);

  // 截帧后调用 API（仅 DARE 模式）
  const handleFrameCapture = useCallback(async (base64) => {
    if (!isDare) return; // 传统广告模式不调用 API

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setRewrittenAd(null);

    try {
      // 1. 调用情绪分析 API
      const analyzeRes = await fetch('/api/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, sceneId: currentScene }),
      });
      const analyzeData = await analyzeRes.json();

      if (analyzeData.success) {
        setAnalysisResult(analyzeData);

        // 2. 调用文案改写 API
        const scene = (await import('../data/scenes')).scenes[currentScene];
        const rewriteRes = await fetch('/api/rewrite-ad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: analyzeData.mood,
            intensity: analyzeData.intensity,
            sceneId: currentScene,
            originalAd: scene.originalAd.tagline,
          }),
        });
        const rewriteData = await rewriteRes.json();
        if (rewriteData.success) {
          setRewrittenAd(rewriteData.text);
        }
      }
    } catch (err) {
      console.error('API 调用失败:', err);
      // 降级到预设数据
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentScene, isDare]);

  return (
    <motion.div
      className="w-full h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar
        currentScene={currentScene}
        onSceneChange={handleSceneChange}
        isDare={isDare}
        onModeToggle={handleModeToggle}
      />

      <div className="flex-1 flex min-h-0 p-2 gap-2">
        {/* 视频区 65% */}
        <div className="flex-[65] min-w-0">
          <VideoPlayer
            currentScene={currentScene}
            isDare={isDare}
            isPaused={isPaused}
            onPauseToggle={handlePauseToggle}
            onFrameCapture={handleFrameCapture}
            rewrittenAd={rewrittenAd}
          />
        </div>

        {/* AI 分析区 20% */}
        <div className="flex-[20] min-w-0 glass rounded-xl overflow-hidden">
          <AIAnalysis
            currentScene={currentScene}
            isPaused={isPaused}
            analysisResult={analysisResult}
            rewrittenAd={rewrittenAd}
            isAnalyzing={isAnalyzing}
            isDare={isDare}
          />
        </div>

        {/* 三方价值区 15% */}
        <div className="flex-[15] min-w-0 glass rounded-xl overflow-hidden">
          <ValuePanel
            currentScene={currentScene}
            isDare={isDare}
            isPaused={isPaused}
          />
        </div>
      </div>

      {/* 底部提示 */}
      <motion.div
        className="h-8 flex items-center justify-center text-gray-600 text-xs shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="mr-4">点击暂停按钮体验 DARE 广告</span>
        <span className="mr-4">|</span>
        <span className="mr-4">切换顶部情绪标签体验不同场景</span>
        <span>|</span>
        <span className="ml-4">切换模式对比传统广告 vs DARE</span>
      </motion.div>
    </motion.div>
  );
}
