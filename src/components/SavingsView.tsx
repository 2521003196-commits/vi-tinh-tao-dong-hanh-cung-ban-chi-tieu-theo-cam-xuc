import { PiggyBank } from 'lucide-react';
import { Transaction, formatVND } from '../types';

interface SavingsViewProps {
  transactions: Transaction[];
}

export function SavingsView({ transactions }: SavingsViewProps) {
  const savings = transactions.filter((t) => t.type === 'saving');
  const totalSaved = savings.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      {/* Highlighted Savings Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDF3E6] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1D1633]">Bạn đã tiết kiệm được</h3>
            <p className="text-2xl font-extrabold font-mono-num text-emerald-600 mt-0.5">
              +{formatVND(totalSaved)}
            </p>
          </div>
        </div>
        <p className="text-xs text-[#5B5278] mt-3">
          Mỗi lần bạn vượt qua cơn mua sắm bốc đồng sau 24 giờ chờ đợi, số tiền giữ lại được cộng thẳng vào quỹ tiết kiệm này.
        </p>
      </div>

      {/* Savings History */}
      <div className="bg-white rounded-2xl border border-[#E7DFF9] shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#F2ECF9] flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1D1633]">Các món đã hủy bỏ thành công</h4>
          <span className="text-xs text-[#6F668C] tabular-nums">{savings.length} lần kiềm chế</span>
        </div>

        {savings.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-[#1D1633]">Chưa có khoản tiết kiệm mới</p>
            <p className="text-xs text-[#6F668C]">
              Khi bạn chọn “Hủy bỏ món hàng” sau 24 giờ suy nghĩ, số tiền sẽ hiện tại đây.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#F3EEF9]">
            {savings.map((item) => (
              <li key={item.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <PiggyBank className="w-4 h-4" />
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
                  <span className="text-sm font-bold font-mono-num text-emerald-600">
                    +{formatVND(item.amount)}
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
