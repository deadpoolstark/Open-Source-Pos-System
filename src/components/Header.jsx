import React, { useState, useEffect } from 'react';
import { Coffee, Clock, List, LogOut, User as UserIcon } from 'lucide-react';
import { storeConfig } from '../config';

const Header = ({ currentView, setCurrentView, user, onLogout }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 10,
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setCurrentView('pos')}>
        <div style={{
          background: 'var(--primary)',
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Coffee color="#fff" size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: 'var(--text-main)' }}>
            {storeConfig.storeName}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            POS Terminal
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <Clock size={18} />
          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="hide-on-mobile" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: user?.role === 'admin' ? 'var(--primary)' : 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <UserIcon size={16} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '600', margin: 0, lineHeight: 1 }}>
              {user?.username}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, textTransform: 'capitalize' }}>
              {user?.role}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setCurrentView(currentView === 'pos' ? 'orders' : 'pos')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: currentView === 'orders' ? 'var(--primary)' : 'var(--bg-card)',
              color: currentView === 'orders' ? '#fff' : 'var(--text-main)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s',
              fontWeight: '500'
            }}
          >
            <List size={18} />
            {currentView === 'pos' ? "View Orders" : "Back to POS"}
          </button>
          
          <button 
            onClick={onLogout}
            style={{
              color: 'var(--accent-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.2s',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            <LogOut size={18} />
            <span className="hide-on-mobile">Logout</span>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;
