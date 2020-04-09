export interface IHttpStatus {
  statusCode: number
  name: string
}

export class HttpStatus implements IHttpStatus {
  public statusCode: number
  public name: string
}
