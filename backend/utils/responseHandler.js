const response = (res, statusCode, message, data=null) => {
    const responseObject = {
        status: statusCode < 400 ? 'success' : 'error',
        message,
        data
    }
    return res.status(statusCode).json(responseObject)
}

module.exports = response;