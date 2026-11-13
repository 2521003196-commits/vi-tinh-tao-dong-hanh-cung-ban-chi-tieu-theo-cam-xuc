export type TabId = 'chi-tieu' | 'thong-ke' | 'tiet-kiem' | 'khac';

export type PlanType = 'freemium' | 'premium';

export type TransactionType = 'expense' | 'saving';

export interface Transaction {
  id: string;
  type: TransactionType;
  productName: string;
  amount: number;
  reason: string;
  timeStr: string;
  dateStr: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timeStr: string;
}

export interface VoucherItem {
  id: string;
  title: string;
  description: string;
  code: string;
  minSavedRequired: number;
  claimed: boolean;
}

export const PRESET_REASONS = [
  'Áp lực học tập/Stress',
  'Muốn tự thưởng cho bản thân',
  'Bị hấp dẫn bởi Flash Sale',
  'Bạn bè rủ rê/Xem review',
] as const;

export const INITIAL_MONTHLY_BUDGET = 2000000; // 2.000.000 VNĐ -> 250.000 VNĐ = 12.5%

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'init-saving-1',
    type: 'saving',
    productName: 'Tai nghe chống ồn phiên bản giới hạn',
    amount: 450000,
    reason: 'Bị hấp dẫn bởi Flash Sale',
    timeStr: '20:15',
    dateStr: '12/11/2026',
    createdAt: 1,
  },
  {
    id: 'init-expense-1',
    type: 'expense',
    productName: 'Trà sữa & bánh ngọt cuối tuần',
    amount: 120000,
    reason: 'Muốn tự thưởng cho bản thân',
    timeStr: '16:30',
    dateStr: '11/11/2026',
    createdAt: 0,
  },
];

export const INITIAL_VOUCHERS: VoucherItem[] = [
  {
    id: 'v-1',
    title: 'Huy hiệu Người Tỉnh Tảo Tuần Đầu',
    description: 'Mở khóa khi bạn hủy bỏ ít nhất 1 món hàng bốc đồng (mô phỏng).',
    code: 'TINHTAO-01',
    minSavedRequired: 100000,
    claimed: false,
  },
  {
    id: 'v-2',
    title: 'Voucher Cà Phê Tập Trung 30.000đ (Mô phỏng)',
    description: 'Phần thưởng tinh thần khi tổng tiền tiết kiệm đạt từ 500.000đ.',
    code: 'CHILL-CAFE30',
    minSavedRequired: 500000,
    claimed: false,
  },
  {
    id: 'v-3',
    title: 'Đặc quyền Thử Thách 7 Ngày Không Mua Bốc Đồng',
    description: 'Nhận báo cáo thói quen chi tiêu cá nhân hóa khi tiết kiệm từ 1.000.000đ.',
    code: 'MASTER-SAVE',
    minSavedRequired: 1000000,
    claimed: false,
  },
];

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' đ';
}

export function formatNumberVN(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
}

export function getNowFormatted(): { timeStr: string; dateStr: string } {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return {
    timeStr: `${hours}:${minutes}`,
    dateStr: `${day}/${month}/${year}`,
  };
}
