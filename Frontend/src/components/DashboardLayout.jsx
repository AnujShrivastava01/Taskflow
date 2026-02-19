import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { user } = useAuth();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
                {/* Header */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 30, padding: '16px 32px',
                    background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border-color)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1280px', margin: '0 auto' }}>
                        <div style={{ paddingLeft: '40px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</p>
                            </div>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px', fontWeight: 700,
                                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: 'white',
                                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
                            }}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </header>
                <main style={{ flex: 1, padding: '32px' }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
