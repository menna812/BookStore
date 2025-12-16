// Generic error handler to catch exceptions from controllers/models
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Handle MySQL errors (e.g., trigger failure, foreign key violations)
    if (err.sqlState) {
        // SQLState '45000' is the custom error thrown by our triggers
        if (err.sqlState === '45000') {
            return res.status(400).json({ 
                message: err.message.replace('SIGNAL SQLSTATE \'45000\' SET MESSAGE_TEXT = ', ''), 
                errorType: "DB_INTEGRITY_FAIL" 
            });
        }
        return res.status(500).json({ 
            message: "Database Error Occurred", 
            detail: err.sqlMessage,
            errorType: "DB_GENERIC"
        });
    }

    // Handle Joi validation errors
    if (err.isJoi) {
        return res.status(400).json({ message: err.details[0].message, errorType: "VALIDATION_FAIL" });
    }
    
    // Default server error
    res.status(500).json({ message: "An unexpected error occurred." });
};

module.exports = errorHandler;