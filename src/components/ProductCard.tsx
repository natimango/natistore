import React from 'react';

interface ProductCardProps {
  imageUrl: string;
  title: string;
  artisan: string;
  price: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, title, artisan, price }) => (
  <div className="bg-white border rounded-lg shadow p-4 flex flex-col items-center">
    <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded mb-2" />
    <div className="font-heading text-lg mb-1">{title}</div>
    <div className="text-sm text-gray-500 mb-2">by {artisan}</div>
    <div className="font-bold text-turmeric">{price}</div>
  </div>
);

export default ProductCard; 