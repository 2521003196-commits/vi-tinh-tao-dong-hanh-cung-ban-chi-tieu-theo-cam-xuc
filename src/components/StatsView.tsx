import { useMemo, useState } from 'react';
import { ChevronRight, MessageSquareHeart, TrendingDown, TrendingUp, FileText } from 'lucide-react';
import { PlanType, Transaction, formatVND } from '../types';

interface StatsViewProps {
  transactions: Transaction[];
  plan: PlanType;
  onClickConsult: () => void;
  onExportReport: () => void;
}

export function StatsView({
  transactions,
  plan,
  onClickConsult,
  onExportReport,
}: StatsViewProps) {
  const [filter, setFilter] = useState<'all' | 'saving' | 'expense'>('all');

  const { totalSaved, totalSpent, savedPct, spentPct } = useMemo(() => {
    const saved = transactions
      .filter((t) => t.type === 'saving')
      .reduce((acc, cur) => acc + cur.amount, 0);
    const spent = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, cur) => acc + cur.amount, 0);
    const total = saved + spent;
    if (total === 0) {
      return { totalSaved: 0, totalSpent: 0, savedPct: 50, spentPct: 50 };
    }
    const sPct = Math.round((saved / total) * 100);
    return {
      totalSaved: saved,
      totalSpent: spent,
      savedPct: sPct,
      spentPct: 100 - sPct,
    };
  }, [transactions]);

  const filteredList = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  // SVG Donut math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const totalVol = totalSaved + totalSpent;
  const savedArc = totalVol > 0 ? (totalSaved / totalVol) * circumference : circumference * 0.5;
  const spentArc = totalVol > 0 ? (totalSpent / totalVol) * circumference : circumference * 0.5;

  return (
    <div className="space-y-4">
      {/* Top: Circular Donut Chart */}
      <div className="bg-white rounded-2xl p-5 border border-[#E7DFF9] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1D1633] font-display">Biểu đồ tròn Chi & Tiết kiệm</h3>
          <span className="text-xs text-[#6F668C] tabular-nums">
            Tổng: {formatVND(totalVol)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 140 140" className="-rotate-90">
              {/* Background ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#F2ECFA"
                strokeWidth="16"
              />
              {/* Spent (-) segment */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#EF4444"
                strokeWidth="16"
                strokeDasharray={`${spentArc} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="butt"
              />
              {/* Saved (+) segment */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#10B981"
                strokeWidth="16"
                strokeDasharray={`${savedArc} ${circumference}`}
                strokeDashoffset={-spentArc}
                strokeLinecap="butt"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
              <span className="text-[11px] font-medium text-[#6F668C]">Tỉ lệ giữ tiền</span>
              <span className="text-xl font-extrabold font-mono-num text-[#1D1633]">
                {totalVol > 0 ? `${savedPct}%` : '0%'}
              </span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8FE] border border-[#EFEAF9]">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#1D1633]">Tiết kiệm (+)</p>
                  <p className="text-[11px] text-[#6F668C] tabular-nums">{totalVol > 0 ? `${savedPct}% tổng dòng tiền` : 'Chưa có dữ liệu'}</p>
                </div>
              </div>
              <span className="text-sm font-bold font-mono-num text-emerald-600">
                +{formatVND(totalSaved)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8FE] border border-[#EFEAF9]">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-sm bg-red-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#1D1633]">Chi tiêu (-)</p>
                  <p className="text-[11px] text-[#6F668C] tabular-nums">{totalVol > 0 ? `${spentPct}% tổng dòng tiền` : 'Chưa có dữ liệu'}</p>
                </div>
              </div>
              <span className="text-sm font-bold font-mono-num text-red-600">
                -{formatVND(totalSpent)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tư vấn chi tiêu Row (Required prompt feature) */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onClickConsult}
          className="w-full min-h-[64px] bg-[#6A48C9] hover:bg-[#5938B8] active:scale-[0.99] text-white rounded-2xl px-4 py-3.5 shadow-md shadow-[#6A48C9]/20 flex items-center justify-between gap-3 transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <MessageSquareHeart className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">Tư vấn chi tiêu</p>
              <p className="text-xs text-purple-100 truncate">
                {plan === 'premium'
                  ? 'Trò chuyện ngay với Nhà tư vấn tâm lý AI'
                  : 'Nâng cấp Premium để mở khóa Nhà tư vấn tâm lý AI'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-100 shrink-0" />
        </button>

        {plan === 'premium' && (
          <button
            type="button"
            onClick={onExportReport}
            className="w-full min-h-[48px] bg-white hover:bg-[#FAF8FE] border border-[#DDD2FA] text-[#4C2FA3] rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#6A48C9]" />
              <span className="text-xs font-semibold">Xuất báo cáo phân tích tâm lý tiêu dùng chuyên sâu</span>
            </div>
            <span className="text-xs font-bold text-[#6A48C9] whitespace-nowrap">Xem báo cáo</span>
          </button>
        )}
      </div>

      {/* Bottom: + and - Ledger Table */}
      <div className="bg-white rounded-2xl border border-[#E7DFF9] shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#F2ECF9] flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#1D1633]">Bảng thống kê + và -</h3>
          <div className="flex items-center gap-1 p-1 bg-[#F4EFFC] rounded-xl">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all' ? 'bg-white text-[#1D1633] shadow-xs' : 'text-[#6F668C] hover:text-[#1D1633]'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilter('saving')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'saving' ? 'bg-white text-emerald-700 shadow-xs' : 'text-[#6F668C] hover:text-[#1D1633]'
              }`}
            >
              + Tiết kiệm
            </button>
            <button
              type="button"
              onClick={() => setFilter('expense')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'expense' ? 'bg-white text-red-700 shadow-xs' : 'text-[#6F668C] hover:text-[#1D1633]'
              }`}
            >
              - Chi tiêu
            </button>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#6F668C]">
            Không có mục nào trong bộ lọc này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F3EEF9] text-[11px] font-semibold text-[#6F668C]">
                  <th className="py-2.5 px-4">Sản phẩm & Nguyên nhân</th>
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-4 text-right">Biến động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0FC] text-xs">
                {filteredList.map((row) => {
                  const isSaving = row.type === 'saving';
                  return (
                    <tr key={row.id} className="hover:bg-[#FAF8FE] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {isSaving ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1D1633] truncate max-w-[165px] sm:max-w-[240px]">
                              {row.productName}
                            </p>
                            <p className="text-[11px] text-[#6F668C] truncate max-w-[165px] sm:max-w-[240px]">
                              {row.reason}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#6F668C] whitespace-nowrap tabular-nums">
                        {row.timeStr} · {row.dateStr}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold font-mono-num whitespace-nowrap ${
                          isSaving ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {isSaving ? '+' : '-'}{formatVND(row.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
