import { useState } from 'react';
import {
  BellRing,
  ChevronRight,
  Crown,
  Gift,
  MessageSquareHeart,
  Trash2,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { PlanType, VoucherItem, formatVND } from '../types';

interface MoreViewProps {
  userName: string;
  plan: PlanType;
  monthlyBudget: number;
  totalSaved: number;
  vouchers: VoucherItem[];
  personalizedReminder: boolean;
  onToggleReminder: () => void;
  onOpenUpgrade: () => void;
  onOpenConsult: () => void;
  onCreateAccount: (name: string, budget: number) => void;
  onClaimVoucher: (id: string) => void;
  onResetAccount: () => void;
}

export function MoreView({
  userName,
  plan,
  monthlyBudget,
  totalSaved,
  vouchers,
  personalizedReminder,
  onToggleReminder,
  onOpenUpgrade,
  onOpenConsult,
  onCreateAccount,
  onClaimVoucher,
  onResetAccount,
}: MoreViewProps) {
  const [subModal, setSubModal] = useState<'none' | 'create' | 'voucher' | 'delete'>('none');
  const [draftName, setDraftName] = useState(userName);
  const [draftBudget, setDraftBudget] = useState(String(monthlyBudget));

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = draftName.trim() || 'Nguyễn A';
    const parsedBudget = Number(draftBudget.replace(/\D/g, '')) || 2000000;
    onCreateAccount(cleanedName, parsedBudget);
    setSubModal('none');
  };

  return (
    <div className="space-y-4">
      {/* User Profile Card: Nguyễn A */}
      <div className="bg-white rounded-2xl p-4 border border-[#E7DFF9] shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#EFE9FC] text-[#5A34C2] flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1D1633] truncate">{userName}</h3>
              {plan === 'premium' && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
            </div>
            <p className="text-xs text-[#6F668C] mt-0.5 tabular-nums">
              <span>Gói {plan === 'premium' ? 'Premium' : 'Freemium'}</span>
              <span aria-hidden="true" className="mx-1.5">·</span>
              <span>Ngân sách {formatVND(monthlyBudget)}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenUpgrade}
          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#6A48C9] hover:bg-[#5938B8] text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer"
        >
          {plan === 'premium' ? 'Gói Premium' : 'Nâng cấp'}
        </button>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-2xl border border-[#E7DFF9] shadow-xs divide-y divide-[#F3EEF9] overflow-hidden">
        <button
          type="button"
          onClick={() => {
            setDraftName(userName);
            setDraftBudget(String(monthlyBudget));
            setSubModal('create');
          }}
          className="w-full min-h-[58px] px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#FAF8FE] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F3EFFC] text-[#6A48C9] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1D1633]">Tạo tài khoản</p>
              <p className="text-xs text-[#6F668C]">Tùy chỉnh tên & ngân sách mô phỏng</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9B8FC0]" />
        </button>

        <button
          type="button"
          onClick={onOpenUpgrade}
          className="w-full min-h-[58px] px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#FAF8FE] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1D1633]">Nâng cấp gói</p>
              <p className="text-xs text-[#6F668C]">Freemium & Premium (19.000 VNĐ/Tháng mô phỏng)</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9B8FC0]" />
        </button>

        <button
          type="button"
          onClick={() => setSubModal('voucher')}
          className="w-full min-h-[58px] px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#FAF8FE] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1D1633]">Voucher</p>
              <p className="text-xs text-[#6F668C]">Phần thưởng tinh thần từ số tiền đã tiết kiệm</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9B8FC0]" />
        </button>

        <button
          type="button"
          onClick={onOpenConsult}
          className="w-full min-h-[58px] px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#FAF8FE] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F3EFFC] text-[#6A48C9] flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1D1633]">Nhà tư vấn tâm lý AI</p>
              <p className="text-xs text-[#6F668C]">
                {plan === 'premium' ? 'Sẵn sàng trò chuyện' : 'Yêu cầu gói Premium mô phỏng'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9B8FC0]" />
        </button>

        <button
          type="button"
          onClick={onToggleReminder}
          className="w-full min-h-[58px] px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#FAF8FE] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F3EFFC] text-[#6A48C9] flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1D1633]">Cá nhân hóa nhắc nhở</p>
              <p className="text-xs text-[#6F668C]">Nhắc giữ bình tĩnh trước khung giờ Flash Sale</p>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              personalizedReminder ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F3EFFC] text-[#6F668C]'
            }`}
          >
            {personalizedReminder ? 'Đang bật' : 'Đang tắt'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubModal('delete')}
          className="w-full min-h-[58px] px-4 py-3 flex items-center justify-between gap-3 hover:bg-red-50/50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-600">Xóa tài khoản</p>
              <p className="text-xs text-[#6F668C]">Đặt lại phiên mô phỏng về trạng thái ban đầu</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-300" />
        </button>
      </div>

      {/* Sub-modal: Create Account */}
      {subModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19112E]/55 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E5DDFB] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1D1633] font-display">Tạo tài khoản mô phỏng</h3>
              <button
                type="button"
                onClick={() => setSubModal('none')}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-[#F3EFFC] cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#5B5278] mb-1">Tên hiển thị</label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Nguyễn A"
                  className="w-full rounded-xl border border-[#E2DAF7] bg-[#FAF8FE] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A48C9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5B5278] mb-1">Ngân sách tháng (VNĐ)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={draftBudget}
                  onChange={(e) => setDraftBudget(e.target.value.replace(/\D/g, ''))}
                  placeholder="2000000"
                  className="w-full rounded-xl border border-[#E2DAF7] bg-[#FAF8FE] px-3.5 py-2.5 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-[#6A48C9]"
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-[46px] rounded-xl bg-[#6A48C9] hover:bg-[#5938B8] text-white text-sm font-bold cursor-pointer"
              >
                Lưu thông tin mô phỏng
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sub-modal: Vouchers */}
      {subModal === 'voucher' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19112E]/55 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#FAF8FE] rounded-3xl p-5 shadow-2xl border border-[#E5DDFB] space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1D1633] font-display">Kho Voucher Tiết Kiệm</h3>
                <p className="text-xs text-[#6F668C] tabular-nums">
                  Đã tiết kiệm: <strong className="text-emerald-600">{formatVND(totalSaved)}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubModal('none')}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-[#EFE9FC] cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {vouchers.map((v) => {
                const unlocked = totalSaved >= v.minSavedRequired;
                return (
                  <div key={v.id} className="bg-white rounded-2xl p-4 border border-[#E5DDFB] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#1D1633]">{v.title}</h4>
                      <span className="text-[11px] font-mono-num font-bold text-[#6A48C9] shrink-0">
                        Mốc {formatVND(v.minSavedRequired)}
                      </span>
                    </div>
                    <p className="text-xs text-[#5B5278]">{v.description}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-xs font-mono-num text-[#312359]">Mã: {v.code}</span>
                      <button
                        type="button"
                        disabled={!unlocked || v.claimed}
                        onClick={() => onClaimVoucher(v.id)}
                        className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          v.claimed
                            ? 'bg-emerald-50 text-emerald-700'
                            : unlocked
                            ? 'bg-[#6A48C9] hover:bg-[#5938B8] text-white cursor-pointer'
                            : 'bg-[#F3EFFC] text-[#9C91BD] cursor-not-allowed'
                        }`}
                      >
                        {v.claimed ? 'Đã nhận' : unlocked ? 'Nhận ngay' : 'Chưa đủ mốc'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-modal: Delete Account */}
      {subModal === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19112E]/55 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E5DDFB] space-y-4">
            <h3 className="text-base font-bold text-[#1D1633] font-display">Xác nhận xóa tài khoản?</h3>
            <p className="text-xs text-[#5B5278] leading-relaxed">
              Thao tác này sẽ xóa dữ liệu phiên mô phỏng hiện tại và đưa ứng dụng Ví Tỉnh Tảo về trạng thái ban đầu với tài khoản Nguyễn A.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSubModal('none')}
                className="min-h-[44px] rounded-xl bg-[#F3EFFC] hover:bg-[#E7DFF9] text-[#312359] text-sm font-semibold cursor-pointer"
              >
                Giữ lại
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetAccount();
                  setSubModal('none');
                }}
                className="min-h-[44px] rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold cursor-pointer"
              >
                Xóa & Đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
