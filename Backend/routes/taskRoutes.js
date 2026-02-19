// =============================================================
// TASK ROUTES - routes/taskRoutes.js
// =============================================================
// Defines all task-related API endpoints.
// ALL routes are protected (require authentication).
//
// ROUTE MAP:
// GET    /api/tasks       → Get all tasks (with search/filter/pagination)
// GET    /api/tasks/stats → Get task statistics for dashboard
// POST   /api/tasks       → Create a new task
// GET    /api/tasks/:id   → Get single task by ID
// PUT    /api/tasks/:id   → Update a task
// DELETE /api/tasks/:id   → Delete a task
//
// IMPORTANT ORDER NOTE:
// The /stats route MUST come BEFORE /:id route!
// Otherwise, Express would interpret "stats" as an :id parameter
// and try to find a task with _id="stats", which would fail.
// =============================================================

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Apply auth middleware to ALL routes in this router
router.use(protect);

// ----- Stats route (MUST be before /:id) -----
router.get('/stats', getTaskStats);

// ----- CRUD Routes -----
router
    .route('/')
    .get(getTasks)
    .post(
        [
            body('title')
                .trim()
                .notEmpty()
                .withMessage('Task title is required')
                .isLength({ max: 100 })
                .withMessage('Title cannot exceed 100 characters'),
            body('description')
                .optional()
                .isLength({ max: 500 })
                .withMessage('Description cannot exceed 500 characters'),
            body('status')
                .optional()
                .isIn(['pending', 'in-progress', 'completed'])
                .withMessage('Invalid status value'),
            body('priority')
                .optional()
                .isIn(['low', 'medium', 'high'])
                .withMessage('Invalid priority value'),
        ],
        createTask
    );

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
