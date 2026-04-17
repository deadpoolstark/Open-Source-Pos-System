import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, Zap } from 'lucide-react';
import { storeConfig } from '../config';

const Cart = ({ cartItems, updateQuantity, clearCart, checkout, cieCheckout, isCheckingOut }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * storeConfig.taxRate;
  const total = subtotal + tax;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={20} color="var(--primary)" />
          Current Order
        </h2>
        {cartItems.length > 0 && (
          <button 
            onClick={clearCart}
            style={{ color: 'var(--accent-danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cartItems.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>No items in cart</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: '12px', background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '500', marginBottom: '4px' }}>{item.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{storeConfig.currencySymbol}{item.price.toFixed(2)}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: '600' }}>{storeConfig.currencySymbol}{(item.price * item.quantity).toFixed(2)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-dark)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ color: 'var(--text-main)' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ color: 'var(--text-main)' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
            <span>Subtotal</span>
            <span>{storeConfig.currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          {storeConfig.features.showTaxInCart && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
              <span>Tax ({(storeConfig.taxRate * 100).toFixed(0)}%)</span>
              <span>{storeConfig.currencySymbol}{tax.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>{storeConfig.currencySymbol}{total.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => {
                console.log("CIE Button Clicked!");
                cieCheckout();
              }}
              disabled={isCheckingOut}
              style={{
                flex: '0 0 80px',
                padding: '16px 0',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
                opacity: isCheckingOut ? 0.7 : 1,
                cursor: isCheckingOut ? 'not-allowed' : 'pointer'
              }}
              onMouseOver={(e) => { if(!isCheckingOut) e.currentTarget.style.background = 'var(--bg-dark)'; }}
              onMouseOut={(e) => { if(!isCheckingOut) e.currentTarget.style.background = 'var(--bg-card)'; }}
              title="CIE Order (Total: 0)"
            >
              <Zap size={18} />
              CIE
            </button>

            <button 
              onClick={checkout}
              disabled={isCheckingOut}
              style={{
                flex: 1,
                padding: '16px',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s',
                opacity: isCheckingOut ? 0.7 : 1,
                cursor: isCheckingOut ? 'not-allowed' : 'pointer'
              }}
              onMouseOver={(e) => { if(!isCheckingOut) e.currentTarget.style.background = 'var(--primary-hover)'; }}
              onMouseOut={(e) => { if(!isCheckingOut) e.currentTarget.style.background = 'var(--primary)'; }}
            >
              {isCheckingOut ? (
                <span className="loader">Processing...</span>
              ) : (
                <>
                  <CreditCard size={20} />
                  Checkout
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
