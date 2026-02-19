import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import '@styles/shop.scss'; 
import '@/App.css';
import '@/index.css';
import Loader from '@components/Loader';

const ICONS = {
  Return: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  Cart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  )
};
 const SHOP_ITEMS = [
  { 
    id: 1, name: 'Noods n1', category: 'Boards', price: 1500, rarity: 'Legendary', 
    img: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=300&h=300&fit=crop' 
  },
  { 
    id: 2, name: 'Noods n2', category: 'Boards', price: 800, rarity: 'Epic', 
    img: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=300&h=300&fit=crop' 
  },
  { 
    id: 3, name: 'Noods n3', category: 'Avatars', price: 2500, rarity: 'Exotic', 
    img: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=300&h=300&fit=crop' 
  },
  { 
    id: 4, name: 'Noods n4', category: 'Avatars', price: 1200, rarity: 'Legendary', 
    img: 'https://images.unsplash.com/photo-1523398003113-cd264a1d31d5?q=80&w=300&h=300&fit=crop' 
  },
  { 
    id: 5, name: 'Noods n5', category: 'Effects', price: 450, rarity: 'Rare', 
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=300&h=300&fit=crop' 
  },
  { 
    id: 6, name: 'Noods n6', category: 'Effects', price: 300, rarity: 'Common', 
    img: 'https://images.unsplash.com/photo-1634117622592-114e3024ff27?q=80&w=300&h=300&fit=crop' 
  },
  { 
    id: 7, name: 'Noods n7', category: 'Badges', price: 600, rarity: 'Rare', 
    img: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=300&h=300&fit=crop' 
  },
  { 
    id: 8, name: 'Noods n8', category: 'Badges', price: 5000, rarity: 'Exotic', 
    img: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=300&h=300&fit=crop' 
  }
];
const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return navigate('/login');
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    setProfile(data || { username: 'User', credits: 0 });
    setLoading(false);
  }, [navigate]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const filteredItems = useMemo(() => {
    return activeCategory === 'All' 
      ? SHOP_ITEMS 
      : SHOP_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  if (loading) return <Loader />;

  const categories = ['All', 'Boards', 'Avatars', 'Effects', 'Badges'];

  return (
    <div className="shop-page">
    <div className="db-shell shop-shell l-on r-on">
      <aside className="side-panel left-panel">
        <div className="panel-content">
          <button className="return-btn" onClick={() => navigate('/dashboard')}>
            <ICONS.Return />
            <span>Return</span>
          </button>

          <div className="shop-header-minimal">
             <span className="shop-title-main">Market</span>
          </div>

          <nav className="nav-grid-minimal">
            {categories.map((cat) => (
              <button 
                key={cat} 
                className={`nav-tile ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span className="tile-label">{cat}</span>
              </button>
            ))}
          </nav>

          <div className="shop-balance-footer">
            <div className="balance-card">
              <span className="label">Available Balance</span>
              <span className="value">{profile?.credits?.toLocaleString() || 0} CR</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="viewport">
        <header className="shop-top-bar">
          <h1 className="cyber-title">{activeCategory} Items</h1>
          <div className="shop-stats">
            <span className="stat-item">{filteredItems.length} Products Found</span>
          </div>
        </header>

        <div className="shop-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className={`shop-card rarity-${item.rarity.toLowerCase()}`}>
              <div className="item-image-box">
                <img src={item.img} alt={item.name} loading="lazy" />
                <div className="rarity-tag">{item.rarity}</div>
              </div>
<div className="item-info">
  <div className="item-meta">
    <span className="item-category">{item.category}</span>
    <span className="item-name">{item.name}</span>
  </div>
  <button className="buy-button">
    <span className="price-val">{item.price.toLocaleString()}</span>
    <span className="currency">CR</span>
  </button>
</div>
            </div>
          ))}
        </div>
      </main>

      <aside className="side-panel right-panel">
        <div className="panel-content">
          <div className="cart-header">
            <ICONS.Cart />
            <span>Card</span>
          </div>
          
          <div className="cart-body">
            <div className="empty-state-visual">
               <div className="empty-icon">∅</div>
               <p className="empty-msg">No items selected</p>
            </div>
          </div>

          <div className="cart-footer">
            <div className="total-row">
                <span>Total Cost</span>
                <span>0 CR</span>
            </div>
            <button className="checkout-btn" disabled>Purchase</button>
          </div>
        </div>
      </aside>
    </div>
    </div>
  );
};

export default Shop;