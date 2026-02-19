import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import '@styles/NotFoundModal.scss'; 
const NotFoundModal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="NotFoundModal-page">
      <div className="modal-overlay" onClick={() => navigate('/dashboard')}>
        <div className="modal-content-premium" onClick={e => e.stopPropagation()}>
          <header className="modal-header-clean" style={{ textAlign: 'center' }}>
            <div style={{ color: '#ef4444', marginBottom: '20px' }}>
              <AlertCircle size={80} strokeWidth={1} />
            </div>
            <h2 style={{ fontSize: '42px', marginBottom: '10px' }}>404</h2>
            <p>Oops! The page you are looking for does not exist.</p>
          </header>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <button className="modern-cancel-btn" onClick={() => navigate('/dashboard')}>
          <span className="btn-text">To dashboard</span>
        </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundModal;