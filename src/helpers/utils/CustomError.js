class CustomError extends Error {
    constructor(exception, errocode, message, urlInternService, httpCode, url, ) {
        super()
        this.exception = exception
        this.errorcode = errocode
        this.message = message
        this.self = url ? url : null
        this.httpCode = httpCode ? httpCode : null
        this.urlInternService = urlInternService ? urlInternService : null
    }
}


module.exports = CustomError