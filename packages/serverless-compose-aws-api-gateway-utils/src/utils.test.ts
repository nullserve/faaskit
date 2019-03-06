import {remapKeys, toHeaderCase} from './utils'

describe('utils', () => {
  test('toHeaderCase converts strings', () => {
    // given
    let allLower = 'abc'
    let allUpper = 'ABC'
    let lowerDash = 'ab-c'
    let mixed = 'x-ConTeNT-Type'

    // when
    allLower = toHeaderCase(allLower)
    allUpper = toHeaderCase(allUpper)
    lowerDash = toHeaderCase(lowerDash)
    mixed = toHeaderCase(mixed)

    // then
    expect(allLower).toEqual('Abc')
    expect(allUpper).toEqual('Abc')
    expect(lowerDash).toEqual('Ab-C')
    expect(mixed).toEqual('X-Content-Type')
  })

  test('remapKeys changes key strings', () => {
    // given
    let single: {[name: string]: string} = {a: 'b'}
    let singleNumber: {[name: string]: number} = {a: 1}
    let multi: {[name: string]: string} = {a: 'b', b: 'c'}
    let multiMixed: {[name: string]: string | number} = {a: 1, b: 'c'}

    // when
    single = remapKeys(single, key => key + '1')
    singleNumber = remapKeys(singleNumber, key => key + '1')
    multi = remapKeys(multi, key => key + '1')
    multiMixed = remapKeys(multiMixed, key => key + '1')

    // then
    expect(single).toEqual({a1: 'b'})
    expect(singleNumber).toEqual({a1: 1})
    expect(multi).toEqual({a1: 'b', b1: 'c'})
    expect(multiMixed).toEqual({a1: 1, b1: 'c'})
  })
})
