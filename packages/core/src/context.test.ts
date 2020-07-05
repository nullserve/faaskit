import {combineContext} from './context'

describe('combineContext', () => {
  test('returns a combined context', () => {
    // Given
    const context1 = {
      test: 'test',
    }
    const context2 = {
      foo: 'bar',
    }
    const expectedContext = {
      test: 'test',
      foo: 'bar',
    }

    // When
    const finalContext = combineContext(context1, context2)

    // Then
    expect(finalContext).toEqual(expectedContext)
  })

  test('prefers values in second context', () => {
    // Given
    const context1 = {
      test: 'test',
      foo: 'baz',
    }
    const context2 = {
      foo: 'bar',
    }
    const expectedContext = {
      test: 'test',
      foo: 'bar',
    }

    // When
    const finalContext = combineContext(context1, context2)

    // Then
    expect(finalContext).toEqual(expectedContext)
  })
})
