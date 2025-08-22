
const validateUser = (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: 'Name and email required'
        });
    }

    next();
};

module.exports = validateUser;