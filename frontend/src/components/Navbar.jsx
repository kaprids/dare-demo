import { motion } from 'framer-motion';
import { scenes } from '../data/scenes';

const moodKeys = ['suspense', 'romance', 'action', 'family'];

export default function Navbar({ currentScene, onSceneChange, isDare, onModeToggle }) {
  const scene = scenes[currentScene];

  return (
    <motion.nav
      className="h-14 flex items-center justify-between px-6 glass-dark border-b border-white/5 shrink-0 z-50"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-black tracking-wider text-gradient">DARE</h1>
        <span className="text-xs text-gray-500 hidden sm:inline">
          Dynamic Ad Reshaping Engine
        </span>
      </div>

      {/* Mood buttons */}
      <div className="flex items-center gap-1">
        {moodKeys.map((key) => {
          const s = scenes[key];
          const isActive = currentScene === key;
          return (
            <motion.button
              key={key}
              onClick={() => onSceneChange(key)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                ${isActive
                  ? 'text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }
              `}
              style={isActive ? { background: s.accentColor + '33', color: s.accentColor } : {}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-1">{s.emoji}</span>
              {s.name}
            </motion.button>
          );
        })}
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-3">
        <span className={`text-sm transition-colors ${!isDare ? 'text-gray-400' : 'text-gray-600'}`}>
          传统广告
        </span>
        <button
          onClick={onModeToggle}
          className="relative w-12 h-6 rounded-full transition-colors duration-300"
          style={{ background: isDare ? scene.accentColor : '#555' }}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
            animate={{ left: isDare ? '26px' : '2px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        <span className={`text-sm font-medium transition-colors ${isDare ? 'text-white' : 'text-gray-600'}`}>
          DARE模式
        </span>
      </div>
    </motion.nav>
  );
}
