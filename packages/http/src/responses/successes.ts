import {HttpStatus} from './status'

// 200 OK
export class OK extends HttpStatus {
  constructor() {
    super('OK', 200)
  }
}

// 201 Created
export class Created extends HttpStatus {
  constructor() {
    super('Created', 201)
  }
}

// 202 Accepted
export class Accepted extends HttpStatus {
  constructor() {
    super('Accepted', 202)
  }
}

// 203 NonAuthoritativeInformation
export class NonAuthoritativeInformation extends HttpStatus {
  constructor() {
    super('NonAuthoritativeInformation', 203)
  }
}

// 204 NoContent
export class NoContent extends HttpStatus {
  constructor() {
    super('NoContent', 204)
  }
}

// 205 ResetContent
export class ResetContent extends HttpStatus {
  constructor() {
    super('ResetContent', 205)
  }
}

// 206 PartialContent
export class PartialContent extends HttpStatus {
  constructor() {
    super('NoContent', 206)
  }
}

// 207 MultiStatus
export class MultiStatus extends HttpStatus {
  constructor() {
    super('MultiStatus', 207)
  }
}

// 208 AlreadyReported
export class AlreadyReported extends HttpStatus {
  constructor() {
    super('AlreadyReported', 208)
  }
}

// 226 IMUsed
export class IMUsed extends HttpStatus {
  constructor() {
    super('IMUsed', 226)
  }
}
