import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 生产环境：托管前端构建文件
app.use(express.static(join(__dirname, 'public')));

const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;
const ACCESS_CODE = process.env.ACCESS_CODE || 'dare2026';

// ====== 频率限制 ======
const requestLog = new Map(); // ip -> [timestamps]
const RATE_LIMIT = 5;         // 每分钟最多 5 次
const RATE_WINDOW = 60 * 1000; // 1 分钟

function checkRateLimit(ip) {
  const now = Date.now();
  const logs = (requestLog.get(ip) || []).filter(t => now - t < RATE_WINDOW);
  if (logs.length >= RATE_LIMIT) return false;
  logs.push(now);
  requestLog.set(ip, logs);
  return true;
}

// ====== 简单密码验证 ======
app.post('/api/verify', (req, res) => {
  const { code } = req.body;
  if (code === ACCESS_CODE) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: '密码错误' });
  }
});

// ====== 情绪分析（带限流） ======
app.post('/api/analyze-emotion', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ success: false, error: '请求过于频繁，请稍后再试' });
  }

  const { imageBase64, sceneId } = req.body;

  const scenePrompts = {
    suspense: '这是一个悬疑剧的暂停画面，暗黑阴郁风格',
    romance: '这是一个甜宠剧的暂停画面，温暖浪漫风格',
    action: '这是一个热血剧的暂停画面，激烈燃情风格',
    family: '这是一个亲子剧的暂停画面，温馨治愈风格',
  };

  const prompt = `你是腾讯视频的AI情绪分析引擎。${scenePrompts[sceneId] || ''}。
请分析这个视频画面的情绪，返回JSON格式：
{
  "mood": "情绪标签（2-4个字）",
  "intensity": 情绪强度百分比数字,
  "sources": ["识别来源1", "识别来源2", "识别来源3", "识别来源4"],
  "visualDesc": "画面风格描述（10字内）"
}
只返回JSON，不要其他文字。`;

  try {
    const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.json({ success: true, ...JSON.parse(jsonMatch[0]) });
    } else {
      res.json({ success: true, mood: '未知', intensity: 50, sources: ['画面分析'], visualDesc: '电影感画面' });
    }
  } catch (error) {
    console.error('情绪分析失败:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ====== 广告文案改写（带限流） ======
app.post('/api/rewrite-ad', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ success: false, error: '请求过于频繁，请稍后再试' });
  }

  const { mood, intensity, sceneId, originalAd } = req.body;

  const prompt = `你是腾讯视频的AI广告创意引擎。
当前用户正在观看的视频情绪：${mood}（强度${intensity}%）
原始广告文案：${originalAd}
请将这段广告文案改写为与当前情绪高度融合的版本。
要求：
1. 保留品牌核心信息
2. 语言风格匹配${mood}的情绪氛围
3. 字数控制在20字以内
4. 像是剧情的自然延续，不像广告
直接输出改写后的文案，不要其他解释。`;

  try {
    const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || '';
    res.json({ success: true, text });
  } catch (error) {
    console.error('文案改写失败:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SPA 兜底：所有非 API 请求返回前端页面
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`DARE 后端已启动: http://localhost:${PORT}`));
