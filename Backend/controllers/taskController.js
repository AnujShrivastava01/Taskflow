// =============================================================
// TASK CONTROLLER - controllers/taskController.js
// =============================================================
// Handles CRUD operations for the Task entity.
//
// ENDPOINTS:
// 1. getTasks    - GET    /api/tasks       - List user's tasks (with search/filter/pagination)
// 2. getTask     - GET    /api/tasks/:id   - Get single task by ID
// 3. createTask  - POST   /api/tasks       - Create a new task
// 4. updateTask  - PUT    /api/tasks/:id   - Update an existing task
// 5. deleteTask  - DELETE /api/tasks/:id   - Delete a task
// 6. getTaskStats - GET   /api/tasks/stats - Get task statistics
//
// ALL ROUTES ARE PROTECTED (require authentication).
// Tasks are scoped to the authenticated user - users can only
// access their own tasks.
//
// QUERY FEATURES (getTasks):
// - Search: ?search=keyword (searches title and description)
// - Filter by status: ?status=pending
// - Filter by priority: ?priority=high
// - Sort: ?sort=dueDate or ?sort=-createdAt (- for descending)
// - Pagination: ?page=1&limit=10
// =============================================================

const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// =============================================================
// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
// =============================================================
// This implements search, filter, sort, and pagination:
//
// SEARCH: Uses MongoDB $regex for case-insensitive text search
// across both title and description fields using $or operator.
//
// FILTER: Exact match filtering on status and priority fields.
//
// SORT: Dynamic sorting based on query parameter.
// Default: sort by createdAt descending (newest first).
//
// PAGINATION: Skip-based pagination.
// page=2&limit=10 → skip first 10, return next 10.
// =============================================================
const getTasks = async (req, res, next) => {
    try {
        const { search, status, priority, sort, page = 1, limit = 10 } = req.query;

        // Build query object - always filter by current user
        const query = { user: req.user._id };

        // Add search functionality (case-insensitive regex on title and description)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Add status filter
        if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
            query.status = status;
        }

        // Add priority filter
        if (priority && ['low', 'medium', 'high'].includes(priority)) {
            query.priority = priority;
        }

        // Calculate pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Build sort object
        let sortObj = { createdAt: -1 }; // Default: newest first
        if (sort) {
            const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
            const sortOrder = sort.startsWith('-') ? -1 : 1;
            sortObj = { [sortField]: sortOrder };
        }

        // Execute query with pagination
        const [tasks, total] = await Promise.all([
            Task.find(query).sort(sortObj).skip(skip).limit(limitNum),
            Task.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            data: tasks,
            pagination: {
                current: pageNum,
                pages: Math.ceil(total / limitNum),
                total,
                limit: limitNum,
            },
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================
// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
// =============================================================
// Security: Verifies the task belongs to the requesting user
// =============================================================
const getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Ensure user owns this task
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this task',
            });
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================
// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
// =============================================================
// The user field is automatically set from req.user._id
// (set by auth middleware). Users cannot create tasks for others.
// =============================================================
const createTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array().map((e) => e.msg).join(', '),
            });
        }

        const { title, description, status, priority, dueDate, tags } = req.body;

        const task = await Task.create({
            user: req.user._id,
            title,
            description,
            status,
            priority,
            dueDate: dueDate || null,
            tags: tags || [],
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================
// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
// =============================================================
// Only the task owner can update their task.
// Uses findByIdAndUpdate with runValidators for schema validation.
// =============================================================
const updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Ensure user owns this task
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task',
            });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
// =============================================================
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Ensure user owns this task
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this task',
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================
// @desc    Get task statistics for dashboard
// @route   GET /api/tasks/stats
// @access  Private
// =============================================================
// Uses MongoDB aggregation pipeline to compute:
// - Total tasks
// - Count by status (pending, in-progress, completed)
// - Count by priority (low, medium, high)
// - Tasks due today
// - Overdue tasks
//
// AGGREGATION EXPLAINED:
// $match → Filter tasks by user
// $group → Group all matching tasks and compute counts using $sum
// $cond  → Conditional counting (like SQL CASE WHEN)
// =============================================================
const getTaskStats = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const stats = await Task.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                    },
                    inProgress: {
                        $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
                    },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                    },
                    lowPriority: {
                        $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] },
                    },
                    mediumPriority: {
                        $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] },
                    },
                    highPriority: {
                        $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] },
                    },
                    dueToday: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ['$dueDate', today] },
                                        { $lt: ['$dueDate', tomorrow] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    overdue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ['$dueDate', today] },
                                        { $ne: ['$status', 'completed'] },
                                        { $ne: ['$dueDate', null] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        // If no tasks exist, return zeros
        const defaultStats = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            lowPriority: 0,
            mediumPriority: 0,
            highPriority: 0,
            dueToday: 0,
            overdue: 0,
        };

        res.status(200).json({
            success: true,
            data: stats.length > 0 ? stats[0] : defaultStats,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
};
