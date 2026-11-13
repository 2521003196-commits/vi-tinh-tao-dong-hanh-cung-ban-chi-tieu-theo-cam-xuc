import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Clock, X } from 'lucide-react';
import { PRESET_REASONS, formatNumberVN, formatVND } from '../types';
import { HourglassMotionIllustration, RingingBellIllustration } from './Illustrations';

interface ImpulseFlowModalProps {
  isOpen: boolean;
  remainingBudget: number;
  onClose: () => void;
  onDecision: (decision: 'cancel' | 'buy', payload: { productName: string; amount: number; reason: string }) => void;
}

const SIMULATION_DURATION_MS = 5000;
const SIMULATED_HOURS_SECONDS = 24 * 3600; // 86400 seconds mapped to 5000ms

function formatSimulatedHMS(remainingSeconds: number): string {
  const clamped = Math.max(0, Math.round(remainingSeconds));
  const hrs = Math.floor(clamped / 3600);
  const mins = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function ImpulseFlowModal({
  isOpen,
  remainingBudget,
  onClose,
  onDecision,
}: ImpulseFlowModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [productName, setProductName] = useState('');
  const [rawPrice, setRawPrice] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);

  // Reset state whenever opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setProductName('');
      setRawPrice('');
      setSelectedReason('');
      setCustomReason('');
      setErrorMsg('');
      setProgress(0);
    }
  }, [isOpen]);

  // 5-second accelerated 24h -> 00h countdown on Step 3
  useEffect(() => {
    if (!isOpen || step !== 3) return;

    setProgress(0);
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / SIMULATION_DURATION_MS);
      setProgress(ratio);

      if (ratio < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setStep(4);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isOpen, step]);

  const numericPrice = useMemo(() => {
    const digits = rawPrice.replace(/\D/g, '');
    return digits ? Number(digits) : 0;
  }, [rawPrice]);

  const formattedPriceInput = useMemo(() => {
    if (!numericPrice) return '';
    return formatNumberVN(numericPrice);
  }, [numericPrice]);

  const finalReason = useMemo(() => {
    if (selectedReason === 'Khác') {
      return customReason.trim();
    }
    return selectedReason;
  }, [selectedReason, customReason]);

  const budgetPercentText = useMemo(() => {
    if (numericPrice <= 0) return '0.0';
    if (remainingBudget <= 0) return '100.0';
    const pct = (numericPrice / remainingBudget) * 100;
    return pct.toFixed(1);
  }, [numericPrice, remainingBudget]);

  const simulatedTimeDisplay = useMemo(() => {
    const remainingSimSeconds = SIMULATED_HOURS_SECONDS * (1 - progress);
    return formatSimulatedHMS(remainingSimSeconds);
  }, [progress]);

  const handlePriceChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    // Cap to reasonable simulated 12 digits
    setRawPrice(digits.slice(0, 10));
    if (errorMsg) setErrorMsg('');
  };

  const handleStep1Next = () => {
    if (!productName.trim()) {
      setErrorMsg('Vui lòng nhập tên sản phẩm bạn muốn mua.');
      return;
    }
    if (numericPrice <= 0) {
      setErrorMsg('Vui lòng nhập giá tiền hợp lệ lớn hơn 0 đ.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!selectedReason) {
      setErrorMsg('Bạn vui lòng chọn 1 nguyên nhân trước khi tiếp tục.');
      return;
    }
    if (selectedReason === 'Khác' && !customReason.trim()) {
      setErrorMsg('Vui lòng nhập lý do chi tiết ở mục Khác.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#19112E]/55 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Quy trình kiểm tra chi tiêu 24 giờ"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full sm:max-w-[440px] bg-[#FAF8FE] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E5DDFB] overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#EFEAF9]">
          <button
            type="button"
            onClick={() => {
              if (step === 2) {
                setErrorMsg('');
                setStep(1);
              } else {
                onClose();
              }
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#312359] hover:bg-[#F3EFFC] transition-colors cursor-pointer"
            aria-label={step === 2 ? 'Quay lại bước trước' : 'Đóng'}
          >
            {step === 2 ? <ArrowLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>

          <h2 className="text-base font-bold text-[#1D1633] font-display truncate">
            {step === 1 && 'Thêm món hàng'}
            {step === 2 && 'Gắn thẻ nguyên nhân cảm xúc'}
            {step === 3 && 'Tạm dừng thanh toán'}
            {step === 4 && 'Hết thời gian suy nghĩ'}
          </h2>

          <div className="min-w-[44px] flex justify-end text-xs font-semibold text-[#6A48C9] tabular-nums">
            {step}/4
          </div>
        </div>

        {/* Step Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <p className="text-sm text-[#5B5278]">
                  Nhập thông tin món đồ bạn đang định mua để Ví Tỉnh Tảo giúp bạn cân nhắc kỹ trước khi chi tiền.
                </p>

                {/* Ô 1: Nhập tên sản phẩm */}
                <div className="bg-white rounded-2xl p-4 border border-[#E5DDFB] shadow-xs">
                  <label htmlFor="product-name-input" className="block text-xs font-semibold text-[#5B5278] mb-1.5">
                    Nhập tên sản phẩm
                  </label>
                  <input
                    id="product-name-input"
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="VD: Áo khoác, Tai nghe, Trà sữa..."
                    className="w-full text-base font-medium text-[#1D1633] placeholder:text-[#A59CC0] bg-[#FAF8FE] border border-[#E2DAF7] rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-[#6A48C9] focus:border-transparent"
                  />
                </div>

                {/* Ô 2: Giá tiền */}
                <div className="bg-white rounded-2xl p-4 border border-[#E5DDFB] shadow-xs">
                  <label htmlFor="product-price-input" className="block text-xs font-semibold text-[#5B5278] mb-1.5">
                    Giá tiền
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="product-price-input"
                      type="text"
                      inputMode="numeric"
                      value={formattedPriceInput}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="250.000"
                      className="w-full text-lg font-bold font-mono-num text-[#1D1633] placeholder:text-[#A59CC0] bg-[#FAF8FE] border border-[#E2DAF7] rounded-xl pl-3.5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#6A48C9] focus:border-transparent"
                    />
                    <span className="absolute right-4 text-base font-bold text-[#6A48C9]">đ</span>
                  </div>
                  <p className="mt-2 text-xs text-[#6F668C] tabular-nums">
                    Ngân sách còn lại trong tháng: <strong className="text-[#312359]">{formatVND(remainingBudget)}</strong>
                  </p>
                </div>

                {errorMsg && (
                  <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                    {errorMsg}
                  </p>
                )}

                {/* Ô 3: Tiếp tục */}
                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="w-full min-h-[50px] rounded-full bg-[#6A48C9] hover:bg-[#5938B8] active:scale-[0.99] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-md shadow-[#6A48C9]/25 transition-all cursor-pointer"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-base font-bold text-[#1D1633]">
                    Vì sao bạn muốn mua món hàng này?
                  </h3>
                  <p className="text-xs text-[#6F668C] mt-1">
                    {productName} · <span className="font-mono-num font-semibold text-[#5433B5]">{formatVND(numericPrice)}</span>
                  </p>
                </div>

                <div className="space-y-2.5">
                  {PRESET_REASONS.map((reason) => {
                    const isSelected = selectedReason === reason;
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => {
                          setSelectedReason(reason);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className={`w-full min-h-[52px] px-4 py-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EDE7FC] border-[#6A48C9] text-[#281952] shadow-xs'
                            : 'bg-white border-[#E4DCF7] text-[#312359] hover:border-[#C2B1EE]'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                            isSelected ? 'border-[#6A48C9] bg-white' : 'border-[#B9ADD9]'
                          }`}
                        >
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#6A48C9]" />}
                        </span>
                        <span className="text-sm font-medium">{reason}</span>
                      </button>
                    );
                  })}

                  {/* Option: Khác */}
                  <div
                    className={`rounded-2xl border transition-all ${
                      selectedReason === 'Khác'
                        ? 'bg-[#EDE7FC] border-[#6A48C9]'
                        : 'bg-white border-[#E4DCF7]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReason('Khác');
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="w-full min-h-[52px] px-4 py-3 text-left flex items-center gap-3 cursor-pointer"
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                          selectedReason === 'Khác' ? 'border-[#6A48C9] bg-white' : 'border-[#B9ADD9]'
                        }`}
                      >
                        {selectedReason === 'Khác' && <span className="w-2.5 h-2.5 rounded-full bg-[#6A48C9]" />}
                      </span>
                      <span className="text-sm font-medium text-[#312359]">Khác</span>
                    </button>

                    {selectedReason === 'Khác' && (
                      <div className="px-4 pb-3.5">
                        <input
                          type="text"
                          value={customReason}
                          onChange={(e) => {
                            setCustomReason(e.target.value);
                            if (errorMsg) setErrorMsg('');
                          }}
                          placeholder="Nhập lý do chi tiết của bạn..."
                          autoFocus
                          className="w-full text-sm text-[#1D1633] placeholder:text-[#988DB8] bg-white border border-[#D4C6F5] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6A48C9]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleStep2Next}
                  className="w-full min-h-[50px] rounded-full bg-[#6A48C9] hover:bg-[#5938B8] active:scale-[0.99] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-md shadow-[#6A48C9]/25 transition-all cursor-pointer"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                className="text-center py-2 space-y-4"
              >
                <HourglassMotionIllustration progress={progress} />

                <div className="space-y-1.5">
                  <h3 className="text-2xl font-extrabold text-[#1D1633] font-display">
                    Tạm dừng thanh toán
                  </h3>
                  <p className="text-sm text-[#4A4166] max-w-xs mx-auto leading-relaxed">
                    Bạn có <strong className="text-[#1D1633]">24 giờ</strong> để suy nghĩ lại trước khi quyết định mua món hàng này.
                  </p>
                </div>

                {/* Countdown Display Pill matching mockup */}
                <div className="bg-[#ECE6FC] border border-[#DDD2FA] rounded-2xl py-3.5 px-5 flex items-center justify-center gap-3 max-w-[290px] mx-auto">
                  <Clock className="w-7 h-7 text-[#5A34C2] shrink-0" />
                  <span className="text-3xl font-extrabold font-mono-num tracking-tight text-[#5A34C2]">
                    {simulatedTimeDisplay}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="max-w-[290px] mx-auto space-y-1.5">
                  <div className="w-full h-1.5 bg-[#E7DFF9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6A48C9] transition-[width] duration-75"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#7D7399]">
                    Mô phỏng nhanh 24 giờ trong 5 giây
                  </p>
                </div>

                <p className="text-xs text-[#6F668C] max-w-xs mx-auto leading-relaxed pt-1">
                  Trong thời gian này, bạn sẽ không thể thanh toán món hàng.
                </p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="text-center py-2 space-y-5"
              >
                <RingingBellIllustration />

                <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold text-[#1D1633] font-display">
                    24 giờ đã trôi qua.
                  </h3>

                  <p className="text-sm text-[#352C4F] leading-relaxed px-2">
                    Bạn từng muốn mua món đồ này vì{' '}
                    <strong className="text-[#1D1633]">“{finalReason}”</strong>.
                  </p>

                  <p className="text-sm text-[#352C4F] leading-relaxed px-2">
                    Món đồ này sẽ chiếm{' '}
                    <span className="font-bold text-red-600 tabular-nums">{budgetPercentText}%</span>{' '}
                    ngân sách còn lại trong tháng của bạn.
                  </p>
                </div>

                <div className="bg-white border border-[#E5DDFB] rounded-2xl p-3.5 text-left flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-[#6F668C]">Món hàng đang cân nhắc</p>
                    <p className="text-sm font-bold text-[#1D1633] truncate">{productName}</p>
                  </div>
                  <span className="text-base font-bold font-mono-num text-[#5A34C2] shrink-0">
                    {formatVND(numericPrice)}
                  </span>
                </div>

                {/* Action buttons: Hủy bỏ (Green) & Xác nhận đã mua (Red) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      onDecision('cancel', {
                        productName: productName.trim(),
                        amount: numericPrice,
                        reason: finalReason,
                      })
                    }
                    className="min-h-[48px] px-3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm uppercase tracking-wide shadow-sm transition-all cursor-pointer"
                  >
                    Hủy bỏ món hàng
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onDecision('buy', {
                        productName: productName.trim(),
                        amount: numericPrice,
                        reason: finalReason,
                      })
                    }
                    className="min-h-[48px] px-3 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm uppercase tracking-wide shadow-sm transition-all cursor-pointer"
                  >
                    Xác nhận đã mua
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
