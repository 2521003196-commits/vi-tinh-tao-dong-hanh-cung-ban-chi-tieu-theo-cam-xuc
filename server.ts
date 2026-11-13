import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Content } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/advisor/chat', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng thiết lập khóa API trong Settings > Secrets.',
        });
      }

      const { message, history = [], contextSummary = '' } = req.body as {
        message?: string;
        history?: Array<{ role: 'user' | 'model'; text: string }>;
        contextSummary?: string;
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Tin nhắn không được để trống.' });
      }

      const systemInstruction = `Bạn là Nhà tư vấn tâm lý tiêu dùng AI của ứng dụng "Ví Tỉnh Tảo".
Vai trò của bạn:
- Lắng nghe đồng cảm, không phán xét, giúp người dùng (hiện tại là tài khoản mô phỏng tên Nguyễn A) nhận diện nguyên nhân cảm xúc đằng sau hành vi mua sắm bốc đồng (ví dụ: áp lực học tập/stress, muốn tự thưởng, hiệu ứng FOMO của Flash Sale, ảnh hưởng từ bạn bè/review).
- Đưa ra phân tích tâm lý hành vi nhẹ nhàng, khoa học (như quy tắc trì hoãn 24 giờ, phân biệt nhu cầu thiết yếu và mong muốn nhất thời, cách thay thế phần thưởng tinh thần không tốn kém).
- Trả lời bằng tiếng Việt tự nhiên, ấm áp, súc tích (khoảng 2–4 đoạn ngắn hoặc gạch đầu dòng dễ đọc trên màn hình điện thoại).
- Đây là dữ liệu mô phỏng hiện tại của người dùng trong phiên này:
${contextSummary || 'Người dùng mới bắt đầu sử dụng Ví Tỉnh Tảo.'}`;

      const contents: Content[] = [
        ...history
          .filter((item) => item && typeof item.text === 'string' && item.text.trim())
          .map((item) => ({
            role: item.role,
            parts: [{ text: item.text }],
          })),
        {
          role: 'user',
          parts: [{ text: message.trim() }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        return res.status(502).json({
          error: 'Nhà tư vấn AI không trả về nội dung. Vui lòng thử lại.',
        });
      }

      return res.json({ reply });
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : 'Lỗi kết nối AI';
      console.error('Gemini Advisor error:', errMessage);
      return res.status(500).json({
        error: `Không thể kết nối Nhà tư vấn tâm lý AI lúc này (${errMessage}).`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ví Tỉnh Tảo server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
