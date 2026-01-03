const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        institution: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ['Student', 'Alumni', 'Teacher', 'TA', 'other'],
            required: true,
        },
        otherRoleName: {
            type: String,
            trim: true,
            required: function () {
                return this.role === 'other';
            },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        preferredLanguage: {
            type: String,
            default: 'sv',
            enum: ['sv', 'en', 'es', 'de', 'fr', 'no', 'da', 'fi'],
        },
    },
    { timestamps: true}
);
// define the model
const User = mongoose.model('User', userSchema);

module.exports = User;