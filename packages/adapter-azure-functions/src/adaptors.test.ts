import {Context, Logger} from '@azure/functions'
import {adaptFaasKitHandlerForFunctions} from './adaptors'

describe('adaptFaasKitHandlerForFunctions', () => {
  test('nests functions-provided context', async () => {
    // Given
    const mockEvent = {testKey: 'testValue'}
    const mockPreLogger = (..._args: any[]) => {}
    mockPreLogger.warn = (..._args: any[]) => {}
    mockPreLogger.error = (..._args: any[]) => {}
    mockPreLogger.verbose = (..._args: any[]) => {}
    mockPreLogger.info = (..._args: any[]) => {}
    const mockLogger: Logger = mockPreLogger

    const mockContext: Context = {
      invocationId: '1',
      executionContext: {
        invocationId: '1',
        functionName: 'test',
        functionDirectory: '/',
      },
      bindings: {},
      bindingData: {},
      bindingDefinitions: [],
      traceContext: {
        traceparent: '0',
        tracestate: '1',
        attributes: {},
      },
      log: mockLogger,
      done: (_err?: string | Error, _result?: any) => {},
    }
    const mockResult = 'test result'

    const mockHandler = jest.fn().mockResolvedValue(mockResult)
    const mockWrappedHandler = adaptFaasKitHandlerForFunctions(mockHandler)

    // When
    const result = await mockWrappedHandler(mockContext, mockEvent)

    // Then
    expect(mockHandler).toBeCalledWith(mockEvent, {AzureFunction: mockContext})
    expect(result).toEqual(mockResult)
  })
})

describe('adaptLambdaHandlerForFaasKit', () => {})
