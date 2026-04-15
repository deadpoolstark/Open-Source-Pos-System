import React, { useEffect, useState } from 'react';
import { Download, TrendingUp, DollarSign, ShoppingBag, Calendar, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { fetchTransactions, deleteTransaction, updateTransactionStatus } from '../firebase';
import { storeConfig } from '../config';

const Orders = ({ userRole }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const downloadCSV = () => {
    const headers = ['Order ID', 'Date', 'Time', 'Items Ordered', 'Total Cost', 'Status', 'Sold By'];
    const rows = orders.map(order => {
      const dateObj = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) : new Date(order.createdAt || Date.now());
      const itemsStr = order.items?.map(i => `${i.quantity}x ${i.name}`).join(' | ') || '';
      return [
        `"${order.id}"`,
        `"${dateObj.toLocaleDateString()}"`,
        `"${dateObj.toLocaleTimeString()}"`,
        `"${itemsStr}"`,
        `${order.total?.toFixed(2) || 0}`,
        `"${order.status || 'Completed'}"`,
        `"${order.createdBy || 'Unknown'}"`
      ].join(',');
    });
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchTransactions().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    const confirmMsg = userRole === 'admin' 
      ? 'Are you sure you want to permanently delete this order?' 
      : 'Request deletion approval from Admin?';

    if (window.confirm(confirmMsg)) {
      try {
        if (userRole === 'admin') {
          await deleteTransaction(id);
          setOrders(prev => prev.filter(order => order.id !== id));
        } else {
          await updateTransactionStatus(id, 'pending_deletion');
          setOrders(prev => prev.map(order => order.id === id ? { ...order, status: 'pending_deletion' } : order));
          alert('Deletion request sent to Admin.');
        }
      } catch (error) {
        alert('Action failed. Please try again.');
      }
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Permanently delete this order?')) {
      try {
        await deleteTransaction(id);
        setOrders(prev => prev.filter(order => order.id !== id));
      } catch (error) {
        alert('Failed to delete order.');
      }
    }
  };

  const handleReject = async (id) => {
    try {
      await updateTransactionStatus(id, 'completed');
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status: 'completed' } : order));
    } catch (error) {
      alert('Failed to reject request.');
    }
  };

  const calculateStats = () => {
    const today = new Date().toLocaleDateString();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
    
    const todayOrdersArr = orders.filter(order => {
      const orderDate = order.createdAt?.seconds 
        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() 
        : new Date(order.createdAt).toLocaleDateString();
      return orderDate === today;
    });
    
    const todayOrders = todayOrdersArr.length;
    const todayRevenue = todayOrdersArr.reduce((acc, curr) => acc + (curr.total || 0), 0);
    
    return { totalOrders, totalRevenue, todayOrders, todayRevenue };
  };

  const stats = calculateStats();

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Order History</h2>
        {orders.length > 0 && userRole === 'admin' && (
          <button 
            onClick={downloadCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '500' }}
          >
            <Download size={16} />
            Export CSV
          </button>
        )}
      </div>

      {userRole === 'admin' && orders.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Orders</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{stats.totalOrders}</p>
            </div>
          </div>

          <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Revenue</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{storeConfig.currencySymbol}{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Today's Orders</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{stats.todayOrders}</p>
            </div>
          </div>

          <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Today's Revenue</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{storeConfig.currencySymbol}{stats.todayRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '500' }}>Order #{order.id?.slice(-6) || 'Unknown'}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {order.createdAt?.seconds 
                      ? new Date(order.createdAt.seconds * 1000).toLocaleString() 
                      : new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>
                    {storeConfig.currencySymbol}{order.total?.toFixed(2)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                    {order.status === 'pending_deletion' && <AlertTriangle size={14} color="#f1c40f" />}
                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: order.status === 'pending_deletion' ? '#f1c40f' : 'var(--accent-success)',
                      fontWeight: order.status === 'pending_deletion' ? '600' : '400'
                    }}>
                      {order.status === 'pending_deletion' ? 'Deletion Requested' : (order.status || 'Completed')}
                    </p>
                  </div>
                  {order.createdBy && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Sold by: <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{order.createdBy}</span>
                    </p>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Items:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {order.items?.map((item, idx) => (
                      <span key={idx} style={{ background: 'var(--bg-card)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem' }}>
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {order.status === 'pending_deletion' && userRole === 'admin' ? (
                    <>
                      <button 
                        onClick={() => handleReject(order.id)}
                        className="glass"
                        style={{ padding: '8px', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                        title="Reject Request"
                      >
                        <X size={18} />
                      </button>
                      <button 
                        onClick={() => handleApprove(order.id)}
                        className="glass"
                        style={{ padding: '8px', color: 'var(--accent-success)', border: '1px solid var(--accent-success)', opacity: 0.8, borderRadius: 'var(--radius-sm)' }}
                        title="Approve Deletion"
                      >
                        <Check size={18} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleDelete(order.id)}
                      disabled={order.status === 'pending_deletion'}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: order.status === 'pending_deletion' ? 'var(--text-muted)' : 'var(--accent-danger)',
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: order.status === 'pending_deletion' ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        opacity: order.status === 'pending_deletion' ? 0.5 : 1
                      }}
                      onMouseOver={(e) => {
                        if (order.status !== 'pending_deletion') e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)';
                      }}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
