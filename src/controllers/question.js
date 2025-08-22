const questionService = require('../services/question');

const questionController = {
  // GET /api/questions
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await questionService.getAll(page, limit);
      
      res.json({
        success: true,
        data: result.questions,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/questions/:id
  async getById(req, res) {
    try {
      const question = await questionService.getById(req.params.id);
      res.json({
        success: true,
        data: question
      });
    } catch (error) {
      const status = error.message === 'Question not found' ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/questions
  async create(req, res) {
    try {
      const question = await questionService.create(req.body);
      res.status(201).json({
        success: true,
        data: question,
        message: 'Question created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // PUT /api/questions/:id
  async update(req, res) {
    try {
      const question = await questionService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: question,
        message: 'Question updated successfully'
      });
    } catch (error) {
      const status = error.message === 'Question not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  },

  // DELETE /api/questions/:id
  async delete(req, res) {
    try {
      const result = await questionService.delete(req.params.id);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const status = error.message === 'Question not found' ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/questions/search?q=query
  async search(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query required'
        });
      }

      const questions = await questionService.search(q);
      res.json({
        success: true,
        data: questions,
        count: questions.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/questions/type/:type
  async getByType(req, res) {
    try {
      const questions = await questionService.getByType(req.params.type);
      res.json({
        success: true,
        data: questions,
        count: questions.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/questions/tags/:tags
  async getByTags(req, res) {
    try {
      const tags = req.params.tags.split(',');
      const questions = await questionService.getByTags(tags);
      res.json({
        success: true,
        data: questions,
        count: questions.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = questionController;