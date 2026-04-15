import React from 'react';
import { Plus } from 'lucide-react';
import { storeConfig } from '../config';

const ProductCard = ({ product, cartQuantity, onAdd }) => {
  return (
    <div 
      onClick={() => onAdd(product)}
      className="product-card"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '140px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {cartQuantity > 0 && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'var(--primary)',
          color: '#fff',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          zIndex: 2
        }}>
          {cartQuantity}
        </div>
      )}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>
          {product.name}
        </h3>
        {product.stock < 10 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', background: 'rgba(244, 67, 54, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
            Low Stock
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--primary)' }}>
          {storeConfig.currencySymbol}{product.price.toFixed(2)}
        </span>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '6px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-main)'
        }}>
          <Plus size={16} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
