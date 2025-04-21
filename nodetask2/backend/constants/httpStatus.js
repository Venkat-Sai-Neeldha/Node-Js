const HttpStatus = {
    // 2xx Success
    OK: {
        code: 200,
        message: 'OK'
    },
    CREATED: {
        code: 201,
        message: 'Created'
    },

    
    BAD_REQUEST: {
        code: 400,
        message: 'Bad Request'
    },
    NOT_FOUND: {
        code: 404,
        message: 'Not Found'
    },

    
    INTERNAL_SERVER_ERROR: {
        code: 500,
        message: 'Internal Server Error'
    }
};

module.exports = HttpStatus;