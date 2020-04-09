import {HttpError, ErrorDetails} from './error'

// 400
export class BadRequest extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'BadRequest', 400, details)
  }
}

// 401
export class Unauthorized extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'Unauthorized', 401, details)
  }
}

// 402
export class PaymentRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'PaymentRequired', 402, details)
  }
}

// 403
export class Forbidden extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'Forbidden', 403, details)
  }
}

// 404
export class NotFound extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'NotFound', 404, details)
  }
}

// 405
export class MethodNotAllowed extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'MethodNotAllowed', 405, details)
  }
}

// 406
export class NotAcceptable extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'NotAcceptable', 406, details)
  }
}

// 407
export class ProxyAuthenticationRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'ProxyAuthenticationRequired', 407, details)
  }
}

// 408
export class RequestTimeout extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'RequestTimeout', 408, details)
  }
}

// 409
export class Conflict extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'Conflict', 409, details)
  }
}

// 410
export class Gone extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'Gone', 410, details)
  }
}

// 411
export class LengthRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'LengthRequired', 411, details)
  }
}

// 412
export class PreconditionFailed extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'PreconditionFailed', 412, details)
  }
}

// 413
export class RequestEntityTooLarge extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'RequestEntityTooLarge', 413, details)
  }
}

// 414
export class RequestURITooLong extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'RequestURITooLong', 414, details)
  }
}

// 415
export class UnsupportedMediaType extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'UnsupportedMediaType', 415, details)
  }
}

// 416
export class RequestedRangeNotSatisfiable extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'BadRequest', 416, details)
  }
}

// 417
export class ExpectationFailed extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'ExpectationFailed', 417, details)
  }
}

// 418
export class ImATeapot extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'ImATeapot', 418, details)
  }
}

// 420
export class EnhanceYourCalm extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'EnhanceYourCalm', 420, details)
  }
}

// 422
export class UnprocessableEntity extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'UnprocessableEntity', 422, details)
  }
}

// 426
export class UpgradeRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'UpgradeRequired', 426, details)
  }
}

// 428
export class PreconditionRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'PreconditionRequired', 428, details)
  }
}

// 429
export class TooManyRequests extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'TooManyRequests', 429, details)
  }
}

// 431
export class RequestHeaderFieldsTooLarge extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'RequestHeaderFieldsTooLarge', 431, details)
  }
}

// 451
export class UnavailableForLegalReasons extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'UnavailableForLegalReasons', 451, details)
  }
}
