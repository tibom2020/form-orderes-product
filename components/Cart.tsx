
import React, { useMemo } from 'react';
import type { CartItem } from '../types';
import { PlusIcon, MinusIcon, TrashIcon, CartIcon, CheckCircleIcon, SaveIcon } from './icons';
import { formatCurrency } from '../utils/formatters';

const getDiscountPercentFromString = (promotion?: string): number => {
    if (!promotion) return 0;
    const match = promotion.match(/(\d+(\.\d+)?)\s*%/);
    if (match && match[1]) {
        return parseFloat(match[1]) / 100;
    }
    return 0;
};

interface CartProps {
  items: CartItem[];
  employeeName: string;
  customerCode: string;
  onCustomerCodeChange: (code: string) => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  note: string;
  onNoteChange: (note: string) => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onSaveDraft: () => void;
  onSubmitOrder: () => void;
  isLoading: boolean;
  successMessage: string | null;
  isNewCustomer: boolean;
  onIsNewCustomerChange: (isChecked: boolean) => void;
  activeDraftId: string | null;
}

const Cart: React.FC<CartProps> = (props) => {
  const { 
    items, employeeName, customerCode, onCustomerCodeChange, customerName,
    onCustomerNameChange, note, onNoteChange, onUpdateQuantity, onRemoveItem,
    onClearCart, onSaveDraft, onSubmitOrder, isLoading, successMessage, isNewCustomer, onIsNewCustomerChange,
    activeDraftId
  } = props;

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSales = items.reduce((sum, item) => sum + (item.basePrice ?? 0) * item.quantity, 0);
  const khNewDiscount = isNewCustomer ? totalAmount * 0.099 : 0;
  const finalAmount = totalAmount - khNewDiscount;

  const { totalMaxPayableFeeLocal, totalMaxPayableFeeImport, hasLocalItems, hasImportItems } = useMemo(() => {
    let localFee = 0;
    let importFee = 0;
    let hasLocal = false;
    let hasImport = false;

    items.forEach(item => {
        const basePriceLine = (item.basePrice ?? 0) * item.quantity;
        if (basePriceLine > 0) {
            const maxTotalDiscountLine = basePriceLine * 0.5;
            const monthlyDiscountPercent = getDiscountPercentFromString(item.promotion);
            const monthlyDiscountAmount = basePriceLine * monthlyDiscountPercent;
            const newOrderDiscountAmount = isNewCustomer ? (basePriceLine * 0.099) : 0;
            const maxPayableFeeLine = maxTotalDiscountLine - monthlyDiscountAmount - newOrderDiscountAmount;

            if (item.type === 'Local') {
                localFee += maxPayableFeeLine;
                hasLocal = true;
            } else {
                importFee += maxPayableFeeLine;
                hasImport = true;
            }
        }
    });
    return { totalMaxPayableFeeLocal: localFee, totalMaxPayableFeeImport: importFee, hasLocalItems: hasLocal, hasImportItems: hasImport };
  }, [items, isNewCustomer]);


  return (
    <div className="bg-white h-full rounded-lg border border-slate-200 shadow-lg flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <CartIcon />
                <span className="ml-2">Đơn Hàng</span>
                {activeDraftId && <span className="text-xs font-semibold bg-amber-100 text-amber-800 ml-2 px-2 py-0.5 rounded-full">Đang sửa nháp</span>}
            </h2>
            {items.length > 0 && !isLoading && (
                <button 
                    onClick={onClearCart}
                    className="flex items-center text-sm text-red-500 hover:text-red-700 font-semibold py-1 px-2 rounded-md hover:bg-red-50 transition-colors"
                    title="Xóa toàn bộ sản phẩm trong đơn"
                >
                    <TrashIcon />
                    <span className="ml-1">Xóa đơn</span>
                </button>
            )}
        </div>
      
        <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50">
            <div>
                <label htmlFor="customerCode" className="block text-sm font-medium text-slate-700">Mã khách hàng</label>
                <input
                    type="text"
                    id="customerCode"
                    value={customerCode}
                    onChange={(e) => onCustomerCodeChange(e.target.value)}
                    className="mt-1 w-full bg-white border border-slate-300 rounded-md p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Nhập mã để tự động điền tên"
                    required
                />
            </div>
            <div>
                 <label htmlFor="customerName" className="block text-sm font-medium text-slate-700">Tên khách hàng</label>
                <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => onCustomerNameChange(e.target.value)}
                    className="mt-1 w-full bg-white border border-slate-300 rounded-md p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Nhập tên hoặc điền tự động theo mã"
                    required
                />
            </div>
        </div>

        {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-4">Chưa có sản phẩm nào trong đơn.</p>
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="hidden sm:flex text-xs font-semibold text-slate-500 pb-2 border-b mb-2 -mx-4 px-4">
                <div className="flex-auto">Sản phẩm</div>
                <div className="w-24 text-center">Số lượng</div>
                <div className="w-24 text-right">Thành tiền</div>
                <div className="w-24 text-right">Phí Trả Tối Đa</div>
                <div className="w-8"></div>
            </div>
            {items.map(item => {
              const basePriceLine = (item.basePrice ?? 0) * item.quantity;
              const maxTotalDiscountLine = basePriceLine * 0.5;
              const monthlyDiscountPercent = getDiscountPercentFromString(item.promotion);
              const monthlyDiscountAmount = basePriceLine * monthlyDiscountPercent;
              const newOrderDiscountAmount = isNewCustomer ? (basePriceLine * 0.099) : 0;
              const maxPayableFeeLine = maxTotalDiscountLine - monthlyDiscountAmount - newOrderDiscountAmount;

              return (
              <div key={item.id} className="flex items-center space-x-2 text-sm">
                <div className="flex-auto">
                  <p className="font-semibold text-slate-700 leading-tight">{item.name}</p>
                  <p className="text-xs text-slate-500">
                      {formatCurrency(item.price)}
                      <span className="text-slate-400 ml-1">(VAT)</span>
                  </p>
                </div>
                <div className="w-24 flex-shrink-0">
                    <div className="flex items-center border border-slate-200 rounded-md w-max mx-auto">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-slate-100 rounded-l-md disabled:opacity-50" disabled={item.quantity <= item.minOrderQuantity}>
                            <MinusIcon />
                        </button>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                            className="w-10 text-center border-l border-r border-slate-200 focus:outline-none text-sm"
                            min={item.minOrderQuantity}
                        />
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-slate-100 rounded-r-md">
                            <PlusIcon />
                        </button>
                    </div>
                </div>
                <div className="w-24 text-right flex-shrink-0">
                    <span className="font-semibold text-slate-800">
                        {formatCurrency(item.price * item.quantity)}
                    </span>
                </div>
                <div className="w-24 text-right flex-shrink-0">
                    <span className={`font-semibold ${maxPayableFeeLine < 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {formatCurrency(maxPayableFeeLine)}
                    </span>
                </div>
                <div className="w-8 flex-shrink-0 text-right">
                    <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 p-1">
                        <TrashIcon />
                    </button>
                </div>
              </div>
            )})}
            </div>
        )}

      <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-medium text-slate-500">Tạm tính:</span>
            <span className="text-lg font-semibold text-slate-800">{formatCurrency(totalAmount)}</span>
          </div>
          {totalSales > 0 && (
              <div className="flex justify-between items-baseline">
                <span className="text-base font-medium text-slate-500">Doanh số:</span>
                <span className="text-lg font-semibold text-slate-800">
                  {formatCurrency(totalSales)}
                   <span className="text-sm font-normal text-slate-500 ml-1">(ko VAT)</span>
                </span>
              </div>
          )}
          <div className="border-t border-b border-slate-200 py-2 my-1">
             <label className="flex items-center cursor-pointer select-none">
                <input type="checkbox" checked={isNewCustomer} onChange={(e) => onIsNewCustomerChange(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                <span className="ml-2 text-sm font-medium text-slate-700">Đơn "KH-New"</span>
              </label>
              {isNewCustomer && (
                <div className="flex justify-between items-baseline text-red-600 mt-1 pl-6">
                    <span className="text-sm font-medium">Chiết khấu (9.9%):</span>
                    <span className="text-sm font-semibold">- {formatCurrency(khNewDiscount)}</span>
                  </div>
              )}
          </div>
          {items.length > 0 && (hasLocalItems || hasImportItems) && (
            <div className="border-b border-slate-200 pb-2 mb-2">
                <h4 className="text-sm font-semibold text-slate-700 mb-1">Tổng Phí Trả Tối Đa</h4>
                <div className="space-y-1 text-sm pl-2">
                    {hasLocalItems && (<div className="flex justify-between"><span>Hàng Local:</span><span className={`font-bold ${totalMaxPayableFeeLocal < 0 ? 'text-red-500' : 'text-green-600'}`}>{formatCurrency(totalMaxPayableFeeLocal)}</span></div>)}
                    {hasImportItems && (<div className="flex justify-between"><span>Hàng Import:</span><span className={`font-bold ${totalMaxPayableFeeImport < 0 ? 'text-red-500' : 'text-green-600'}`}>{formatCurrency(totalMaxPayableFeeImport)}</span></div>)}
                </div>
            </div>
           )}
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-semibold text-slate-600">Tổng cộng:</span>
            <span className="text-2xl font-bold text-sky-600">{formatCurrency(finalAmount)}<span className="text-base font-normal text-slate-500 ml-1">(VAT)</span></span>
          </div>
        </div>
        <div className="mb-4">
          <p className="block text-sm font-medium text-slate-700 mb-1">Tên nhân viên</p>
          <p className="w-full bg-slate-100 border border-slate-200 rounded-md p-2 text-slate-700 font-medium">{employeeName}</p>
        </div>
        <div className="mb-4">
            <label htmlFor="orderNote" className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
            <textarea id="orderNote" value={note} onChange={(e) => onNoteChange(e.target.value)} rows={3} className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Thêm ghi chú cho đơn hàng..."></textarea>
        </div>
        
        {successMessage && (<div className="mb-4 bg-green-100 border border-green-200 text-green-800 p-3 rounded-md flex items-center text-sm transition-opacity duration-300"><CheckCircleIcon /><span className="ml-2 font-medium">{successMessage}</span></div>)}
        
        <div className="flex space-x-2">
            <button
                onClick={onSaveDraft}
                disabled={items.length === 0 || isLoading}
                className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
                <SaveIcon />
                <span className="ml-2">{activeDraftId ? 'Cập nhật Nháp' : 'Lưu Đơn Nháp'}</span>
            </button>
            <button
                onClick={onSubmitOrder}
                disabled={items.length === 0 || isLoading}
                className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Gửi Đơn Hàng'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
