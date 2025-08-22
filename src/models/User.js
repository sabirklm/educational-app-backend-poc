
// ===============================
// 1. USER MODEL (src/models/User.js)
// ===============================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    address: {
        type: String,
        trim: true,
    },
    age: {
        type: Number,
        min: [1, 'Age must be at least 1'],
        max: [150, 'Age cannot exceed 150']
    },
    city: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);