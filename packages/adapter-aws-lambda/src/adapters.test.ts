import {Context as LambdaContext} from 'aws-lambda'
import {
  adaptFaasKitHandlerForLambda,
  adaptLambdaHandlerForFaasKit,
  Context,
} from './adapters'

describe('adaptFaasKitHandlerForLambda', () => {
  test('nests lambda-provided context', async () => {
    // Given
    const mockEvent = {testKey: 'testValue'}
    const mockContext: LambdaContext = {
      callbackWaitsForEmptyEventLoop: false,
      functionName: 'testFunction',
      functionVersion: 'LATEST',
      invokedFunctionArn: 'arn:testFunction',
      memoryLimitInMB: '128',
      awsRequestId: '1',
      logGroupName: 'testFunctionLogGroupName',
      logStreamName: 'testFunctionLogGroupName1',
      getRemainingTimeInMillis: () => {
        return 1
      },
      done: (_error, _result) => {},
      fail: (_error) => {},
      succeed: (_result: any) => {},
    }
    const mockResult = 'test result'

    const mockHandler = jest.fn().mockResolvedValue(mockResult)
    const mockWrappedHandler = adaptFaasKitHandlerForLambda(mockHandler)
    const mockCallback = jest.fn()

    // When
    const result = await mockWrappedHandler(
      mockEvent,
      mockContext,
      mockCallback,
    )

    // Then
    expect(mockHandler).toBeCalledWith(mockEvent, {AWSLambda: mockContext})
    expect(result).toEqual(mockResult)
  })
})

describe('adaptLambdaHandlerForFaasKit', () => {
  test('', async () => {
    // Given
    const mockEvent = {testKey: 'testValue'}
    const expectedContext: LambdaContext = {
      callbackWaitsForEmptyEventLoop: false,
      functionName: 'testFunction',
      functionVersion: 'LATEST',
      invokedFunctionArn: 'arn:testFunction',
      memoryLimitInMB: '128',
      awsRequestId: '1',
      logGroupName: 'testFunctionLogGroupName',
      logStreamName: 'testFunctionLogGroupName1',
      getRemainingTimeInMillis: () => {
        return 1
      },
      done: (_error, _result) => {},
      fail: (_error) => {},
      succeed: (_result: any) => {},
    }
    const mockContext: Context = {
      AWSLambda: expectedContext,
    }
    const mockResult = 'test result'

    const mockHandler = jest.fn().mockResolvedValue(mockResult)
    const mockWrappedHandler = adaptLambdaHandlerForFaasKit(mockHandler)

    // When
    const result = await mockWrappedHandler(mockEvent, mockContext)

    // Then
    expect(mockHandler.mock.calls[0][0]).toBe(mockEvent)
    expect(mockHandler.mock.calls[0][1]).toEqual(expectedContext)
    expect(result).toEqual(mockResult)
  })
})
