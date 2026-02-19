import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated, navigate, from]);

    const validate = () => {
        const e = {};
        if (!formData.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Please enter a valid email';
        if (!formData.password) e.password = 'Password is required';
        else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        const result = await login(formData.email, formData.password);
        setIsLoading(false);
        if (result.success) navigate(from, { replace: true });
    };

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setFormData((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    };

    const inputStyle = (hasError) => ({
        width: '100%', paddingLeft: '44px', paddingRight: '48px', paddingTop: '14px', paddingBottom: '14px',
        borderRadius: '12px', fontSize: '14px', outline: 'none',
        background: 'var(--surface-2)', border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border-color)'}`,
        color: 'var(--text-primary)', transition: 'border-color 0.2s ease',
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', background: 'var(--bg-primary)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)', top: '0%', right: '10%', animation: 'float 8s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%)', bottom: '10%', left: '5%', animation: 'float 10s ease-in-out infinite reverse' }} />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '24px' }}>
                        <img src="/logo.png" alt="TaskFlow" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                        <span className="gradient-text" style={{ fontSize: '24px', fontWeight: 700 }}>TaskFlow</span>
                    </Link>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '16px', color: 'var(--text-primary)' }}>Welcome back</h2>
                    <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text-secondary)' }}>Sign in to your account to continue</p>
                </div>
                <div style={{ padding: '36px', borderRadius: '20px', background: 'white', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: errors.email ? 'var(--danger)' : 'var(--text-muted)' }} />
                                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle(errors.email)}
                                    onFocus={(e) => { if (!errors.email) e.target.style.borderColor = '#0ea5e9'; }}
                                    onBlur={(e) => { if (!errors.email) e.target.style.borderColor = 'var(--border-color)'; }} />
                            </div>
                            {errors.email && <p style={{ fontSize: '12px', marginTop: '6px', color: 'var(--danger)' }}>{errors.email}</p>}
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: errors.password ? 'var(--danger)' : 'var(--text-muted)' }} />
                                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" style={inputStyle(errors.password)}
                                    onFocus={(e) => { if (!errors.password) e.target.style.borderColor = '#0ea5e9'; }}
                                    onBlur={(e) => { if (!errors.password) e.target.style.borderColor = 'var(--border-color)'; }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)', background: 'none', border: 'none', padding: '4px' }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ fontSize: '12px', marginTop: '6px', color: 'var(--danger)' }}>{errors.password}</p>}
                        </div>
                        <button type="submit" disabled={isLoading} style={{
                            width: '100%', padding: '14px 0', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            background: isLoading ? '#0369a1' : 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                            color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.2)',
                            opacity: isLoading ? 0.8 : 1, transition: 'all 0.3s ease',
                        }}
                            onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.boxShadow = '0 6px 25px rgba(14, 165, 233, 0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {isLoading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '24px', color: 'var(--text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ fontWeight: 600, textDecoration: 'none', color: '#0ea5e9', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')} onMouseLeave={(e) => (e.currentTarget.style.color = '#0ea5e9')}>Create one</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
