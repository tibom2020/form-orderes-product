
import type { Product, Employee, Customer } from './types';

export const EMPLOYEES: Employee[] = [
  { name: 'Huynh Thi To Trinh', code: '20045852' },
  { name: 'Ly Minh Dat', code: '20044677' },
  { name: 'Nguyen Thi Hong Cam', code: '20044676' },
  { name: 'Huynh Van Thanh Huyen', code: '20043742' },
  { name: 'Le Huu Phuc', code: '20043750' },
  { name: 'Truong Hoang Du', code: '20042514' },
  { name: 'Ngo Thi Thuy Quynh', code: '20043683' },
  { name: 'Huynh Hoang Hon', code: '20046380' },
  { name: 'Phan Viet Linh', code: '20043741' },
];

// !!! QUAN TRỌNG: BẠN CẦN THAY THẾ DANH SÁCH MẪU NÀY BẰNG DANH SÁCH 600 KHÁCH HÀNG CỦA MÌNH
// Đảm bảo đúng định dạng: { code: 'MÃ KHÁCH HÀNG', name: 'TÊN KHÁCH HÀNG' }
export const CUSTOMERS: Customer[] = [
  { code: 'KH001', name: 'Công Ty Dược Phẩm ABC' },
  { code: 'KH002', name: 'Nhà Thuốc An Khang' },
  { code: 'KH003', name: 'Bệnh Viện Hữu Nghị' },
  { code: 'KH004', name: 'Công Ty TNHH Dược Phẩm XYZ' },
  { code: 'NT-LONGCHAU-01', name: 'Nhà Thuốc FPT Long Châu 1' },
  { code: 'HCM-0123', name: 'Bệnh viện Chợ Rẫy' },
];


export const PRODUCTS: Product[] = [
  { id: 1, name: 'CORBIERE CALCIUM PLUS', minOrder: '1', minOrderQuantity: 1, price: 223435, type: 'Local', basePrice: 206884 },
  { id: 2, name: 'ACEMUC 200 CAP_BL3X10_VN', minOrder: '1', minOrderQuantity: 1, price: 82911, type: 'Local', basePrice: 78963 },
  { id: 3, name: 'ACEMUC 200mg SAC 1g_SC30_VN', minOrder: '1', minOrderQuantity: 1, price: 91562, type: 'Local', basePrice: 87202 },
  { id: 4, name: 'ACEMUC Kids 100mg_0,5g_SC30 VN', minOrder: '1', minOrderQuantity: 1, price: 64605, type: 'Local', basePrice: 61529 },
  { id: 5, name: 'MAGNE-B6 Tab B/50 (bao film)', minOrder: '1', minOrderQuantity: 1, price: 101706, type: 'Local', basePrice: 96863 },
  { id: 6, name: 'TELFAST HD 180MG', minOrder: '1', minOrderQuantity: 1, price: 280760, type: 'Local', basePrice: 267390 },
  { id: 7, name: 'TELFAST BD 60MG', minOrder: '1', minOrderQuantity: 1, price: 128931, type: 'Local', basePrice: 122791 },
  { id: 8, name: 'TELFAST 30MG', minOrder: '1', minOrderQuantity: 1, price: 30293, type: 'Local', basePrice: 28850 },
  { id: 9, name: 'NO-SPA 40mg', minOrder: '1', minOrderQuantity: 1, price: 45700, type: 'Local', basePrice: 43524 },
  { id: 10, name: 'BISOLVON KIDS 60ML BOTx1 VN', minOrder: '1', minOrderQuantity: 1, price: 36571, type: 'Local', originalPrice: 40567, promotion: 'KM 9.85% đến 31.12.2025', basePrice: 38635 },
  { id: 11, name: 'ENTEROGERMINA GUT DEFEND (NEW)', minOrder: '1', minOrderQuantity: 1, price: 179353, type: 'Import', basePrice: 166068 },
  { id: 12, name: 'ENTEROGERMINA GUT RESTORE ( 4B)', minOrder: '1', minOrderQuantity: 1, price: 305130, type: 'Import', basePrice: 290600 },
  { id: 13, name: 'ENTEROGERMINA BABY COMFORT', minOrder: '1', minOrderQuantity: 1, price: 460000, type: 'Import', basePrice: 425926 },
  { id: 14, name: 'BISOLVON 8MG TAB', minOrder: '1', minOrderQuantity: 1, price: 60751, type: 'Import', originalPrice: 63901, promotion: 'ck 4.93% CTKM đến 31.12.2025', basePrice: 60858 },
  { id: 15, name: 'BUSCOPAN VIÊN', minOrder: '1', minOrderQuantity: 1, price: 125790, type: 'Import', basePrice: 119800 },
  { id: 16, name: 'NOSPA 80 V', minOrder: '1', minOrderQuantity: 1, price: 27041, type: 'Import', basePrice: 25753 },
  { id: 17, name: 'PHARMATON ENERGY', minOrder: '1', minOrderQuantity: 1, price: 160944, type: 'Import', originalPrice: 228614, promotion: 'KM 29.6% đến 31.12.2025', basePrice: 211680 },
  { id: 18, name: 'PHARMATON ESSENT', minOrder: '1', minOrderQuantity: 1, price: 205286, type: 'Import', basePrice: 190080 },
  { id: 19, name: 'PHARMATON KIDDI', minOrder: '1', minOrderQuantity: 1, price: 117850, type: 'Import', originalPrice: 167400, promotion: 'KM 29.6% đến 31.12.2025', basePrice: 155000 },
  { id: 20, name: 'PHARMATON ENERGY FIZZI SỦI', minOrder: '1', minOrderQuantity: 1, price: 104760, type: 'Import', basePrice: 97000 },
  { id: 21, name: 'PHOSPHALUGEL 2.47G/20G GEL SC26 M36 VN', minOrder: '1', minOrderQuantity: 1, price: 120558, type: 'Import', basePrice: 114817 },
  { id: 22, name: 'OSTELIN VIT D & CALCI CHAI CHAI 130V', minOrder: '1', minOrderQuantity: 1, price: 300000, type: 'Import', basePrice: 277778 },
  { id: 23, name: 'OSTELIN VIT D & CALCI CHAI CHAI 275V', minOrder: '1', minOrderQuantity: 1, price: 540000, type: 'Import', basePrice: 500000 },
  { id: 24, name: 'OSTELIN VIT D & CALCI CHAI 30V', minOrder: '1', minOrderQuantity: 1, price: 130000, type: 'Import', basePrice: 120370 },
  { id: 25, name: 'OSTELIN VIT D & CALCI CHAI 60V', minOrder: '1', minOrderQuantity: 1, price: 230000, type: 'Import', basePrice: 212963 }
];