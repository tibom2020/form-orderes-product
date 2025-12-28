
import React, { useState } from 'react';
import type { Product } from '../types';
import { PlusIcon, InfoIcon } from './icons';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number | string>(product.minOrderQuantity);
  const [error, setError] = useState('');

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError('');
    if (value === '' || /^[0-9\b]+$/.test(value)) {
        setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
        setError('Số lượng không hợp lệ.');
        return;
    }
    if (numQuantity < product.minOrderQuantity) {
        setError(`Tối thiểu ${product.minOrderQuantity} sản phẩm.`);
        return;
    }
    setError('');
    onAddToCart(product, numQuantity);
    setQuantity(product.minOrderQuantity);
  };
  
  const isValueBasedMinOrder = product.minOrder.includes('k');

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
      <div>
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-800 text-base">{product.name}</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.type === 'Import' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {product.type}
            </span>
        </div>
        <p className="text-lg font-semibold text-sky-600 mt-2">
            {formatCurrency(product.price)}
             {product.originalPrice && (
                <span className="text-base font-normal text-slate-400 ml-2 line-through">
                    {formatCurrency(product.originalPrice)}
                </span>
            )}
            <span className="text-sm font-normal text-slate-500 ml-1">(VAT)</span>
        </p>
         {product.promotion && (
            <p className="text-sm font-bold text-red-500 my-2">{product.promotion}</p>
        )}
        <div className="text-sm text-slate-500 flex items-center space-x-2 mt-3">
            <InfoIcon />
            <span>
                Mua tối thiểu: <span className="font-semibold text-slate-700">{product.minOrder}</span>
                {isValueBasedMinOrder && <span className="text-xs"> (giá trị)</span>}
            </span>
        </div>
      </div>
      <div className="mt-4">
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min={product.minOrderQuantity}
            className="w-20 text-center border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder={`Tối thiểu ${product.minOrderQuantity}`}
          />
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
          >
            <PlusIcon />
            <span className="ml-2">Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;