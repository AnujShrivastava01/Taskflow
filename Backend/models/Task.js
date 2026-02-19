// =============================================================
// TASK MODEL - models/Task.js
// =============================================================
// This defines the Task schema - our sample CRUD entity.
//
// SCHEMA FIELDS:
// - user: Reference to the User who created this task (ObjectId)
//         This creates a relationship between Tasks and Users
// - title: Task title (required, 1-100 chars)
// - description: Detailed task description (optional, up to 500 chars)
// - status: Current task status - one of 'pending', 'in-progress', 'completed'
//           Defaults to 'pending'
// - priority: Task urgency level - 'low', 'medium', 'high'
//             Defaults to 'medium'
// - dueDate: Optional deadline for the task
// - tags: Array of string tags for categorization/filtering
//
// RELATIONSHIPS:
// - Each task belongs to ONE user (via the `user` field)
// - A user can have MANY tasks (one-to-many relationship)
// - We use `ref: 'User'` to enable Mongoose population
//   (i.e., replacing the ObjectId with actual user data in queries)
//
// INDEXES:
// - user + createdAt compound index for efficient queries
//   (fetching a user's tasks sorted by creation date)
// - status index for filtering tasks by status
// =============================================================

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a task title'],
            trim: true,
            minlength: [1, 'Title must be at least 1 character'],
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            default: '',
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'in-progress', 'completed'],
                message: 'Status must be pending, in-progress, or completed',
            },
            default: 'pending',
        },
        priority: {
            type: String,
            enum: {
                values: ['low', 'medium', 'high'],
                message: 'Priority must be low, medium, or high',
            },
            default: 'medium',
        },
        dueDate: {
            type: Date,
            default: null,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// =============================================================
// COMPOUND INDEX for efficient querying
// =============================================================
// When we fetch tasks for a user (the most common operation),
// MongoDB can use this index to quickly find all tasks by user
// and return them sorted by createdAt without additional sorting
// =============================================================
TaskSchema.index({ user: 1, createdAt: -1 });
TaskSchema.index({ status: 1 });

module.exports = mongoose.model('Task', TaskSchema);
