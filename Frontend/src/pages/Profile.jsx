import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Edit3, Save, X, Calendar, Shield, Loader2, FileText } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '' });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!formData.name.trim()) e.name = 'Name is required';
        else if (formData.name.length < 2) e.name = 'Name must be at least 2 characters';
        if (!formData.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
        if (formData.bio.length > 250) e.bio = 'Bio cannot exceed 250 characters';
        setErrors(e); return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const { data } = await api.put('/auth/profile', formData);
            updateUser(data.data); setEditing(false); toast.success('Profile updated!');
        } catch (error) { toast.error(error.response?.data?.message || 'Failed to update profile'); }
        finally { setSaving(false); }
    };

    const handleCancel = () => {
        setFormData({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '' });
        setErrors({}); setEditing(false);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '768px', margin: '0 auto', paddingBottom: '40px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>Profile</h1>

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '32px', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '96px', height: '96px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 700, marginBottom: '16px',
                        background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', color: 'white', boxShadow: '0 0 30px rgba(14, 165, 233, 0.3)',
                    }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name || 'User'}</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{user?.email}</p>
                    {user?.bio && <p style={{ fontSize: '14px', marginTop: '8px', maxWidth: '400px', color: 'var(--text-muted)' }}>{user.bio}</p>}
                </div>

                {!editing ? (
                    <button onClick={() => setEditing(true)} style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                        background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#0ea5e9', transition: 'all 0.2s',
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)'}
                    >
                        <Edit3 size={16} /> Edit Profile
                    </button>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}><User size={14} /> Full Name</label>
                            <input type="text" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                                style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'var(--surface-2)', border: `1px solid ${errors.name ? 'var(--danger)' : 'var(--border-color)'}`, color: 'var(--text-primary)' }} />
                            {errors.name && <p style={{ fontSize: '12px', marginTop: '4px', color: 'var(--danger)' }}>{errors.name}</p>}
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}><Mail size={14} /> Email</label>
                            <input type="email" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                                style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'var(--surface-2)', border: `1px solid ${errors.email ? 'var(--danger)' : 'var(--border-color)'}`, color: 'var(--text-primary)' }} />
                            {errors.email && <p style={{ fontSize: '12px', marginTop: '4px', color: 'var(--danger)' }}>{errors.email}</p>}
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}><FileText size={14} /> Bio</label>
                            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself..." rows={3}
                                style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', outline: 'none', resize: 'none', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                            <p style={{ fontSize: '12px', textAlign: 'right', marginTop: '4px', color: formData.bio.length > 250 ? 'var(--danger)' : 'var(--text-muted)' }}>{formData.bio.length}/250</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleCancel} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}><X size={16} /> Cancel</button>
                            <button onClick={handleSave} disabled={saving} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: 'white', border: 'none', opacity: saving ? 0.8 : 1 }}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes</button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Account Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ padding: '24px', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <Shield size={18} style={{ color: '#0ea5e9' }} /> Account Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'var(--surface-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} style={{ color: 'var(--text-muted)' }} /><span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Member Since</span></div>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'var(--surface-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={14} style={{ color: 'var(--text-muted)' }} /><span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Account ID</span></div>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{user?._id?.slice(-8) || 'N/A'}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
export default Profile;
