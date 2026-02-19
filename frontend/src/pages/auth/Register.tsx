import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { MoreHorizontal, MessageSquare, Github, Facebook, Twitch, Twitter, Apple } from 'lucide-react';
import '@styles/Register.scss';

const GoogleIcon = () => (
  <svg width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#00ac47"/>
    <path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#4285f4"/>
    <path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffba00"/>
    <path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ea4435"/>
    <path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4"/>
  </svg>
);
const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#536dfe" d="M39.248,10.177c-2.804-1.287-5.812-2.235-8.956-2.778c-0.057-0.01-0.114,0.016-0.144,0.068	c-0.387,0.688-0.815,1.585-1.115,2.291c-3.382-0.506-6.747-0.506-10.059,0c-0.3-0.721-0.744-1.603-1.133-2.291	c-0.03-0.051-0.087-0.077-0.144-0.068c-3.143,0.541-6.15,1.489-8.956,2.778c-0.024,0.01-0.045,0.028-0.059,0.051	c-5.704,8.522-7.267,16.835-6.5,25.044c0.003,0.04,0.026,0.079,0.057,0.103c3.763,2.764,7.409,4.442,10.987,5.554	c0.057,0.017,0.118-0.003,0.154-0.051c0.846-1.156,1.601-2.374,2.248-3.656c0.038-0.075,0.002-0.164-0.076-0.194	c-1.197-0.454-2.336-1.007-3.432-1.636c-0.087-0.051-0.094-0.175-0.014-0.234c0.231-0.173,0.461-0.353,0.682-0.534	c0.04-0.033,0.095-0.04,0.142-0.019c7.201,3.288,14.997,3.288,22.113,0c0.047-0.023,0.102-0.016,0.144,0.017	c0.22,0.182,0.451,0.363,0.683,0.536c0.08,0.059,0.075,0.183-0.012,0.234c-1.096,0.641-2.236,1.182-3.434,1.634	c-0.078,0.03-0.113,0.12-0.075,0.196c0.661,1.28,1.415,2.498,2.246,3.654c0.035,0.049,0.097,0.07,0.154,0.052	c3.595-1.112,7.241-2.79,11.004-5.554c0.033-0.024,0.054-0.061,0.057-0.101c0.917-9.491-1.537-17.735-6.505-25.044	C39.293,10.205,39.272,10.187,39.248,10.177z M16.703,30.273c-2.168,0-3.954-1.99-3.954-4.435s1.752-4.435,3.954-4.435	c2.22,0,3.989,2.008,3.954,4.435C20.658,28.282,18.906,30.273,16.703,30.273z M31.324,30.273c-2.168,0-3.954-1.99-3.954-4.435	s1.752-4.435,3.954-4.435c2.22,0,3.989,2.008,3.954,4.435C35.278,28.282,33.544,30.273,31.324,30.273z"></path>
</svg>
);
const GithubIcon = () => (
  <svg fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
    <path d="M1821.63 637.76c0-130.027-43.627-236.373-116.054-319.68 11.627-30.187 50.347-151.36-11.2-315.307 0 0-94.72-32-310.4 122.134-90.133-26.454-186.773-39.68-282.773-40.107-96 .427-192.64 13.653-282.667 40.107C602.749-29.227 507.923 2.773 507.923 2.773c-61.547 163.947-22.72 285.12-11.094 315.307-72.32 83.307-116.266 189.653-116.266 319.68 0 456.533 263.68 558.72 514.453 588.8 0 0-180.267 111.68-180.267 299.413-64.32 30.507-336.533 123.947-437.333-58.133 0 0-59.627-114.347-173.013-122.773 0 0-110.294-1.494-7.787 72.426 0 0 74.027 36.694 125.44 174.294 0 0 57.173 289.92 489.067 159.68 4.373 2.24 1.6 140.266 1.6 168.533h777.173s1.28-277.013 1.28-365.12c0-216.64-144.64-292.48-185.28-329.28 251.627-29.44 515.733-130.133 515.733-587.84" fill-rule="evenodd"/>
</svg>
);
const FacebookIcon = () => (
  <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="#3B5998" fill-rule="evenodd" d="M9.94474914,22 L9.94474914,13.1657526 L7,13.1657526 L7,9.48481614 L9.94474914,9.48481614 L9.94474914,6.54006699 C9.94474914,3.49740494 11.8713513,2 14.5856738,2 C15.8857805,2 17.0033128,2.09717672 17.3287076,2.13987558 L17.3287076,5.32020466 L15.4462767,5.32094085 C13.9702212,5.32094085 13.6256856,6.02252733 13.6256856,7.05171716 L13.6256856,9.48481614 L17.306622,9.48481614 L16.5704347,13.1657526 L13.6256856,13.1657526 L13.6845806,22"/>
</svg>
);
const TwitchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#7e57c2" d="M42,27.676c-3,3.441-6,6.882-9,10.324c-2.333,0-4.667,0-7,0c-2.333,2-4.667,4-7,6c-1,0-2,0-3,0	c0-2,0-4,0-6c-3.333,0-6.667,0-10,0c0-7.431,0-14.863,0-22.294C7.455,12.804,8.909,9.902,10.364,7C20.909,7,31.455,7,42,7	C42,13.892,42,20.784,42,27.676z"></path><path fill="#fafafa" d="M39,26.369c-1.667,1.877-3.333,3.754-5,5.631c-2.333,0-4.667,0-7,0c-2.333,2-4.667,4-7,6c0-2,0-4,0-6	c-2.667-0.008-5.333-0.016-8-0.024c0-7.326,0-14.651,0-21.976c9,0,18,0,27,0C39,15.456,39,20.912,39,26.369z"></path><rect width="3" height="10" x="21" y="16" fill="#7e57c2"></rect><rect width="3" height="10" x="30" y="16" fill="#7e57c2"></rect>
</svg>
);
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#03A9F4" d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"></path>
</svg>
);
const AppleIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
<path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
</svg>
);
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isOauthModalOpen, setIsOauthModalOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/dashboard', { replace: true });
    };
    checkSession();
  }, [navigate]);

  const validation = useMemo(() => {
    const emailPrefix = email.split('@')[0].toLowerCase();
    const hasEmailPart = emailPrefix.length > 2 && password.toLowerCase().includes(emailPrefix);
    return {
      hasLength: password.length >= 10,
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: (password.match(/[^A-Za-z0-9]/g) || []).length >= 2,
      hasEmailPart: hasEmailPart,
      isValid: password.length >= 10 && /[A-Z]/.test(password) && 
               (password.match(/[^A-Za-z0-9]/g) || []).length >= 2 && !hasEmailPart
    };
  }, [password, email]);

  const getStrengthLevel = () => {
    if (!password) return 0;
    if (validation.hasEmailPart) return -1;
    let score = 0;
    if (validation.hasLength) score++;
    if (validation.hasUpper) score++;
    if (validation.hasSpecial) score++;
    return score === 3 ? 4 : score;
  };

  const handleOAuth = async (provider: any) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` }
      });
      if (signUpError) throw signUpError;
      if (data.user && data.session) navigate('/dashboard');
      else setIsSent(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };
const extraProviders = [
  { id: 'github', name: 'GitHub', icon: <GithubIcon />, class: 'github' },
  { id: 'facebook', name: 'Facebook', icon: <FacebookIcon />, class: 'facebook' },
  { id: 'twitch', name: 'Twitch', icon: <TwitchIcon />, class: 'twitch' },
  { id: 'twitter', name: 'Twitter', icon: <TwitterIcon />, class: 'twitter' },
  { id: 'apple', name: 'Apple', icon: <AppleIcon />, class: 'apple' }
];

  return (
    <div className='register-page'>
      <div className="auth-page">
        <div className="auth-visual">
          <div className="orbits-container">
            <div className="orbit orbit-1"></div><div className="orbit orbit-2"></div><div className="orbit orbit-3"></div>
            <div className="planet p-1"></div><div className="planet p-2"></div><div className="planet p-3"></div>
          </div>
          <div className="visual-content">
            <div className="logo-auth">Chess<span className="accent">View</span></div>
            <h1>Mastery begins <br/> with the first move</h1>
            <p>Create an account and join the global chess community.</p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-card">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Fill in the details to create your profile</p>
            </div>

            <div className="oauth-section">
              <div className="oauth-grid">
                <button className="oauth-btn google" onClick={() => handleOAuth('google')}>
                  <GoogleIcon /> <span>Google</span>
                </button>
                <button className="oauth-btn discord" onClick={() => handleOAuth('discord')}>
                  <DiscordIcon /> <span>Discord</span>
                </button>
              </div>
              <button className="show-more-btn" onClick={() => setIsOauthModalOpen(true)}>
                <MoreHorizontal size={18} /> More options
              </button>
            </div>

            <div className="divider"><span>OR</span></div>

            {isSent ? (
              <div className="success-message">
                <h3>📩 Check your email!</h3>
                <p>We sent a confirmation link to <b>{email}</b>.</p>
                <button className="submit-btn" onClick={() => navigate('/login')}>Go to login</button>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                {error && <div className="error-box">{error}</div>}
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mail@example.com" required disabled={loading} />
                </div>

                <div className="input-group">
                  <label>Imagine password</label>
                  <div className="password-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className={validation.hasEmailPart ? 'input-error' : ''}
                      placeholder="At least 10 characters" required disabled={loading}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="strength-bar">
                    <div className={`bar-segment ${getStrengthLevel() !== 0 ? 'active' : ''} ${getStrengthLevel() === -1 ? 'warning' : ''}`}></div>
                    <div className={`bar-segment ${getStrengthLevel() >= 2 ? 'active' : ''}`}></div>
                    <div className={`bar-segment ${getStrengthLevel() >= 3 ? 'active' : ''}`}></div>
                    <div className={`bar-segment ${getStrengthLevel() >= 4 ? 'active' : ''}`}></div>
                  </div>
                  <ul className="password-hints">
                    <li className={validation.hasLength ? 'valid' : ''}>At least 10 characters</li>
                    <li className={validation.hasUpper ? 'valid' : ''}>One uppercase letter</li>
                    <li className={validation.hasSpecial ? 'valid' : ''}>2 special characters</li>
                    {validation.hasEmailPart && <li className="invalid">Email name cannot be used</li>}
                  </ul>
                </div>

                <button type="submit" className="submit-btn" disabled={!validation.isValid || loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            )}

            {!isSent && (
              <div className="form-footer">
                Already have an account? <Link to="/login">Log in</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOauthModalOpen && (
        <div className="oauth-modal-overlay" onClick={() => setIsOauthModalOpen(false)}>
          <div className="oauth-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Other Methods</h3>
              <button className="close-btn" onClick={() => setIsOauthModalOpen(false)}>&times;</button>
            </div>
            <div className="oauth-modal-grid">
              {extraProviders.map(p => (
                <button key={p.id} className={`oauth-btn ${p.class}`} onClick={() => handleOAuth(p.id)}>
                  {p.icon} <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;