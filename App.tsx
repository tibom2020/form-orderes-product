
import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, EMPLOYEES, CUSTOMERS } from './constants';
import type { Product, CartItem, Employee, Order } from './types';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Login from './components/Login';
import OrderHistory from './components/OrderHistory';
import { postOrderToGoogleSheet } from './services/googleSheetService';
import { getOrders, saveOrders } from './utils/storage';
import { ExclamationCircleIcon } from './components/icons';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9FjCzFRhWSWyWrGw4FLh42t4IQg8_jObpAfMKY4uyBJ1nm3HUbthzWJu9cbczX5ipqg/exec';

const App: React.FC = () => {
  const [loggedInEmployee, setLoggedInEmployee] = useState<Employee | null>(null);
  const [customerCode, setCustomerCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState<'All' | 'Local' | 'Import'>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [drafts, setDrafts] = useState<Order[]>([]);
  const [sentOrders, setSentOrders] = useState<Order[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(getOrders('draftOrders'));
    setSentOrders(getOrders('sentOrders'));
  }, []);
  
  const handleLoginSuccess = (employee: Employee) => {
    setLoggedInEmployee(employee);
  };

  const resetOrderState = () => {
    setCustomerCode('');
    setCustomerName('');
    setCart([]);
    setNote('');
    setIsNewCustomer(false);
    setActiveDraftId(null);
  }

  const handleLogout = () => {
    setLoggedInEmployee(null);
    resetOrderState();
  };

  const handleCustomerCodeChange = (code: string) => {
    setCustomerCode(code);
    const foundCustomer = CUSTOMERS.find(c => c.code.toLowerCase() === code.trim().toLowerCase());
    if (foundCustomer) {
      setCustomerName(foundCustomer.name);
    } else {
      setCustomerName('');
    }
  };
  
  const handleCustomerNameChange = (name: string) => {
    setCustomerName(name);
  };
  
  const handleNewCustomerToggle = (isChecked: boolean) => {
    setIsNewCustomer(isChecked);
    const discountNote = "KH new 9.9%";
    if (isChecked) {
      setNote(prevNote => {
        if (prevNote.includes(discountNote)) return prevNote;
        return prevNote ? `${prevNote}\n${discountNote}` : discountNote;
      });
    } else {
      setNote(prevNote => 
        prevNote
          .split('\n')
          .filter(line => line.trim() !== discountNote.trim())
          .join('\n')
      );
    }
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    if (product.promotion) {
      const promotionNote = `${product.name}: ${product.promotion}`;
      setNote(prevNote => {
        if (prevNote.includes(promotionNote)) {
          return prevNote;
        }
        return prevNote ? `${prevNote}\n${promotionNote}` : promotionNote;
      });
    }
  };

  const handleRemoveItem = (productId: number) => {
    const itemToRemove = cart.find(item => item.id === productId);
    setCart(prevCart => prevCart.filter(item => item.id !== productId));

    if (itemToRemove && itemToRemove.promotion) {
        const promotionNote = `${itemToRemove.name}: ${itemToRemove.promotion}`;
        setNote(prevNote => {
            const lines = prevNote.split('\n').filter(line => line.trim() !== promotionNote.trim());
            return lines.join('\n');
        });
    }
  };
  
  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    const itemToUpdate = cart.find(item => item.id === productId);
    if (!itemToUpdate) return;

    if (isNaN(newQuantity) || newQuantity < itemToUpdate.minOrderQuantity) {
        handleRemoveItem(productId);
    } else {
        setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setNote(prevNote => {
        const promotionNotes = cart
            .map(item => item.promotion ? `${item.name}: ${item.promotion}`.trim() : null)
            .filter(Boolean);
        const noteLines = prevNote.split('\n');
        const remainingLines = noteLines.filter(line => {
            const trimmedLine = line.trim();
            if (trimmedLine === "") return false;
            return !promotionNotes.some(promo => promo === trimmedLine);
        });
        return remainingLines.join('\n');
    });
    // If clearing a loaded draft, we detach from it to avoid accidental overwrite.
    setActiveDraftId(null);
  };
  
  const createOrderObject = (): Omit<Order, 'id' | 'createdAt' | 'status'> => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalSales = cart.reduce((sum, item) => sum + (item.basePrice ?? 0) * item.quantity, 0);
    const khNewDiscount = isNewCustomer ? totalAmount * 0.099 : 0;
    const finalAmount = totalAmount - khNewDiscount;
    return {
      customerCode, customerName, note, items: cart, isNewCustomer,
      totalAmount, finalAmount, totalSales
    };
  };

  const handleSaveDraft = () => {
    if (cart.length === 0) {
      setError("Không thể lưu đơn hàng trống.");
      return;
    }
    const orderData = createOrderObject();
    let updatedDrafts;
    if (activeDraftId) {
      updatedDrafts = drafts.map(d => d.id === activeDraftId ? { ...d, ...orderData } : d);
    } else {
      const newDraft: Order = {
        ...orderData,
        id: Date.now().toString(),
        createdAt: Date.now(),
        status: 'draft',
      };
      updatedDrafts = [newDraft, ...drafts];
      setActiveDraftId(newDraft.id);
    }
    setDrafts(updatedDrafts);
    saveOrders('draftOrders', updatedDrafts);
    setSuccessMessage(activeDraftId ? 'Cập nhật đơn nháp thành công!' : 'Đã lưu đơn nháp thành công!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSubmitOrder = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!loggedInEmployee) {
      setError('Vui lòng đăng nhập lại.');
      return;
    }
    if (!customerCode.trim() || !customerName.trim()) {
      setError('Vui lòng nhập mã và tên khách hàng.');
      return;
    }
    setIsLoading(true);

    const result = await postOrderToGoogleSheet(GOOGLE_SCRIPT_URL, {
      employeeName: loggedInEmployee.name,
      employeeCode: loggedInEmployee.code,
      customerCode, customerName, note, items: cart
    });

    setIsLoading(false);
    if (result.status === 'success') {
      const orderData = createOrderObject();
      const newSentOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        createdAt: Date.now(),
        status: 'sent',
      };
      const updatedSentOrders = [newSentOrder, ...sentOrders];
      setSentOrders(updatedSentOrders);
      saveOrders('sentOrders', updatedSentOrders);

      if (activeDraftId) {
        const updatedDrafts = drafts.filter(d => d.id !== activeDraftId);
        setDrafts(updatedDrafts);
        saveOrders('draftOrders', updatedDrafts);
      }
      
      setSuccessMessage('Đơn hàng đã được gửi thành công!');
      resetOrderState();
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setError(result.message || 'Có lỗi xảy ra khi gửi đơn hàng.');
    }
  };
  
  const handleLoadDraft = (id: string) => {
    const draftToLoad = drafts.find(d => d.id === id);
    if(draftToLoad) {
        setCustomerCode(draftToLoad.customerCode);
        setCustomerName(draftToLoad.customerName);
        setNote(draftToLoad.note);
        setCart(draftToLoad.items);
        setIsNewCustomer(draftToLoad.isNewCustomer);
        setActiveDraftId(draftToLoad.id);
        window.scrollTo(0, 0);
    }
  };

  const handleDeleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(d => d.id !== id);
    setDrafts(updatedDrafts);
    saveOrders('draftOrders', updatedDrafts);
    if(id === activeDraftId) {
        resetOrderState();
    }
  };

  const filteredProducts = useMemo(() => 
    PRODUCTS
      .filter(p => productTypeFilter === 'All' || p.type === productTypeFilter)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), 
    [searchTerm, productTypeFilter]
  );

  if (!loggedInEmployee) {
    return <Login employees={EMPLOYEES} onLoginSuccess={handleLoginSuccess} />;
  }

  const getFilterButtonClass = (filterType: 'All' | 'Local' | 'Import') => {
      const baseClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2";
      return productTypeFilter === filterType ? `${baseClass} bg-sky-600 text-white shadow` : `${baseClass} bg-white text-slate-700 border border-slate-300 hover:bg-slate-50`;
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-600">Báo Giá & Đặt Hàng</h1>
          <div className="flex items-center space-x-4">
            <span className="text-slate-600">Xin chào, <span className="font-bold">{loggedInEmployee.name}</span></span>
            <button onClick={handleLogout} className="bg-red-500 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 text-sm">Đăng xuất</button>
          </div>
        </div>
      </header>
      
      {error && <div className="fixed top-24 right-4 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg flex items-center"><ExclamationCircleIcon /><span className="ml-2">{error}</span></div>}

      <main className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="lg:w-2/3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <div className="flex-grow"><input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full border border-slate-300 rounded-md p-3 focus:ring-2 focus:ring-sky-500"/></div>
                <div className="flex-shrink-0 flex items-center justify-center space-x-2">
                    <button onClick={() => setProductTypeFilter('All')} className={getFilterButtonClass('All')}>Tất cả</button>
                    <button onClick={() => setProductTypeFilter('Local')} className={getFilterButtonClass('Local')}>Hàng Local</button>
                    <button onClick={() => setProductTypeFilter('Import')} className={getFilterButtonClass('Import')}>Hàng Import</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />)}
            </div>
          </div>

          <div className="lg:w-1/3 mt-6 lg:mt-0">
             <div className="sticky top-24">
                <Cart 
                    items={cart} employeeName={loggedInEmployee.name} customerCode={customerCode}
                    onCustomerCodeChange={handleCustomerCodeChange} customerName={customerName}
                    onCustomerNameChange={handleCustomerNameChange} note={note} onNoteChange={setNote}
                    onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart} onSubmitOrder={handleSubmitOrder} onSaveDraft={handleSaveDraft}
                    isLoading={isLoading} successMessage={successMessage} isNewCustomer={isNewCustomer}
                    onIsNewCustomerChange={handleNewCustomerToggle} activeDraftId={activeDraftId}
                />
             </div>
          </div>
        </div>
        
        <div className="mt-12">
            <OrderHistory drafts={drafts} sent={sentOrders} onLoad={handleLoadDraft} onDelete={handleDeleteDraft} />
        </div>
      </main>
    </div>
  );
};

export default App;