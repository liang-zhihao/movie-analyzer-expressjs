

const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes

    // Set a default error status code and message
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Customize the error status code and message based on the error type
    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    }

    // Send the error response
    res.status(statusCode).json({error: message});
};

class CustomError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export {errorHandler, CustomError};
