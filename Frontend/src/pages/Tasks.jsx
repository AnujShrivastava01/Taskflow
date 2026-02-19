import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    Plus, Search, Filter, Edit3, Trash2, X, CheckCircle, Clock, Loader,
    AlertTriangle, Calendar, Tag, ChevronLeft, ChevronRight, Loader2, SlidersHorizontal,
} from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', tags: '' });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [deleteTask, setDeleteTask] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchTasks = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.set('page', page); params.set('limit', '10');
            if (search) params.set('search', search);
            if (statusFilter) params.set('status', statusFilter);
            if (priorityFilter) params.set('priority', priorityFilter);
            params.set('sort', '-createdAt');
            const { data } = await api.get(`/tasks?${params.toString()}`);
            setTasks(data.data); setPagination(data.pagination);
        } catch (error) { toast.error('Failed to fetch tasks'); }
        finally { setLoading(false); }
    }, [search, statusFilter, priorityFilter]);

    useEffect(() => { const timer = setTimeout(() => fetchTasks(1), 300); return () => clearTimeout(timer); }, [fetchTasks]);

    const validateForm = () => {
        const e = {};
        if (!formData.title.trim()) e.title = 'Title is required';
        else if (formData.title.length > 100) e.title = 'Title too long (max 100 chars)';
        if (formData.description.length > 500) e.description = 'Description too long (max 500 chars)';
        setFormErrors(e); return Object.keys(e).length === 0;
    };

    const openCreateModal = () => { setEditingTask(null); setFormData({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', tags: '' }); setFormErrors({}); setShowModal(true); };
    const openEditModal = (task) => { setEditingTask(task); setFormData({ title: task.title, description: task.description || '', status: task.status, priority: task.priority, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', tags: task.tags?.join(', ') || '' }); setFormErrors({}); setShowModal(true); };

    const handleSubmit = async (e) => {
        e.preventDefault(); if (!validateForm()) return;
        setSubmitting(true);
        try {
            const payload = { title: formData.title.trim(), description: formData.description.trim(), status: formData.status, priority: formData.priority, dueDate: formData.dueDate || null, tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
            if (editingTask) { await api.put(`/tasks/${editingTask._id}`, payload); toast.success('Task updated!'); }
            else { await api.post('/tasks', payload); toast.success('Task created!'); }
            setShowModal(false); fetchTasks(editingTask ? pagination.current : 1);
        } catch (error) { toast.error(error.response?.data?.message || 'Something went wrong'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!deleteTask) return;
        setDeleting(true);
        try { await api.delete(`/tasks/${deleteTask._id}`); toast.success('Task deleted'); setDeleteTask(null); fetchTasks(pagination.current); }
        catch (error) { toast.error('Failed to delete task'); } finally { setDeleting(false); }
    };

    const toggleStatus = async (task) => {
        const next = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
        try { await api.put(`/tasks/${task._id}`, { status: next[task.status] }); fetchTasks(pagination.current); toast.success(`Status: ${next[task.status]}`); }
        catch (error) { toast.error('Failed to update status'); }
    };

    const getStatusStyle = (s) => ({
        pending: { bg: 'rgba(217, 119, 6, 0.1)', color: '#d97706', icon: Clock },
        'in-progress': { bg: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', icon: Loader },
        completed: { bg: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', icon: CheckCircle },
    }[s] || { bg: 'rgba(217, 119, 6, 0.1)', color: '#d97706', icon: Clock });

    const getPriorityStyle = (p) => ({
        high: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' },
        medium: { bg: 'rgba(217, 119, 6, 0.1)', color: '#d97706' },
        low: { bg: 'rgba(22, 163, 74, 0.1)', color: '#16a34a' },
    }[p] || { bg: 'rgba(217, 119, 6, 0.1)', color: '#d97706' });

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Tasks</h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{pagination.total} task{pagination.total !== 1 ? 's' : ''} total</p>
                </div>
                <button onClick={openCreateModal} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px', px: '20px', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.2)', transition: 'all 0.2s',
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <Plus size={18} /> New Task
                </button>
            </div>

            {/* Filters */}
            <div style={{ padding: '16px', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..."
                            style={{ width: '100%', padding: '10px 16px 10px 44px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                            onFocus={(e) => e.target.style.borderColor = '#0ea5e9'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', cursor: 'pointer',
                        background: showFilters ? 'rgba(14, 165, 233, 0.1)' : 'var(--surface-2)', border: `1px solid ${showFilters ? 'rgba(14, 165, 233, 0.3)' : 'var(--border-color)'}`,
                        color: showFilters ? '#0ea5e9' : 'var(--text-secondary)',
                    }}>
                        <SlidersHorizontal size={16} /> Filters
                    </button>
                </div>
                <AnimatePresence>
                    {showFilters && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '16px', marginTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: 'var(--text-muted)' }}>Status</label>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                                        <option value="">All Status</option><option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: 'var(--text-muted)' }}>Priority</label>
                                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                                        <option value="">All Priority</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                                    </select>
                                </div>
                                {(search || statusFilter || priorityFilter) && (
                                    <button onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); }} style={{ alignSelf: 'flex-end', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', background: 'var(--danger-light)', color: 'var(--danger)', border: 'none' }}>
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Task List */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ padding: '20px', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-color)', height: '100px' }} className="animate-pulse" />
                    ))}
                </div>
            ) : tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                        <CheckCircle size={32} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>No tasks found</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Try adjusting your filters or create a new task</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tasks.map((task, index) => {
                        const ss = getStatusStyle(task.status);
                        const ps = getPriorityStyle(task.priority);
                        const StatusIcon = ss.icon;
                        return (
                            <motion.div key={task._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                                style={{ padding: '20px', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-color)', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <button onClick={() => toggleStatus(task)} title="Change Status" style={{ marginTop: '2px', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', background: ss.bg, color: ss.color }}>
                                        <StatusIcon size={16} />
                                    </button>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: task.status === 'completed' ? 'line-through' : 'none', opacity: task.status === 'completed' ? 0.6 : 1 }}>{task.title}</h3>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button onClick={() => openEditModal(task)} style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}><Edit3 size={14} /></button>
                                                <button onClick={() => setDeleteTask(task)} style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                        {task.description && <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</p>}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, background: ss.bg, color: ss.color }}><StatusIcon size={12} /> {task.status}</span>
                                            <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, background: ps.bg, color: ps.color }}>{task.priority}</span>
                                            {task.dueDate && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}><Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}</span>}
                                            {task.tags?.map(tag => <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', background: 'var(--surface-2)', color: 'var(--text-muted)' }}><Tag size={10} /> {tag}</span>)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                    <button onClick={() => fetchTasks(pagination.current - 1)} disabled={pagination.current === 1} style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)', background: 'var(--surface-2)', color: 'var(--text-primary)', opacity: pagination.current === 1 ? 0.5 : 1 }}><ChevronLeft size={16} /></button>
                    {[...Array(pagination.pages)].map((_, i) => (
                        <button key={i} onClick={() => fetchTasks(i + 1)} style={{ width: '36px', height: '36px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', border: pagination.current === i + 1 ? 'none' : '1px solid var(--border-color)', background: pagination.current === i + 1 ? '#0ea5e9' : 'var(--surface-2)', color: pagination.current === i + 1 ? 'white' : 'var(--text-secondary)' }}>{i + 1}</button>
                    ))}
                    <button onClick={() => fetchTasks(pagination.current + 1)} disabled={pagination.current === pagination.pages} style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)', background: 'var(--surface-2)', color: 'var(--text-primary)', opacity: pagination.current === pagination.pages ? 0.5 : 1 }}><ChevronRight size={16} /></button>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: '16px' }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', borderRadius: '16px', background: 'white', border: '1px solid var(--border-color)', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
                                <button onClick={() => setShowModal(false)} style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: 'var(--surface-2)', color: 'var(--text-secondary)' }}><X size={16} /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Title *</label>
                                    <input type="text" value={formData.title} onChange={e => { setFormData({ ...formData, title: e.target.value }); setFormErrors({ ...formErrors, title: '' }); }} placeholder="What needs to be done?" style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'var(--surface-2)', border: `1px solid ${formErrors.title ? 'var(--danger)' : 'var(--border-color)'}`, color: 'var(--text-primary)' }} />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Add details..." rows={3} style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', resize: 'none' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                    <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Status</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}><option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="completed">Completed</option></select></div>
                                    <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Priority</label><select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                                </div>
                                <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Due Date</label><input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} /></div>
                                <div style={{ marginBottom: '24px' }}><label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Tags</label><input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="comma separated" style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} /></div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', border: '1px solid var(--border-color)', background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>Cancel</button>
                                    <button type="submit" disabled={submitting} style={{ flex: 1, padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: 'white', opacity: submitting ? 0.7 : 1 }}>{submitting ? 'Saving...' : (editingTask ? 'Update' : 'Create')}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
                {deleteTask && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTask(null)} style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: '16px' }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '16px', background: 'white', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
                            <div style={{ width: '56px', height: '56px', margin: '0 auto 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--danger-light)', color: 'var(--danger)' }}><AlertTriangle size={28} /></div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Delete Task?</h3>
                            <p style={{ fontSize: '14px', marginBottom: '24px', color: 'var(--text-secondary)' }}>"{deleteTask.title}" will be permanently deleted.</p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setDeleteTask(null)} style={{ flex: 1, padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', border: '1px solid var(--border-color)', background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>Cancel</button>
                                <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'var(--danger)', color: 'white', opacity: deleting ? 0.7 : 1 }}>{deleting ? 'Deleting...' : 'Delete'}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default Tasks;
