export function toHeaderCase(header: string): string {
  return header
    .split('-')
    .map(
      segment =>
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
    attribute: string,
    value: string,
  ): boolean => {
    target[attribute.toLowerCase()] = value
    return true
  },
  get: (target: CaseInsensitiveObject, attribute: string) => {
    return target[attribute.toLowerCase()]
  },
}

class CaseInsensitiveObject {
  [attribute: string]: string
  constructor() {
    return new Proxy(this, caseInsensitiveHandler)
  }
}

const defaultMultiValueHandler: ProxyHandler<DefaultMultiValueObject> = {
  get: (target: DefaultMultiValueObject, attribute: string) => {
    return target.hasOwnProperty(attribute) ? target[attribute] : []
  },
}

class DefaultMultiValueObject {
  [attribute: string]: string[]
  constructor() {
    return new Proxy(this, defaultMultiValueHandler)
  }
}
