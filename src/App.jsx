import React, { useState } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Login from './components/Login';
import { mockProducts, mockCategories } from './data/mockProducts';
import { saveTransaction } from './firebase';
import { storeConfig } from './config';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kaapi_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [currentView, setCurrentView] = useState('pos');

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('kaapi_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kaapi_user');
    setCurrentView('pos');
  };

  const filteredProducts = mockProducts.filter((p) => 
    activeCategory === 'All' ? true : p.category === activeCategory
  );

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      setCartItems(prev => prev.filter(item => item.id !== id));
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotal * storeConfig.taxRate;
    const total = subtotal + taxAmount;

    const transactionData = {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      tax: taxAmount,
      total,
      status: "completed",
      createdBy: user.username
    };

    try {
      const transactionId = await saveTransaction(transactionData);
      alert(`Success! Transaction ID: ${transactionId}`);
      setCartItems([]); // Clear cart
      setActiveCategory('All');
    } catch (error) {
      alert('Checkout failed! Check console for details.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCieCheckout = async () => {
    if (cartItems.length === 0) {
      console.warn("CIE attempted with empty cart");
      return;
    }
    
    setIsCheckingOut(true);
    console.log("Starting CIE Checkout for items:", cartItems);

    const transactionData = {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal: 0,
      tax: 0,
      total: 0,
      status: "CIE",
      createdBy: user.username
    };

    console.log("CIE payload generated:", transactionData);

    try {
      const transactionId = await saveTransaction(transactionData);
      console.log("CIE Transaction saved successfully. ID:", transactionId);
      alert(`CIE Success! Transaction ID: ${transactionId}`);
      setCartItems([]);
      setActiveCategory('All');
    } catch (error) {
      console.error("CIE Transaction FAILED:", error);
      alert('CIE Checkout failed! Check the browser console for technical details.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="layout">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="main-content">
        {currentView === 'orders' ? (
          <Orders userRole={user.role} />
        ) : (
          <>
            <div className="pos-left">
              
              <div className="categories-scroll">
                {mockCategories.map((category) => (
                  <button
                    key={category}
                    className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="product-grid">
                {filteredProducts.map((product) => {
                  const cartItem = cartItems.find(item => item.id === product.id);
                  return (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      cartQuantity={cartItem?.quantity || 0} 
                      onAdd={addToCart} 
                    />
                  );
                })}
              </div>

            </div>
            
            <div className="pos-right">
              <Cart 
                cartItems={cartItems} 
                updateQuantity={updateQuantity} 
                clearCart={() => setCartItems([])} 
                checkout={handleCheckout}
                cieCheckout={handleCieCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
