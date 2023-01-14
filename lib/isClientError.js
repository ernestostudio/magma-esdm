/***
* @name MagmaScrapError
**/

class MagmaScrapError extends Error {
  constructor(message, code_error, details) {
    // Init Message
    super(message);
    this.name = `[MagmaScrapingError${typeof code_error === "number"?` (Error ${code_error})`:""}]`
    this.code_error = typeof code_error === "number"? code_error : null
    this.details = details
    // Track Path And Line In Error
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = MagmaScrapError
