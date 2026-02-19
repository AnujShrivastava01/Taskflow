import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield,
    Zap,
    BarChart3,
    Sparkles,
    Lock,
    Layers,
    Globe,
    ArrowRight,
} from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: 'Secure Authentication',
        description: 'Enterprise-grade JWT authentication with bcrypt password hashing and protected routes.',
        color: '#0ea5e9',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Built with React + Vite for blazing-fast performance. Optimized for productivity.',
        color: '#3b82f6',
    },
    {
        icon: BarChart3,
        title: 'Smart Dashboard',
        description: 'Real-time analytics and statistics. Track your tasks with beautiful visualizations.',
        color: '#10b981',
    },
    {
        icon: Layers,
        title: 'CRUD Operations',
        description: 'Full create, read, update, delete functionality with search, filter, and pagination.',
        color: '#6366f1',
    },
    {
        icon: Lock,
        title: 'Role-Based Access',
        description: 'Protected routes ensure only authenticated users can access the dashboard.',
        color: '#8b5cf6',
    },
    {
        icon: Globe,
        title: 'Scalable Architecture',
        description: 'MERN stack with modular code structure designed for easy scaling and maintenance.',
        color: '#06b6d4',
    },
];

const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Tasks Completed', value: '50K+' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'API Response', value: '<100ms' },
];

const Landing = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* ===== NAVIGATION ===== */}
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    padding: '16px 24px',
                    background: 'rgba(253, 248, 243, 0.9)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border-color)',
                }}
            >
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                        <img src="/logo.png" alt="TaskFlow" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                        <span className="gradient-text" style={{ fontSize: '20px', fontWeight: 700 }}>TaskFlow</span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link
                            to="/login"
                            className="btn-nav-responsive"
                            style={{
                                borderRadius: '12px',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                background: 'transparent',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#ee7b15';
                                e.currentTarget.style.color = '#de610b';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="btn-nav-responsive"
                            style={{
                                borderRadius: '12px',
                                fontWeight: 600,
                                color: 'white',
                                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.35)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section
                className="section-padding"
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                {/* Background Orbs */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    <div
                        style={{
                            position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
                            top: '10%', left: '5%', animation: 'float 8s ease-in-out infinite',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(219, 39, 119, 0.05) 0%, transparent 70%)',
                            bottom: '10%', right: '5%', animation: 'float 10s ease-in-out infinite reverse',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.04) 0%, transparent 70%)',
                            top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'float 6s ease-in-out infinite',
                        }}
                    />
                </div>

                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Badge */}
                        <div
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '8px 18px', borderRadius: '9999px', fontSize: '14px',
                                marginBottom: '32px',
                                background: 'rgba(14, 165, 233, 0.08)',
                                border: '1px solid rgba(14, 165, 233, 0.2)',
                                color: '#0ea5e9',
                            }}
                        >
                            <Sparkles size={14} />
                            <span>Built with MERN Stack</span>
                        </div>

                        <h1
                            className="text-responsive-h1"
                            style={{
                                fontWeight: 800,
                                marginBottom: '24px', lineHeight: 1.1,
                                fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)',
                            }}
                        >
                            Manage Tasks with{' '}
                            <span className="gradient-text">Elegance</span>
                            <br />
                            & <span className="gradient-text-warm">Efficiency</span>
                        </h1>

                        <p style={{ fontSize: '18px', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                            A full-stack dashboard application with secure authentication,
                            real-time analytics, and beautiful UI. Built for productivity.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                            <Link
                                to="/register"
                                className="btn-responsive"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    borderRadius: '14px', fontWeight: 600,
                                    color: 'white', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                                    boxShadow: '0 4px 20px rgba(14, 165, 233, 0.25)', textDecoration: 'none', transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(14, 165, 233, 0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                Start for Free <ArrowRight size={18} />
                            </Link>
                            <Link
                                to="/login"
                                className="btn-responsive"
                                style={{
                                    display: 'inline-flex', alignItems: 'center',
                                    borderRadius: '14px', fontWeight: 500,
                                    color: 'var(--text-secondary)', border: '1px solid var(--border-color)',
                                    background: 'white', textDecoration: 'none', transition: 'all 0.2s ease',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                            >
                                I have an account
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="section-padding">
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <h2 className="gradient-text" style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>Powerful Features</h2>
                        <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Everything you need to manage your workflow effectively</p>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                                    style={{
                                        padding: '32px', borderRadius: '20px',
                                        background: 'white', border: '1px solid var(--border-color)',
                                        boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease', cursor: 'default',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = feature.color + '40'; e.currentTarget.style.boxShadow = `0 8px 30px ${feature.color}12`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: feature.color + '12', color: feature.color }}>
                                        <Icon size={26} />
                                    </div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px', color: 'var(--text-primary)' }}>{feature.title}</h3>
                                    <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== STATS ===== */}
            <section className="section-padding">
                <div style={{
                    maxWidth: '100%', margin: '0 auto', borderRadius: '24px', padding: '32px 20px',
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.06), rgba(37, 99, 235, 0.03))',
                    border: '1px solid rgba(14, 165, 233, 0.15)',
                }}>
                    <div className="grid-stats" style={{ gap: '32px' }}>
                        {stats.map((stat, index) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} style={{ textAlign: 'center' }}>
                                <p className="gradient-text" style={{ fontSize: '36px', fontWeight: 700, marginBottom: '6px' }}>{stat.value}</p>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="section-padding">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 className="text-responsive-h2" style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
                        Ready to boost your <span className="gradient-text">productivity</span>?
                    </h2>
                    <p style={{ fontSize: '18px', marginBottom: '36px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Join thousands of users who trust TaskFlow for managing their daily workflow.
                    </p>
                    <Link
                        to="/register"
                        className="btn-responsive"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            borderRadius: '14px', fontWeight: 600,
                            color: 'white', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                            boxShadow: '0 4px 20px rgba(14, 165, 233, 0.25)', textDecoration: 'none', transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(14, 165, 233, 0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        Create Free Account <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    <span className="gradient-text" style={{ fontWeight: 600 }}>TaskFlow</span>
                </div>
                <p style={{ fontSize: '14px' }}>© {new Date().getFullYear()} TaskFlow. Built with MERN Stack.</p>
            </footer>
        </div>
    );
};

export default Landing;
