import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scenes } from '../data/scenes';
import AdOverlay from './AdOverlay';

const videoMap = {
  suspense: '/videos/suspense.mp4',
  romance: '/videos/romance.mp4',
  action: '/videos/action.mp4',
  family: '/videos/family.mp4',
};

export default function VideoPlayer({ currentScene, isDare, isPaused, onPauseToggle, onFrameCapture, rewrittenAd }) {
  const scene = scenes[currentScene];
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showAd, setShowAd] = useState(false);
  const [adStep, setAdStep] = useState(0);

  // 切换场景时重置视频
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => {});
    }
    setShowAd(false);
    setAdStep(0);
  }, [currentScene]);

  // 暂停/播放控制
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPaused) {
      video.pause();
      // DARE 模式才截帧调用 API
      if (isDare) {
        captureFrame();
      }
      const t1 = setTimeout(() => setAdStep(1), 800);
      const t2 = setTimeout(() => setAdStep(2), 3500);
      setShowAd(true);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setShowAd(false);
      setAdStep(0);
      video.play().catch(() => {});
    }
  }, [isPaused, isDare]);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isDare) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
    if (onFrameCapture) onFrameCapture(base64);
  }, [onFrameCapture, isDare]);

  return (
    <motion.div
      className="relative w-full h-full rounded-xl overflow-hidden bg-black"
      transition={{ duration: 0.6 }}
    >
      {/* 真实视频 */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoMap[currentScene]}
        loop
        muted
        playsInline
        autoPlay
      />

      {/* 隐藏的截帧 canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 电影黑边 */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-black/50 z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-black/50 z-10" />

      {/* 场景信息叠加 */}
      <AnimatePresence>
        {!isPaused && (
          <motion.div
            className="absolute top-8 left-4 z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-white/70 text-sm font-medium">{scene.title}</p>
            <p className="text-white/40 text-xs">{scene.subtitle}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 播放器控制栏 */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onPauseToggle}
            className="text-white/90 hover:text-white text-lg transition-colors w-8 h-8 flex items-center justify-center"
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: scene.accentColor }}
              animate={{ width: isPaused ? '68%' : '85%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </div>
          <span className="text-white/50 text-xs">0:10</span>
          <button className="text-white/50 hover:text-white text-sm">🔊</button>
        </div>
      </div>

      {/* 暂停时的播放按钮 */}
      <AnimatePresence>
        {isPaused && !showAd && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30 z-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <span className="text-white text-2xl ml-1">▶</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 广告浮层 */}
      <AnimatePresence>
        {showAd && isPaused && (
          <AdOverlay scene={scene} isDare={isDare} adStep={adStep} rewrittenAd={rewrittenAd} />
        )}
      </AnimatePresence>

      {/* 场景切换闪光 */}
      <AnimatePresence>
        <motion.div
          key={currentScene + '-flash'}
          className="absolute inset-0 bg-white pointer-events-none z-50"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
    </motion.div>
  );
}
