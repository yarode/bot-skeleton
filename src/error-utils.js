class RequestHandlerError extends Error {
  constructor(message) {
    super(`${Date.now()}: ${message}`)
    this.name = 'RequestHandlerError'
  }
}

module.exports = {
  RequestHandlerError
}
