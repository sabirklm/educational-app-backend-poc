const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Question title is required'],
        trim: true,
        unique: true,
    },

    type: {
        type: String,
        required: [true, 'Question type is required'],
        enum: ['single-select', 'multi-select', 'text']
    },

    // Tags for categorization
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],


}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);