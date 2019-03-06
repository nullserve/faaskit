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
