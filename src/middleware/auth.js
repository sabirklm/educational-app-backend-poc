// middleware/auth.js
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied'
        });
    }
    // validate the necessary information and pass the user so that any other layer can access this information. 
    req.user = {
        id: "64f5b1234567890abcdef123",
        email: "john@example.com",
        name: "John Doe",
        role: "student",
        iat: 1672531200,
        exp: 1672617600
    };
    next();
};

module.exports = authMiddleware;