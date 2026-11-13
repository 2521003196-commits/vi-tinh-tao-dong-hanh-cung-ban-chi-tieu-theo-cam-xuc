import { Banknote, Plus } from 'lucide-react';
import { Transaction, formatVND } from '../types';

interface SpendingViewProps {
  transactions: Transaction[];
  remainingBudget: number;
  monthlyBudget: number;
  onOpenAddFlow: () => void;
}

export function SpendingView({
  transactions,
  remainingBudget,
  monthlyBudget,
  onOpenAddFlow,
}: SpendingViewProps) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary Strip */}
      <div className="bg-white rounded-2xl p-4 border border-[#E7DFF9] shadow-xs flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#6F668C]">Tổng chi tiêu tháng này</p>
          <p className="text-xl font-extrabold font-mono-num text-red-600 mt-0.5">
            -{formatVND(totalSpent)}
          </p>
          <p className="text-xs text-[#6F668C] mt-1 tabular-nums">
            Còn lại: <span className="font-semibold text-[#1D1633]">{formatVND(remainingBudget)}</span> / {formatVND(monthlyBudget)}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddFlow}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EFE9FC] hover:bg-[#E3D7FA] text-[#5433B5] font-semibold text-sm flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Kiểm tra mua</span>
        </button>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-2xl border border-[#E7DFF9] shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#F2ECF9] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1D1633]">Lịch sử chi tiêu</h3>
          <span className="text-xs text-[#6F668C] tabular-nums">{expenses.length} giao dịch</span>
        </div>

        {expenses.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-[#F4EFFC] text-[#6A48C9] flex items-center justify-center mx-auto">
              <Banknote className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#1D1633]">Chưa có khoản chi tiêu nào</p>
            <p className="text-xs text-[#6F668C]">
              Nhấn dấu + ở bên dưới để cân nhắc món hàng trước khi mua.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#F3EEF9]">
            {expenses.map((item) => (
              <li key={item.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1D1633] truncate">{item.productName}</p>
                    <p className="text-xs text-[#6F668C] mt-0.5 truncate">
                      <span>{item.reason}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span className="tabular-nums">{item.timeStr} · {item.dateStr}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono-num text-red-600">
                    -{formatVND(item.amount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
