import { useMemo, useState } from 'react';
import { Banknote, BarChart3, MoreHorizontal, PiggyBank, Plus } from 'lucide-react';
import {
  INITIAL_MONTHLY_BUDGET,
  INITIAL_TRANSACTIONS,
  INITIAL_VOUCHERS,
  PlanType,
  TabId,
  Transaction,
  VoucherItem,
  formatVND,
  getNowFormatted,
} from './types';
import { PiggyBankHeroIllustration } from './components/Illustrations';
import { SpendingView } from './components/SpendingView';
import { StatsView } from './components/StatsView';
import { SavingsView } from './components/SavingsView';
import { MoreView } from './components/MoreView';
import { ImpulseFlowModal } from './components/ImpulseFlowModal';
import { UpgradeModal } from './components/UpgradeModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { PsychologyReportModal } from './components/PsychologyReportModal';

export default function App() {
  // Fresh per-visitor simulated session state (no shared multi-user data)
  const [activeTab, setActiveTab] = useState<TabId>('chi-tieu');
  const [userName, setUserName] = useState('Nguyễn A');
  const [monthlyBudget, setMonthlyBudget] = useState(INITIAL_MONTHLY_BUDGET);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [plan, setPlan] = useState<PlanType>('freemium');
  const [vouchers, setVouchers] = useState<VoucherItem[]>(INITIAL_VOUCHERS);
  const [personalizedReminder, setPersonalizedReminder] = useState(true);

  // Modals state
  const [isImpulseOpen, setIsImpulseOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [upgradeFromConsult, setUpgradeFromConsult] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  const totalSpent = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, cur) => acc + cur.amount, 0),
    [transactions]
  );

  const totalSaved = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'saving')
        .reduce((acc, cur) => acc + cur.amount, 0),
    [transactions]
  );

  // Remaining budget starts at 2.000.000đ for initial visit (plus any budget delta minus new expenses)
  const remainingBudget = useMemo(() => {
    const newExpenses = transactions
      .filter((t) => t.type === 'expense' && t.id !== 'init-expense-1')
      .reduce((acc, cur) => acc + cur.amount, 0);
    return Math.max(0, monthlyBudget - newExpenses);
  }, [monthlyBudget, transactions]);

  const handleImpulseDecision = (
    decision: 'cancel' | 'buy',
    payload: { productName: string; amount: number; reason: string }
  ) => {
    const { timeStr, dateStr } = getNowFormatted();
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: decision === 'cancel' ? 'saving' : 'expense',
      productName: payload.productName,
      amount: payload.amount,
      reason: payload.reason,
      timeStr,
      dateStr,
      createdAt: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    setIsImpulseOpen(false);

    if (decision === 'cancel') {
      setActiveTab('tiet-kiem');
      showToast(`Tuyệt vời! Bạn đã tiết kiệm được +${formatVND(payload.amount)}`);
    } else {
      setActiveTab('chi-tieu');
      showToast(`Đã ghi nhận chi tiêu -${formatVND(payload.amount)}`);
    }
  };

  const handleOpenConsult = () => {
    if (plan === 'premium') {
      setIsAdvisorOpen(true);
    } else {
      setUpgradeFromConsult(true);
      setIsUpgradeOpen(true);
    }
  };

  const handleSelectPlan = (chosen: PlanType) => {
    setPlan(chosen);
    setIsUpgradeOpen(false);
    if (chosen === 'premium') {
      showToast('Đã kích hoạt gói Premium mô phỏng (0 VNĐ)');
      if (upgradeFromConsult) {
        setUpgradeFromConsult(false);
        setIsAdvisorOpen(true);
      }
    } else {
      setUpgradeFromConsult(false);
      showToast('Đang sử dụng gói Freemium miễn phí');
    }
  };

  const handleCreateAccount = (name: string, budget: number) => {
    setUserName(name);
    setMonthlyBudget(budget);
    showToast(`Đã cập nhật tài khoản mô phỏng: ${name}`);
  };

  const handleClaimVoucher = (id: string) => {
    setVouchers((prev) => prev.map((v) => (v.id === id ? { ...v, claimed: true } : v)));
    showToast('Đã lưu Voucher mô phỏng vào tài khoản');
  };

  const handleResetAccount = () => {
    setUserName('Nguyễn A');
    setMonthlyBudget(INITIAL_MONTHLY_BUDGET);
    setTransactions(INITIAL_TRANSACTIONS);
    setPlan('freemium');
    setVouchers(INITIAL_VOUCHERS);
    setPersonalizedReminder(true);
    setActiveTab('chi-tieu');
    showToast('Đã đặt lại ứng dụng về trạng thái ban đầu');
  };

  return (
    <div className="min-h-screen bg-[#F6F3FD] text-[#1D1633] flex flex-col">
      {/* Desktop/Mobile Unified Shell — 2/5 Purple Hero Header on Top */}
      <header className="w-full h-[40vh] min-h-[250px] max-h-[340px] bg-gradient-to-br from-[#7451D8] via-[#6641C7] to-[#4E2CA6] text-white relative overflow-hidden shrink-0 shadow-md">
        {/* Subtle decorative circles in purple shades */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-white/10 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-[#3A1E85]/35 pointer-events-none"
        />

        <div className="relative z-10 max-w-5xl mx-auto h-full px-5 sm:px-8 py-5 flex flex-col justify-between">
          {/* Top Account Line */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-purple-100">
            <span className="font-medium truncate">
              Xin chào, <strong className="text-white font-semibold">{userName}</strong>
            </span>
            <span className="font-mono-num text-xs text-purple-100 whitespace-nowrap">
              {plan === 'premium' ? 'Gói Premium (Mô phỏng)' : 'Gói Freemium'}
            </span>
          </div>

          {/* Centerpiece: Piggy Bank + White "Ví Tỉnh Tảo" Title */}
          <div className="flex flex-col items-center justify-center text-center my-auto gap-1.5">
            <PiggyBankHeroIllustration />
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              Ví Tỉnh Tảo
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/95 max-w-md">
              Tạm dừng 24 giờ trước khi mua — giữ vững ngân sách mỗi tháng
            </p>
          </div>

          {/* Clean Bottom Balance Strip */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm border-t border-white/15 pt-2.5">
            <div className="text-center">
              <span className="text-purple-200 block text-[11px]">Ngân sách còn lại</span>
              <span className="font-bold font-mono-num text-white">{formatVND(remainingBudget)}</span>
            </div>
            <div className="h-6 w-px bg-white/20" aria-hidden="true" />
            <div className="text-center">
              <span className="text-purple-200 block text-[11px]">Đã tiết kiệm</span>
              <span className="font-bold font-mono-num text-emerald-200">+{formatVND(totalSaved)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area (Scrollable above bottom dock) */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 pt-5 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Primary Active Screen Column */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-extrabold text-[#1D1633] font-display">
                {activeTab === 'chi-tieu' && 'Chi tiêu'}
                {activeTab === 'thong-ke' && 'Thống kê'}
                {activeTab === 'tiet-kiem' && 'Tiết kiệm'}
                {activeTab === 'khac' && 'Khác'}
              </h2>
              <span className="text-xs text-[#6F668C]">Dữ liệu mô phỏng cá nhân</span>
            </div>

            {activeTab === 'chi-tieu' && (
              <SpendingView
                transactions={transactions}
                remainingBudget={remainingBudget}
                monthlyBudget={monthlyBudget}
                onOpenAddFlow={() => setIsImpulseOpen(true)}
              />
            )}

            {activeTab === 'thong-ke' && (
              <StatsView
                transactions={transactions}
                plan={plan}
                onClickConsult={handleOpenConsult}
                onExportReport={() => setIsReportOpen(true)}
              />
            )}

            {activeTab === 'tiet-kiem' && <SavingsView transactions={transactions} />}

            {activeTab === 'khac' && (
              <MoreView
                userName={userName}
                plan={plan}
                monthlyBudget={monthlyBudget}
                totalSaved={totalSaved}
                vouchers={vouchers}
                personalizedReminder={personalizedReminder}
                onToggleReminder={() => {
                  setPersonalizedReminder((prev) => !prev);
                  showToast(
                    !personalizedReminder
                      ? 'Đã bật nhắc nhở giữ bình tĩnh'
                      : 'Đã tắt nhắc nhở cá nhân'
                  );
                }}
                onOpenUpgrade={() => {
                  setUpgradeFromConsult(false);
                  setIsUpgradeOpen(true);
                }}
                onOpenConsult={handleOpenConsult}
                onCreateAccount={handleCreateAccount}
                onClaimVoucher={handleClaimVoucher}
                onResetAccount={handleResetAccount}
              />
            )}
          </section>

          {/* Desktop Companion Panel (Visible on lg: so 1440px desktop has rich 2-column presence) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E7DFF9] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1D1633] font-display">
                Quy tắc 24 giờ tỉnh táo
              </h3>
              <p className="text-xs text-[#5B5278] leading-relaxed">
                Nhấn nút <strong>+</strong> màu tím ở thanh điều hướng bên dưới để nhập sản phẩm bạn định mua, gắn thẻ cảm xúc và trải nghiệm đếm ngược mô phỏng 24 giờ trong 5 giây.
              </p>
              <button
                type="button"
                onClick={() => setIsImpulseOpen(true)}
                className="w-full min-h-[44px] rounded-xl bg-[#6A48C9] hover:bg-[#5938B8] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm món hàng cần cân nhắc</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E7DFF9] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1D1633] font-display">Tổng quan nhanh</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#F3EEF9]">
                  <span className="text-[#6F668C]">Tài khoản</span>
                  <span className="font-semibold text-[#1D1633]">{userName}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#F3EEF9]">
                  <span className="text-[#6F668C]">Tổng đã chi (-)</span>
                  <span className="font-bold font-mono-num text-red-600">-{formatVND(totalSpent)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#6F668C]">Tổng tiết kiệm (+)</span>
                  <span className="font-bold font-mono-num text-emerald-600">+{formatVND(totalSaved)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Toast feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-[#1D1633] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}

      {/* Fixed Bottom Navigation Bar with 5 exact items in exact order */}
      <nav
        aria-label="Điều hướng chính"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6DEFA] shadow-[0_-4px_20px_rgba(45,27,99,0.06)]"
      >
        <div className="max-w-xl mx-auto grid grid-cols-5 items-center h-16 px-2">
          {/* 1. Chi tiêu (Banknote) */}
          <button
            type="button"
            onClick={() => setActiveTab('chi-tieu')}
            className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'chi-tieu' ? 'text-[#6A48C9]' : 'text-[#7C7299] hover:text-[#312359]'
            }`}
          >
            <Banknote className="w-5 h-5" />
            <span className="text-[11px] font-semibold whitespace-nowrap">Chi tiêu</span>
          </button>

          {/* 2. Thống kê (Stats icon) */}
          <button
            type="button"
            onClick={() => setActiveTab('thong-ke')}
            className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'thong-ke' ? 'text-[#6A48C9]' : 'text-[#7C7299] hover:text-[#312359]'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[11px] font-semibold whitespace-nowrap">Thống kê</span>
          </button>

          {/* 3. Dấu cộng (+) nổi trên hình tròn màu tím */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsImpulseOpen(true)}
              aria-label="Thêm món hàng mới"
              className="-mt-7 w-14 h-14 rounded-full bg-[#6A48C9] hover:bg-[#5938B8] active:scale-95 text-white shadow-lg shadow-[#6A48C9]/40 border-4 border-[#F6F3FD] flex items-center justify-center transition-all cursor-pointer"
            >
              <Plus className="w-7 h-7 stroke-[2.75]" />
            </button>
          </div>

          {/* 4. Tiết kiệm (PiggyBank) */}
          <button
            type="button"
            onClick={() => setActiveTab('tiet-kiem')}
            className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'tiet-kiem' ? 'text-[#6A48C9]' : 'text-[#7C7299] hover:text-[#312359]'
            }`}
          >
            <PiggyBank className="w-5 h-5" />
            <span className="text-[11px] font-semibold whitespace-nowrap">Tiết kiệm</span>
          </button>

          {/* 5. Khác (3-dot icon) */}
          <button
            type="button"
            onClick={() => setActiveTab('khac')}
            className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'khac' ? 'text-[#6A48C9]' : 'text-[#7C7299] hover:text-[#312359]'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[11px] font-semibold whitespace-nowrap">Khác</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <ImpulseFlowModal
        isOpen={isImpulseOpen}
        remainingBudget={remainingBudget}
        onClose={() => setIsImpulseOpen(false)}
        onDecision={handleImpulseDecision}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        currentPlan={plan}
        fromConsult={upgradeFromConsult}
        onClose={() => {
          setIsUpgradeOpen(false);
          setUpgradeFromConsult(false);
        }}
        onSelectPlan={handleSelectPlan}
      />

      <AiAdvisorModal
        isOpen={isAdvisorOpen}
        userName={userName}
        remainingBudget={remainingBudget}
        transactions={transactions}
        onClose={() => setIsAdvisorOpen(false)}
      />

      <PsychologyReportModal
        isOpen={isReportOpen}
        userName={userName}
        transactions={transactions}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
