import {IHttpStatus} from './status'

export class HttpError extends Error implements IHttpStatus {
  public statusCode: number
  public details?: ErrorDetails
  public name: string

  constructor(
    message: string,
    name: string,
    statusCode: number,
    details?: ErrorDetails,
  ) {
    super(message)
    this.name = name
    this.statusCode = statusCode
    this.details = details
  }
}

export interface ErrorDetails {
  fields: {[key: string]: string}
}
