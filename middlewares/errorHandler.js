const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error details to the console for debugging

    // Set a default status code if it's not already set
    const statusCode = err.status || 500;

    // Send a consistent JSON response for errors
    res.status(statusCode).json({
        message: err.message || 'Something went wrong! Please try again.',
        error: process.env.NODE_ENV === 'PRODUCTION' ? null : err.stack, // Hide stack trace in production
    });
};

export default errorHandler