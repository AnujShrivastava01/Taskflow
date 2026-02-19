import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import {
    CheckSquare, Clock, Loader, CheckCircle, AlertTriangle,
    TrendingUp, Plus, ArrowRight, Calendar, Target, Zap, BarChart3,
} from 'lucide-react';

const DashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchDashboardData(); }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, tasksRes] = await Promise.all([
                api.get('/tasks/stats'),
                api.get('/tasks?limit=5&sort=-createdAt'),
            ]);
            setStats(statsRes.data.data);
            setRecentTasks(tasksRes.data.data);
        } catch (error) { console.error('Failed to fetch dashboard data:', error); }
        finally { setLoading(false); }
    };

    const statCards = [
        { label: 'Total Tasks', value: stats?.total || 0, icon: CheckSquare, color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)', gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(14, 165, 233, 0.02))' },
        { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', gradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(217, 119, 6, 0.02))' },
        { label: 'In Progress', value: stats?.inProgress || 0, icon: Loader, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)', gradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.02))' },
        { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle, color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)', gradient: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(22, 163, 74, 0.02))' },
    ];

    const priorityCards = [
        { label: 'High Priority', value: stats?.highPriority || 0, color: '#dc2626', icon: AlertTriangle },
        { label: 'Medium Priority', value: stats?.mediumPriority || 0, color: '#d97706', icon: Target },
        { label: 'Low Priority', value: stats?.lowPriority || 0, color: '#16a34a', icon: Zap },
    ];

    const getStatusStyle = (status) => {
        const s = { pending: { bg: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }, 'in-progress': { bg: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }, completed: { bg: 'rgba(22, 163, 74, 0.1)', color: '#16a34a' } };
        return s[status] || s.pending;
    };

    const getPriorityStyle = (priority) => {
        const s = { high: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }, medium: { bg: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }, low: { bg: 'rgba(22, 163, 74, 0.1)', color: '#16a34a' } };
        return s[priority] || s.medium;
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid rgba(14, 165, 233,0.2)', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                            style={{
                                padding: '24px', borderRadius: '16px', background: 'white', border: '1px solid var(--border-color)',
                                boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease', cursor: 'default',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = card.color + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 25px ${card.color}12`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: card.bg, color: card.color }}>
                                    <Icon size={22} />
                                </div>
                            </div>
                            <p style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{card.value}</p>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{card.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Priority + Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ padding: '28px', borderRadius: '16px', background: 'white', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart3 size={20} style={{ color: '#0ea5e9' }} /> Priority Distribution
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {priorityCards.map((card) => {
                            const Icon = card.icon;
                            const pct = stats?.total ? Math.round((card.value / stats.total) * 100) : 0;
                            return (
                                <div key={card.label} style={{ padding: '20px', borderRadius: '14px', textAlign: 'center', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                                    <Icon size={24} style={{ color: card.color, margin: '0 auto 10px' }} />
                                    <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{card.value}</p>
                                    <p style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-muted)' }}>{card.label}</p>
                                    <div style={{ marginTop: '12px', height: '6px', borderRadius: '999px', background: 'var(--surface-2)' }}>
                                        <div style={{ height: '100%', borderRadius: '999px', width: `${pct}%`, background: card.color, transition: 'width 0.5s ease' }} />
                                    </div>
                                    <p style={{ fontSize: '12px', marginTop: '6px', color: card.color }}>{pct}%</p>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                        <div style={{ padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--danger-light)', border: '1px solid rgba(220, 38, 38, 0.15)' }}>
                            <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />
                            <div><p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--danger)' }}>{stats?.overdue || 0}</p><p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Overdue Tasks</p></div>
                        </div>
                        <div style={{ padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--info-light)', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
                            <Calendar size={20} style={{ color: 'var(--info)' }} />
                            <div><p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--info)' }}>{stats?.dueToday || 0}</p><p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Due Today</p></div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ padding: '28px', borderRadius: '16px', background: 'white', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={20} style={{ color: '#0ea5e9' }} /> Quick Actions
                    </h3>
                    <Link to="/dashboard/tasks" style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '14px',
                        textDecoration: 'none', marginBottom: '12px', transition: 'all 0.2s ease',
                        background: 'rgba(14, 165, 233, 0.06)', border: '1px solid rgba(14, 165, 233, 0.15)',
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14, 165, 233, 0.12)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(14, 165, 233, 0.06)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14, 165, 233, 0.12)', color: '#0ea5e9' }}><Plus size={18} /></div>
                        <div style={{ flex: 1 }}><p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Create New Task</p><p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Add a new task to your list</p></div>
                        <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </Link>
                    <Link to="/dashboard/profile" style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '14px',
                        textDecoration: 'none', marginBottom: '16px', transition: 'all 0.2s ease',
                        background: 'rgba(22, 163, 74, 0.06)', border: '1px solid rgba(22, 163, 74, 0.15)',
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(22, 163, 74, 0.12)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(22, 163, 74, 0.06)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a' }}><TrendingUp size={18} /></div>
                        <div style={{ flex: 1 }}><p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>View Profile</p><p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage your account</p></div>
                        <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </Link>
                    <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Completion Rate</p>
                        <p className="gradient-text" style={{ fontSize: '32px', fontWeight: 700 }}>{stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
                        <div style={{ marginTop: '10px', height: '8px', borderRadius: '999px', background: 'var(--surface-2)' }}>
                            <div style={{ height: '100%', borderRadius: '999px', transition: 'width 0.7s ease', width: `${stats?.total ? (stats.completed / stats.total) * 100 : 0}%`, background: 'linear-gradient(90deg, #0ea5e9, #16a34a)' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Tasks */}
            <div style={{ padding: '28px', borderRadius: '16px', background: 'white', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={20} style={{ color: '#0ea5e9' }} /> Recent Tasks
                    </h3>
                    <Link to="/dashboard/tasks" style={{ fontSize: '14px', fontWeight: 500, textDecoration: 'none', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#0ea5e9')} onMouseLeave={(e) => (e.currentTarget.style.color = '#0284c7')}>
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                {recentTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <CheckSquare size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No tasks yet. <Link to="/dashboard/tasks" style={{ textDecoration: 'none', color: '#0ea5e9' }}>Create your first task</Link></p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                            <thead><tr>
                                {['Task', 'Status', 'Priority', 'Due Date'].map((h) => (
                                    <th key={h} style={{ textAlign: 'left', fontSize: '12px', fontWeight: 500, padding: '8px 16px', color: 'var(--text-muted)' }}>{h}</th>
                                ))}
                            </tr></thead>
                            <tbody>
                                {recentTasks.map((task) => {
                                    const ss = getStatusStyle(task.status);
                                    const ps = getPriorityStyle(task.priority);
                                    return (
                                        <tr key={task._id} style={{ background: 'var(--bg-primary)', transition: 'background 0.2s ease' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-primary)')}>
                                            <td style={{ padding: '12px 16px', borderRadius: '12px 0 0 12px' }}>
                                                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</p>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, textTransform: 'capitalize', background: ss.bg, color: ss.color }}>{task.status}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, textTransform: 'capitalize', background: ps.bg, color: ps.color }}>{task.priority}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', borderRadius: '0 12px 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;
