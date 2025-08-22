const userService = require('../services/UserService');
class UserController {
  // GET /api/users
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const result = await userService.getAllUsers(page, limit);
      
      res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/users/:id
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: user
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/users
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      const statusCode = error.message.includes('already exists') ? 409 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/users/:id
  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/users/search?q=searchTerm
  async searchUsers(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const users = await userService.searchUsers(q);
      
      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UserController();