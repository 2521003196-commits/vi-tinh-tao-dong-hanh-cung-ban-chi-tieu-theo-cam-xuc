import { useMemo } from 'react';
import { Download, X } from 'lucide-react';
import { Transaction, formatVND } from '../types';

interface PsychologyReportModalProps {
  isOpen: boolean;
  userName: string;
  transactions: Transaction[];
  onClose: () => void;
}

export function PsychologyReportModal({
  isOpen,
  userName,
  transactions,
  onClose,
}: PsychologyReportModalProps) {
  const triggerStats = useMemo(() => {
    const map = new Map<string, { count: number; saved: number; spent: number }>();
    for (const tx of transactions) {
      const cur = map.get(tx.reason) || { count: 0, saved: 0, spent: 0 };
      cur.count += 1;
      if (tx.type === 'saving') cur.saved += tx.amount;
      else cur.spent += tx.amount;
      map.set(tx.reason, cur);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [transactions]);

  if (!isOpen) return null;

  const topTrigger = triggerStats[0]?.[0] || 'Chưa đủ dữ liệu';

  const handleDownloadTxt = () => {
    const lines = [
      `BÁO CÁO PHÂN TÍCH TÂM LÝ TIÊU DÙNG — VÍ TỈNH TẢO`,
      `Tài khoản mô phỏng: ${userName}`,
      `Nguyên nhân kích hoạt phổ biến nhất: ${topTrigger}`,
      ``,
      `Chi tiết theo từng trạng thái cảm xúc:`,
      ...triggerStats.map(
        ([reason, stat]) =>
          `- ${reason}: ${stat.count} lần | Đã giữ lại: +${formatVND(stat.saved)} | Đã chi: -${formatVND(stat.spent)}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bao-cao-tam-ly-tieu-dung-vi-tinh-tao.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#19112E]/55 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Báo cáo phân tích tâm lý tiêu dùng"
    >
      <div className="w-full sm:max-w-[460px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E5DDFB] overflow-hidden max-h-[88vh] flex flex-col">
        <div className="px-5 py-4 border-b border-[#EFEAF9] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1D1633] font-display">
              Báo cáo tâm lý tiêu dùng
            </h2>
            <p className="text-xs text-[#6F668C]">Đặc quyền gói Premium · {userName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-[#F3EFFC] cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="bg-[#F5F1FD] rounded-2xl p-4 border border-[#E5DDFB]">
            <p className="text-xs font-semibold text-[#5A34C2]">Tác nhân cảm xúc nổi bật</p>
            <p className="text-base font-extrabold text-[#1D1633] mt-1">{topTrigger}</p>
            <p className="text-xs text-[#4A4166] mt-1.5 leading-relaxed">
              Quy tắc tạm dừng 24 giờ giúp bạn tách cảm xúc nhất thời khỏi quyết định tài chính, giảm rõ rệt các khoản chi bốc đồng.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#6F668C] uppercase tracking-wide">
              Phân bổ theo nguyên nhân cảm xúc
            </h3>
            {triggerStats.map(([reason, stat]) => (
              <div
                key={reason}
                className="rounded-xl border border-[#EFEAF9] p-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1D1633] truncate">{reason}</p>
                  <p className="text-xs text-[#6F668C] tabular-nums">{stat.count} lần cân nhắc</p>
                </div>
                <div className="text-right font-mono-num text-xs shrink-0 space-y-0.5">
                  <p className="font-bold text-emerald-600">+{formatVND(stat.saved)}</p>
                  <p className="font-bold text-red-600">-{formatVND(stat.spent)}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="w-full min-h-[46px] rounded-xl bg-[#6A48C9] hover:bg-[#5938B8] text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Tải xuống báo cáo (.txt)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
