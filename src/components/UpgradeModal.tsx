import { Check, Crown, X } from 'lucide-react';
import { motion } from 'motion/react';
import { PlanType } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  currentPlan: PlanType;
  fromConsult: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PlanType) => void;
}

export function UpgradeModal({
  isOpen,
  currentPlan,
  fromConsult,
  onClose,
  onSelectPlan,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#19112E]/55 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Nâng cấp gói Ví Tỉnh Tảo"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full sm:max-w-[440px] bg-[#FAF8FE] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E5DDFB] overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#EFEAF9]">
          <div>
            <h2 className="text-base font-bold text-[#1D1633] font-display">Nâng cấp gói</h2>
            <p className="text-xs text-[#6F668C]">
              {fromConsult
                ? 'Chọn gói Premium để mở khóa Nhà tư vấn tâm lý AI'
                : 'Trải nghiệm mô phỏng hoàn toàn miễn phí'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#312359] hover:bg-[#F3EFFC] transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Card 1: Freemium */}
          <button
            type="button"
            onClick={() => onSelectPlan('freemium')}
            className={`w-full text-left rounded-2xl p-4 border-2 transition-all cursor-pointer ${
              currentPlan === 'freemium'
                ? 'bg-white border-[#6A48C9] shadow-sm'
                : 'bg-white border-[#E7DFF9] hover:border-[#C9B7F5]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-base font-extrabold text-[#1D1633] font-display">Freemium</span>
              <span className="text-xs font-bold text-[#6F668C] tabular-nums">0 VNĐ</span>
            </div>
            <p className="text-xs text-[#4A4166] leading-relaxed">
              Bản dùng miễn phí - Không tính phí cá nhân - Được dùng các tính năng có sẵn trong app
            </p>
            {currentPlan === 'freemium' && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#6A48C9]">
                <Check className="w-4 h-4" />
                <span>Đang sử dụng gói này</span>
              </div>
            )}
          </button>

          {/* Card 2: Premium */}
          <button
            type="button"
            onClick={() => onSelectPlan('premium')}
            className={`w-full text-left rounded-2xl p-5 border-2 transition-all cursor-pointer relative overflow-hidden ${
              currentPlan === 'premium'
                ? 'bg-[#6A48C9] border-[#4C2FA3] text-white shadow-lg shadow-[#6A48C9]/25'
                : 'bg-[#F3EEFC] border-[#8E6CEB] text-[#1D1633] hover:bg-[#ECE4FB] shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Crown className={`w-5 h-5 ${currentPlan === 'premium' ? 'text-amber-300' : 'text-[#6A48C9]'}`} />
                <span className="text-lg font-extrabold font-display">Premium</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-extrabold font-mono-num ${currentPlan === 'premium' ? 'text-white' : 'text-[#5A34C2]'}`}>
                  19.000 VNĐ/Tháng
                </span>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${currentPlan === 'premium' ? 'text-purple-100' : 'text-[#3F355C]'}`}>
              Giúp bạn nâng cao thêm nhiều tính năng - Xuất báo cáo phân tích tâm lý tiêu dùng chuyên sâu - Cá nhân hóa nhắc nhở
            </p>

            <div className="mt-4 pt-3 border-t border-current/15 flex items-center justify-between gap-2">
              <span className={`text-[11px] font-medium ${currentPlan === 'premium' ? 'text-purple-100' : 'text-[#6A48C9]'}`}>
                {currentPlan === 'premium' ? 'Đã kích hoạt gói Premium (Mô phỏng)' : 'Chạm để nâng cấp mô phỏng miễn phí →'}
              </span>
              {currentPlan === 'premium' && <Check className="w-4 h-4 text-white shrink-0" />}
            </div>
          </button>

          <p className="text-[11px] text-center text-[#7D7399]">
            Lưu ý: Đây là ứng dụng mô phỏng nên mọi gói nâng cấp đều miễn phí và không phát sinh giao dịch thật.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
