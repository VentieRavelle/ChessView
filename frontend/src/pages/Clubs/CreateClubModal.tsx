import React, { useState, useRef } from 'react';
import { supabase } from '@/supabaseClient';
import '@styles/clubs.scss';
import '@styles/dashboard.scss';

const CreateClubModal = ({ onClose, onSuccess }: any) => {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [banner, setBanner] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('club-assets')
      .upload(filePath, file);

    if (!uploadError) {
      const { data } = supabase.storage.from('club-assets').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (name.length < 3 || tag.length < 2) return alert("Please fill in the name and tag");
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.rpc('create_club_with_owner', {
      club_name: name.trim(),
      club_tag: tag.trim().toUpperCase(),
      club_icon: avatarUrl || 'https://via.placeholder.com/150',
      owner_id: user?.id,
      club_banner: banner.trim() || null
    });

    if (error) alert(error.message);
    else { onSuccess(); onClose(); }
    setLoading(false);
  };

  return (
    <div className="gamemodal-page">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content-premium club-create-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close-icon" onClick={onClose}>×</button>
          
          <div className="modal-header-clean">
            <h2>Create club</h2>
            <p>Create a unique community</p>
          </div>

          <div className="modal-body">
            <div className="club-card-preview">
              <div className="preview-banner" style={{ backgroundImage: banner ? `url(${banner})` : 'none' }}>
                <div className="preview-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                  {avatarUrl ? <img src={avatarUrl} alt="Lgo" /> : <div className="avatar-placeholder">+</div>}
                </div>
              </div>
              <div className="preview-info">
                <span className="p-tag">{tag ? `[${tag.toUpperCase()}]` : '[TAG]'}</span>
                <span className="p-name">{name || 'Club Name'}</span>
              </div>
            </div>

            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />

            <div className="input-row">
              <div className="input-group-premium">
                <label>Club Name</label>
                <input type="text" placeholder="For example: Royal Knights" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="input-group-premium short">
                <label>Tag</label>
                <input type="text" maxLength={4} placeholder="TAG" value={tag} onChange={e => setTag(e.target.value)} />
              </div>
            </div>

            <div className="input-group-premium">
              <label>Background Image URL</label>
              <input type="text" placeholder="https://..." value={banner} onChange={e => setBanner(e.target.value)} />
            </div>

            <button className="base-button primary full-width" onClick={handleCreate} disabled={loading}>
              {loading ? 'Loading...' : 'Create Club'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClubModal;