export function toHeaderCase(header: string): string {
  return header
    .split('-')
    .map(
      (segment) =>
        segment.charAt(0).toUpperCase() + segment.substr(1).toLowerCase(),
    )
    .join('-')
}

export function remapKeys<T>(
  obj: {[name: string]: T},
  mapFn: (val: string) => string,
): {[name: string]: T} {
  return {
    ...Object.keys(obj).reduce(
      (acc, key) => ({...acc, [mapFn(key)]: obj[key]}),
      {},
    ),
  }
}

const caseInsensitiveHandler: ProxyHandler<CaseInsensitiveObject> = {
  set: (
    target: CaseInsensitiveObject,
    attribute: symbol | string,
    value: string,
  ): boolean => {
    target[attribute.toString().toLowerCase()] = value
    return true
  },
  get: (target: CaseInsensitiveObject, attribute: symbol | string) => {
    return target[attribute.toString().toLowerCase()]
  },

  // FIXME: add spread operator https://stackoverflow.com/a/57618241
}

export class CaseInsensitiveObject {
  [attribute: string]: string
  constructor() {
    return new Proxy(this, caseInsensitiveHandler)
  }
}

const defaultMultiValueHandler: ProxyHandler<DefaultMultiValueObject> = {
  get: (target: DefaultMultiValueObject, attribute: symbol | string) => {
    return target.hasOwnProperty(attribute) ? target[attribute.toString()] : []
  },

  // FIXME: add spread operator https://stackoverflow.com/a/57618241
}

export class DefaultMultiValueObject {
  [attribute: string]: string[]
  constructor() {
    return new Proxy(this, defaultMultiValueHandler)
  }
}
