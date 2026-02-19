import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, Save, AlertTriangle, Shield, Loader2, Key } from 'lucide-react';

const PasswordInput = ({ label, name, value, onChange, placeholder, error, showPassword, onToggle }) => (
    <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>{label}</label>
        <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: error ? 'var(--danger)' : 'var(--text-muted)' }} />
            <input type={showPassword ? 'text' : 'password'} name={name} value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: '100%', padding: '10px 48px 10px 44px', borderRadius: '12px', fontSize: '14px', outline: 'none',
                    background: 'var(--surface-2)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`, color: 'var(--text-primary)',
                }} />
            <button type="button" onClick={onToggle}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)', background: 'none', border: 'none' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
        {error && <p style={{ fontSize: '12px', marginTop: '4px', color: 'var(--danger)' }}>{error}</p>}
    </div>
);

const Settings = () => {
    const { logout } = useAuth();
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const validate = () => {
        const errs = {};
        if (!passwords.currentPassword) errs.currentPassword = 'Current password is required';
        if (!passwords.newPassword) errs.newPassword = 'New password is required';
        else if (passwords.newPassword.length < 6) errs.newPassword = 'Must be at least 6 characters';
        if (!passwords.confirmPassword) errs.confirmPassword = 'Please confirm your password';
        else if (passwords.newPassword !== passwords.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        if (passwords.currentPassword === passwords.newPassword && passwords.newPassword) errs.newPassword = 'New password must be different';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            const { data } = await api.put('/auth/password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
            if (data.token) localStorage.setItem('token', data.token);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('Password changed successfully!');
        } catch (error) { toast.error(error.response?.data?.message || 'Failed to change password'); }
        finally { setSaving(false); }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleToggle = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '768px', margin: '0 auto', paddingBottom: '40px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>Settings</h1>
            {/* Change Password */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '24px', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <Key size={18} style={{ color: 'var(--primary-400)' }} /> Change Password
                </h3>
                <p style={{ fontSize: '14px', marginBottom: '20px', color: 'var(--text-muted)' }}>Update your password to keep your account secure</p>
                <form onSubmit={handleChangePassword}>
                    <PasswordInput label="Current Password" name="currentPassword" value={passwords.currentPassword} onChange={handleChange} placeholder="Enter current password" error={errors.currentPassword} showPassword={showPasswords.current} onToggle={() => handleToggle('current')} />
                    <PasswordInput label="New Password" name="newPassword" value={passwords.newPassword} onChange={handleChange} placeholder="Min. 6 characters" error={errors.newPassword} showPassword={showPasswords.new} onToggle={() => handleToggle('new')} />
                    <PasswordInput label="Confirm New Password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} placeholder="Re-enter new password" error={errors.confirmPassword} showPassword={showPasswords.confirm} onToggle={() => handleToggle('confirm')} />
                    <button type="submit" disabled={saving} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '8px',
                        background: 'linear-gradient(135deg, var(--primary-600), var(--primary-500))', color: 'white', border: 'none', opacity: saving ? 0.8 : 1, transition: 'opacity 0.2s',
                    }}>
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Update Password
                    </button>
                </form>
            </motion.div>

            {/* Security Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ padding: '24px', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <Shield size={18} style={{ color: 'var(--success)' }} /> Security
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'var(--success-light)' }}>
                        <Shield size={16} style={{ color: 'var(--success)' }} /><p style={{ fontSize: '14px', color: 'var(--success)' }}>Your password is hashed with bcrypt (12 salt rounds)</p>
                    </div>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ padding: '24px', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
                    <AlertTriangle size={18} /> Danger Zone
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', background: 'var(--danger-light)' }}>
                    <div><p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Sign Out</p><p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sign out of your account on this device</p></div>
                    <button onClick={logout} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', background: 'var(--danger)', color: 'white', border: 'none' }}>Sign Out</button>
                </div>
            </motion.div>
        </div>
    );
};
export default Settings;
