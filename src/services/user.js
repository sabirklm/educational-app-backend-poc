const User = require("../models/user");

class UserService {
    // Get all users
    async getAllUsers(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const users = await User.find()
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            const total = await User.countDocuments();

            return {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalUsers: total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    }

    // Create new user
    async createUser(userData) {
        try {
            const user = new User(userData);
            await user.save();
            return user;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('User with this email already exists');
            }
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    // Update user
    async updateUser(userId, updateData) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    // Delete user
    async deleteUser(userId) {
        try {
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    // Search users by name or email
    async searchUsers(searchTerm) {
        try {
            const users = await User.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } },
                    { city: { $regex: searchTerm, $options: 'i' } }
                ]
            }).sort({ createdAt: -1 });

            return users;
        } catch (error) {
            throw new Error(`Failed to search users: ${error.message}`);
        }
    }
}

module.exports = new UserService();
