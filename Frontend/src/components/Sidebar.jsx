import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CheckSquare, User, Settings, LogOut,
    ChevronLeft, ChevronRight, Sparkles, Menu, X,
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', path: '/dashboard/tasks' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    const isActive = (path) => {
        if (path === '/dashboard') return location.pathname === '/dashboard';
        return location.pathname.startsWith(path);
    };

    const SidebarContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }} />
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <h1 className="gradient-text" style={{ fontSize: '18px', fontWeight: 700 }}>TaskFlow</h1>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dashboard</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 12px' }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                                borderRadius: '12px', marginBottom: '4px', textDecoration: 'none', position: 'relative',
                                transition: 'all 0.2s ease',
                                background: active ? 'rgba(14, 165, 233, 0.08)' : 'transparent',
                                color: active ? 'var(--primary-600)' : 'var(--text-secondary)',
                                border: active ? '1px solid rgba(14, 165, 233, 0.2)' : '1px solid transparent',
                            }}
                        >
                            {active && (
                                <motion.div layoutId="activeIndicator" style={{
                                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                    width: '3px', height: '24px', borderRadius: '0 4px 4px 0', background: 'var(--primary-500)',
                                }} />
                            )}
                            <Icon size={20} style={{ flexShrink: 0 }} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                                        style={{ fontSize: '14px', fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* User + Logout */}
            <div style={{ padding: '12px', marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
                {!collapsed && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', marginBottom: '8px',
                        borderRadius: '12px', background: 'var(--surface-1)',
                    }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            fontSize: '14px', fontWeight: 700, background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white',
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'user@email.com'}</p>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 12px',
                    borderRadius: '12px', cursor: 'pointer', color: 'var(--danger)', background: 'transparent', border: 'none', transition: 'background 0.2s ease',
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                    <LogOut size={20} style={{ flexShrink: 0 }} />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: '14px', fontWeight: 500 }}>Logout</motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{
                position: 'fixed', top: '16px', left: '16px', zIndex: 50, padding: '8px', borderRadius: '12px',
                background: 'white', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', display: 'none',
            }} className="mobile-menu-btn">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0, 0, 0, 0.3)' }} />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50, width: '260px', background: 'white', borderRight: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                        <SidebarContent />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside animate={{ width: collapsed ? 72 : 260 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{ height: '100vh', position: 'sticky', top: 0, flexShrink: 0, background: 'white', borderRight: '1px solid var(--border-color)', overflow: 'visible', zIndex: 40 }}>
                <SidebarContent />
                <button onClick={() => setCollapsed(!collapsed)} style={{
                    position: 'absolute', right: '-12px', top: '32px', width: '24px', height: '24px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 50,
                    background: 'var(--primary-500)', border: '2px solid var(--bg-primary)', color: 'white',
                }}>
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>
            </motion.aside>
        </>
    );
};

export default Sidebar;
