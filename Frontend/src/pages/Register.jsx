import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Loader2, CheckCircle, XCircle,
} from 'lucide-react';

const inputStyle = (hasError) => ({
    width: '100%', paddingLeft: '44px', paddingRight: '48px', paddingTop: '14px', paddingBottom: '14px',
    borderRadius: '12px', fontSize: '14px', outline: 'none',
    background: 'var(--surface-2)', border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border-color)'}`,
    color: 'var(--text-primary)', transition: 'border-color 0.2s ease',
});

const InputField = ({ name, type, label, placeholder, icon: Icon, showToggle, isVisible, onToggle, value, onChange, error }) => (
    <div style={{ marginBottom: '20px' }}>
        <label htmlFor={name} style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>{label}</label>
        <div style={{ position: 'relative' }}>
            <Icon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: error ? 'var(--danger)' : 'var(--text-muted)' }} />
            <input
                id={name} type={showToggle ? (isVisible ? 'text' : 'password') : type}
                name={name} value={value} onChange={onChange} placeholder={placeholder}
                style={inputStyle(error)}
                onFocus={(e) => { if (!error) e.target.style.borderColor = '#0ea5e9'; }}
                onBlur={(e) => { if (!error) e.target.style.borderColor = 'var(--border-color)'; }}
            />
            {showToggle && (
                <button type="button" onClick={onToggle} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)', background: 'none', border: 'none', padding: '4px' }}>
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
        {error && <p style={{ fontSize: '12px', marginTop: '6px', color: 'var(--danger)' }}>{error}</p>}
    </div>
);

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { if (isAuthenticated) navigate('/dashboard', { replace: true }); }, [isAuthenticated, navigate]);

    const getPasswordStrength = (password) => {
        let s = 0;
        if (password.length >= 6) s++;
        if (password.length >= 10) s++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s++;
        if (/\d/.test(password)) s++;
        if (/[^a-zA-Z0-9]/.test(password)) s++;
        return Math.min(s, 4);
    };

    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['', '#dc2626', '#d97706', '#2563eb', '#16a34a'];
    const passwordStrength = getPasswordStrength(formData.password);

    const validate = () => {
        const e = {};
        if (!formData.name.trim()) e.name = 'Name is required';
        else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
        if (!formData.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Please enter a valid email';
        if (!formData.password) e.password = 'Password is required';
        else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
        if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        const result = await register(formData.name, formData.email, formData.password);
        setIsLoading(false);
        if (result.success) navigate('/dashboard', { replace: true });
    };

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setFormData((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    };



    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', background: 'var(--bg-primary)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)', top: '5%', left: '10%', animation: 'float 8s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.04) 0%, transparent 70%)', bottom: '10%', right: '5%', animation: 'float 10s ease-in-out infinite reverse' }} />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '24px' }}>
                        <img src="/logo.png" alt="TaskFlow" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                        <span className="gradient-text" style={{ fontSize: '24px', fontWeight: 700 }}>TaskFlow</span>
                    </Link>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '16px', color: 'var(--text-primary)' }}>Create your account</h2>
                    <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text-secondary)' }}>Start managing your tasks today</p>
                </div>
                <div style={{ padding: '36px', borderRadius: '20px', background: 'white', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                    <form onSubmit={handleSubmit}>
                        <InputField name="name" type="text" label="Full Name" placeholder="John Doe" icon={User} value={formData.name} onChange={handleChange} error={errors.name} />
                        <InputField name="email" type="email" label="Email Address" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleChange} error={errors.email} />
                        <InputField name="password" type="password" label="Password" placeholder="Min. 6 characters" icon={Lock} showToggle isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} value={formData.password} onChange={handleChange} error={errors.password} />
                        {formData.password && (
                            <div style={{ marginTop: '-10px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[1, 2, 3, 4].map((l) => (<div key={l} style={{ height: '4px', flex: 1, borderRadius: '999px', transition: 'all 0.3s ease', background: passwordStrength >= l ? strengthColors[passwordStrength] : 'var(--surface-2)' }} />))}
                                </div>
                                <p style={{ fontSize: '12px', marginTop: '6px', color: strengthColors[passwordStrength] }}>{strengthLabels[passwordStrength]}</p>
                            </div>
                        )}
                        <InputField name="confirmPassword" type="password" label="Confirm Password" placeholder="Re-enter password" icon={Lock} showToggle isVisible={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                        {formData.confirmPassword && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '-10px', marginBottom: '16px' }}>
                                {formData.password === formData.confirmPassword
                                    ? <><CheckCircle size={14} style={{ color: 'var(--success)' }} /><span style={{ fontSize: '12px', color: 'var(--success)' }}>Passwords match</span></>
                                    : <><XCircle size={14} style={{ color: 'var(--danger)' }} /><span style={{ fontSize: '12px', color: 'var(--danger)' }}>Passwords don't match</span></>}
                            </div>
                        )}
                        <button type="submit" disabled={isLoading} style={{
                            width: '100%', padding: '14px 0', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '8px',
                            background: isLoading ? '#0369a1' : 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                            color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.2)',
                            opacity: isLoading ? 0.8 : 1, transition: 'all 0.3s ease',
                        }}
                            onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.boxShadow = '0 6px 25px rgba(14, 165, 233, 0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {isLoading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={18} /></>}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '24px', color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ fontWeight: 600, textDecoration: 'none', color: '#0ea5e9', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')} onMouseLeave={(e) => (e.currentTarget.style.color = '#0ea5e9')}>Sign in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
