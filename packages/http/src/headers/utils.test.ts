import {
  CaseInsensitiveObject,
  DefaultMultiValueObject,
  remapKeys,
  toHeaderCase,
} from './utils'

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
  single = remapKeys(single, (key) => key + '1')
  singleNumber = remapKeys(singleNumber, (key) => key + '1')
  multi = remapKeys(multi, (key) => key + '1')
  multiMixed = remapKeys(multiMixed, (key) => key + '1')

  // then
  expect(single).toEqual({a1: 'b'})
  expect(singleNumber).toEqual({a1: 1})
  expect(multi).toEqual({a1: 'b', b1: 'c'})
  expect(multiMixed).toEqual({a1: 1, b1: 'c'})
})

test('CaseInsensitiveObject set should set a lower-cased value', () => {
  // given
  const sut = new CaseInsensitiveObject()

  // when
  sut['A'] = 'A'
  sut['Bb'] = 'Bb'
  sut['c-C'] = 'cc'
  sut['d'] = 'd'
  sut.E = 'e'
  sut.f = 'ff'

  // then
  expect(sut).toEqual({
    a: 'A',
    bb: 'Bb',
    'c-c': 'cc',
    d: 'd',
    e: 'e',
    f: 'ff',
  })
})

test('CaseInsensitiveObject get should get a lower-cased value', () => {
  // given
  const sut = new CaseInsensitiveObject()
  sut['A'] = 'A'
  sut['Bb'] = 'Bb'
  sut['c-C'] = 'cc'
  sut['d'] = 'd'
  sut.E = 'e'
  sut.f = 'ff'

  // then
  expect(sut.a).toEqual('A')
  expect(sut.A).toEqual('A')
  expect(sut['a']).toEqual('A')
  expect(sut['A']).toEqual('A')

  expect(sut.Bb).toEqual('Bb')

  expect(sut['c-c']).toEqual('cc')

  expect(sut.d).toEqual('d')
  expect(sut.D).toEqual('d')
  expect(sut['d']).toEqual('d')
  expect(sut['D']).toEqual('d')

  expect(sut.e).toEqual('e')
  expect(sut.E).toEqual('e')
  expect(sut['e']).toEqual('e')
  expect(sut['E']).toEqual('e')
})

test('DefaultMultiValueObject get defaults correctly', () => {
  // given
  const sut = new DefaultMultiValueObject()
  sut.a = ['a']
  sut.b = ['b', 'B']

  // expect
  expect(sut.a).toEqual(['a'])
  expect(sut.b).toEqual(['b', 'B'])
  expect(sut.c).toEqual([])
})
