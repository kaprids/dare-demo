import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AccessGate({ onVerified }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        onVerified();
      } else {
        setError('密码错误');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full h-full bg-tencent-dark flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="glass rounded-2xl p-8 w-full max-w-sm text-center"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring' }}
      >
        <h1 className="text-4xl font-black tracking-wider text-gradient mb-2">DARE</h1>
        <p className="text-gray-500 text-sm mb-8">Dynamic Ad Reshaping Engine</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入访问密码"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-center text-sm placeholder-gray-600 focus:outline-none focus:border-tencent-accent/50 transition-colors mb-3"
            autoFocus
          />

          {error && (
            <motion.p
              className="text-red-400 text-xs mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !code}
            className="w-full py-3 rounded-lg bg-tencent-accent/20 text-tencent-accent font-medium text-sm hover:bg-tencent-accent/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? '验证中...' : '进入 Demo'}
          </button>
        </form>

        <p className="text-gray-700 text-xs mt-6">腾讯视频未来广告体验原型</p>
      </motion.div>
    </motion.div>
  );
}
