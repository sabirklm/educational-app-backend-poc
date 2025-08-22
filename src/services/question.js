const Question = require('../models/question');

const questionService = {
  // Get all questions
  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const questions = await Question.find({ isActive: true })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments({ isActive: true });

    return {
      questions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalQuestions: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  },

  // Get question by ID
  async getById(id) {
    const question = await Question.findById(id);
    if (!question) throw new Error('Question not found');
    return question;
  },

  // Create question
  async create(questionData) {
    // Validate based on type
    if (questionData.type === 'single-select' || questionData.type === 'multi-select') {
      if (!questionData.options || questionData.options.length < 2) {
        throw new Error('Multiple choice questions must have at least 2 options');
      }
    }
    
    const question = new Question(questionData);
    return await question.save();
  },

  // Update question
  async update(id, questionData) {
    const question = await Question.findByIdAndUpdate(
      id, 
      questionData, 
      { new: true, runValidators: true }
    );
    if (!question) throw new Error('Question not found');
    return question;
  },

  // Delete question
  async delete(id) {
    const question = await Question.findByIdAndDelete(id);
    if (!question) throw new Error('Question not found');
    return { message: 'Question deleted successfully' };
  },

  // Search questions
  async search(query) {
    return await Question.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).sort({ createdAt: -1 });
  },

  // Get questions by type
  async getByType(type) {
    return await Question.find({ type, isActive: true })
      .sort({ createdAt: -1 });
  },

  // Get questions by tags
  async getByTags(tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    return await Question.find({ 
      tags: { $in: tagArray },
      isActive: true 
    }).sort({ createdAt: -1 });
  }
};

module.exports = questionService;