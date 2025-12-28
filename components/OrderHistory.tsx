
import React, { useState } from 'react';
import type { Order } from '../types';
import { formatCurrency } from '../utils/formatters';
import { TrashIcon } from './icons';

interface OrderHistoryProps {
  drafts: Order[];
  sent: Order[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ drafts, sent, onLoad, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'drafts' | 'sent'>('drafts');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const getTabClass = (tabName: 'drafts' | 'sent') => {
    const baseClass = "px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none";
    if (activeTab === tabName) {
      return `${baseClass} bg-white border-slate-200 border-l border-t border-r -mb-px text-sky-600`;
    }
    return `${baseClass} text-slate-500 hover:text-slate-700 hover:bg-slate-100`;
  };

  const OrderRow: React.FC<{ order: Order, type: 'draft' | 'sent' }> = ({ order, type }) => (
    <div className="p-3 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 grid grid-cols-4 gap-4 items-center text-sm">
        <div>
            <p className="font-semibold text-slate-800">{order.customerName}</p>
            <p className="text-xs text-slate-500">{order.customerCode}</p>
        </div>
        <div className="text-slate-600">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
        <div className="font-semibold text-slate-800 text-right">{formatCurrency(order.finalAmount)}</div>
        <div className="flex justify-end space-x-2">
            {type === 'draft' ? (
                <>
                    <button onClick={() => onLoad(order.id)} className="bg-sky-500 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-sky-600 transition-colors">Tải Lại</button>
                    <button onClick={() => onDelete(order.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-colors"><TrashIcon /></button>
                </>
            ) : (
                <button onClick={() => setViewingOrder(order)} className="bg-slate-500 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-slate-600 transition-colors">Xem</button>
            )}
        </div>
    </div>
  );

  const OrderModal: React.FC<{ order: Order, onClose: () => void }> = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">Chi Tiết Đơn Hàng Đã Gửi</h3>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div><span className="font-semibold">Khách hàng:</span> {order.customerName} ({order.customerCode})</div>
                    <div><span className="font-semibold">Ngày gửi:</span> {new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                </div>
                <div className="border-t pt-2">
                    <h4 className="font-semibold mb-2">Sản phẩm:</h4>
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm py-1 border-b last:border-0">
                            <span>{item.name} x {item.quantity}</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 border-t pt-2 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Tạm tính:</span> <span>{formatCurrency(order.totalAmount)}</span></div>
                    {order.isNewCustomer && <div className="flex justify-between text-red-600"><span >CK KH-New:</span> <span>- {formatCurrency(order.totalAmount * 0.099)}</span></div>}
                    <div className="flex justify-between font-bold text-base border-t pt-1 mt-1"><span >Tổng cộng:</span> <span>{formatCurrency(order.finalAmount)}</span></div>
                </div>
                {order.note && <div className="mt-4 border-t pt-2"><h4 className="font-semibold">Ghi chú:</h4><p className="text-sm whitespace-pre-wrap bg-slate-50 p-2 rounded-md">{order.note}</p></div>}
            </div>
            <div className="p-4 border-t bg-slate-50 text-right">
                <button onClick={onClose} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-700">Đóng</button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg">
      <div className="px-4 border-b border-slate-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setActiveTab('drafts')} className={getTabClass('drafts')}>Đơn Nháp ({drafts.length})</button>
          <button onClick={() => setActiveTab('sent')} className={getTabClass('sent')}>Đơn Đã Gửi ({sent.length})</button>
        </nav>
      </div>
      
      <div>
        <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-4 gap-4 text-xs font-bold text-slate-500 uppercase">
            <div>Khách Hàng</div>
            <div>Ngày Tạo</div>
            <div className="text-right">Tổng Tiền</div>
            <div className="text-right">Hành Động</div>
        </div>
        {activeTab === 'drafts' && (
            drafts.length > 0 ? drafts.map(d => <OrderRow key={d.id} order={d} type="draft" />) : <p className="p-4 text-center text-slate-500">Không có đơn nháp nào.</p>
        )}
        {activeTab === 'sent' && (
            sent.length > 0 ? sent.map(s => <OrderRow key={s.id} order={s} type="sent" />) : <p className="p-4 text-center text-slate-500">Chưa có đơn hàng nào được gửi đi.</p>
        )}
      </div>

      {viewingOrder && <OrderModal order={viewingOrder} onClose={() => setViewingOrder(null)} />}
    </div>
  );
};

export default OrderHistory;
