import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Loader2, Send, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ChatMessage, Transaction, formatVND, getNowFormatted } from '../types';

interface AiAdvisorModalProps {
  isOpen: boolean;
  userName: string;
  remainingBudget: number;
  transactions: Transaction[];
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  'Phân tích thói quen chi tiêu hiện tại của mình',
  'Làm sao cưỡng lại cơn thèm mua Flash Sale?',
  'Khi bị stress học tập mình hay mua đồ, phải làm sao?',
];

export function AiAdvisorModal({
  isOpen,
  userName,
  remainingBudget,
  transactions,
  onClose,
}: AiAdvisorModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting on open if empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const { timeStr } = getNowFormatted();
      setMessages([
        {
          id: 'welcome-ai',
          role: 'model',
          text: `Chào ${userName}! Mình là Nhà tư vấn tâm lý tiêu dùng AI của Ví Tỉnh Tảo. Mình ở đây để cùng bạn gỡ rối cảm xúc đằng sau mỗi quyết định mua sắm và giữ vững ngân sách tháng này. Hôm nay bạn đang cân nhắc món đồ nào hay muốn nhìn lại thói quen chi tiêu gần đây?`,
          timeStr,
        },
      ]);
    }
  }, [isOpen, messages.length, userName]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const contextSummary = useMemo(() => {
    const saved = transactions.filter((t) => t.type === 'saving');
    const spent = transactions.filter((t) => t.type === 'expense');
    const totalSaved = saved.reduce((s, x) => s + x.amount, 0);
    const totalSpent = spent.reduce((s, x) => s + x.amount, 0);
    const recentList = transactions
      .slice(0, 6)
      .map(
        (t) =>
          `- [${t.type === 'saving' ? 'Đã hủy/Tiết kiệm' : 'Đã mua/Chi tiêu'}] ${t.productName}: ${formatVND(t.amount)} (Lý do: ${t.reason}, lúc ${t.timeStr} ${t.dateStr})`
      )
      .join('\n');

    return `Tên tài khoản mô phỏng: ${userName}
Ngân sách còn lại trong tháng: ${formatVND(remainingBudget)}
Tổng đã tiết kiệm nhờ quy tắc 24h: ${formatVND(totalSaved)} (${saved.length} lần)
Tổng đã chi tiêu: ${formatVND(totalSpent)} (${spent.length} lần)
Các giao dịch gần đây:\n${recentList || 'Chưa có giao dịch.'}`;
  }, [userName, remainingBudget, transactions]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const { timeStr } = getNowFormatted();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timeStr,
    };

    const historyPayload = messages
      .filter((m) => m.id !== 'welcome-ai')
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          contextSummary,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể nhận phản hồi từ Nhà tư vấn AI.');
      }

      const { timeStr: replyTime } = getNowFormatted();
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'model',
          text: data.reply,
          timeStr: replyTime,
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã xảy ra lỗi kết nối.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#19112E]/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Trò chuyện với Nhà tư vấn tâm lý AI"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full sm:max-w-[520px] h-[92vh] sm:h-[640px] bg-[#FAF8FE] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E5DDFB] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#6A48C9] text-white px-4 py-3.5 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-200" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold font-display truncate">
              Nhà tư vấn tâm lý AI
            </h2>
            <p className="text-[11px] text-purple-100 truncate">
              Gói Premium · Đồng hành kiểm soát chi tiêu cảm xúc
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-[#6A48C9] text-white rounded-br-sm'
                      : 'bg-white text-[#1D1633] border border-[#E6DEFA] rounded-bl-sm shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#7D7399] mt-1 px-1 tabular-nums">{msg.timeStr}</span>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start">
              <div className="bg-white border border-[#E6DEFA] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 text-xs text-[#6F668C]">
                <Loader2 className="w-4 h-4 animate-spin text-[#6A48C9]" />
                <span>Nhà tư vấn đang lắng nghe và phân tích...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3.5 py-2.5">
              {errorMsg}
            </div>
          )}

          <div ref={scrollEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 2 && !isLoading && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="shrink-0 text-xs font-medium bg-white hover:bg-[#EFE9FC] text-[#5433B5] border border-[#DFD4F8] rounded-xl px-3 py-2 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="p-3 bg-white border-t border-[#EFEAF9] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chia sẻ điều bạn đang băn khoăn..."
            disabled={isLoading}
            className="flex-1 min-h-[44px] bg-[#FAF8FE] border border-[#E2DAF7] rounded-xl px-3.5 py-2 text-sm text-[#1D1633] placeholder:text-[#9C91BD] focus:outline-none focus:ring-2 focus:ring-[#6A48C9]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-[#6A48C9] hover:bg-[#5938B8] disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
