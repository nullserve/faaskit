import {HttpStatus} from './status'

export class MultipleChoice extends HttpStatus {
  constructor() {
    super('MultipleChoice', 300)
  }
}

export class MovedPermanently extends HttpStatus {
  constructor() {
    super('MovedPermanently', 301)
  }
}

export class Found extends HttpStatus {
  constructor() {
    super('Found', 302)
  }
}

export class SeeOther extends HttpStatus {
  constructor() {
    super('SeeOther', 303)
  }
}

export class NotModified extends HttpStatus {
  constructor() {
    super('NotModified', 304)
  }
}

export class UseProxy extends HttpStatus {
  constructor() {
    super('UseProxy', 305)
  }
}

export class TemporaryRedirect extends HttpStatus {
  constructor() {
    super('TemporaryRedirect', 307)
  }
}

export class PermanentRedirect extends HttpStatus {
  constructor() {
    super('PermanentRedirect', 308)
  }
}
