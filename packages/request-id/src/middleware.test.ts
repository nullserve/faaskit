// describe('DefaultAPIGatewayProxyRequestIdentifyingMiddleware', () => {
//   const mockEmptyEvent: APIGatewayProxyEvent = {
//     body: '',
//     resource: '',
//     headers: {},
//     multiValueHeaders: {},
//     httpMethod: 'GET',
//     isBase64Encoded: false,
//     path: '/',
//     pathParameters: {},
//     queryStringParameters: {},
//     multiValueQueryStringParameters: {},
//     stageVariables: {},
//     requestContext: {
//       accountId: '',
//       apiId: '',
//       stage: '',
//       httpMethod: 'GET',
//       path: '',
//       requestId: '',
//       requestTimeEpoch: 1,
//       resourceId: '',
//       resourcePath: '',
//       identity: {
//         accessKey: '',
//         apiKey: '',
//         accountId: '',
//         apiKeyId: '',
//         caller: '',
//         cognitoAuthenticationProvider: '',
//         cognitoAuthenticationType: '',
//         cognitoIdentityId: '',
//         cognitoIdentityPoolId: '',
//         principalOrgId: '',
//         userAgent: '',
//         userArn: '',
//         sourceIp: '',
//         user: '',
//       },
//     },
//   }
//   const mockContext: AWSContext = {
//     callbackWaitsForEmptyEventLoop: true,
//     functionName: 'functionName',
//     functionVersion: 'functionVersion',
//     invokedFunctionArn: 'invokedFunctionArn',
//     memoryLimitInMB: '1',
//     awsRequestId: 'awsRequestId',
//     logGroupName: 'logGroupName',
//     logStreamName: 'logStreamName',
//     getRemainingTimeInMillis: () => 1,
//     done: () => {},
//     fail: () => {},
//     succeed: () => {},
//   }

//   const mockRequestIdentifierContextMixin: RequestIdentifierContextMixin = {
//     requestIdentity: {
//       correlationId: '123e4567-e89b-12d3-a4564266-55440000',
//       requestId: '123e4567-e89b-12d3-a4564266-55440000',
//       sessionId: '123e4567-e89b-12d3-a4564266-55440000',
//       spanId: '123e4567e89b12d3',
//       traceId: '123e4567e89b12d3a456426655440000',
//     },
//   }
//   const mockEmptyResult: APIGatewayProxyResult = {
//     statusCode: 200,
//     body: '',
//   }

//   const mockHandler = jest.fn().mockResolvedValue(mockEmptyResult)

//   // @ts-ignore
//   mockUuid.mockImplementation((_, arr: Array<number>) => {
//     const fixedUuid = [
//       0x12,
//       0x3e,
//       0x45,
//       0x67,
//       0xe8,
//       0x9b,
//       0x12,
//       0xd3,
//       0xa4,
//       0x56,
//       0x42,
//       0x66,
//       0x55,
//       0x44,
//       0x00,
//       0x00,
//     ]
//     for (let i = 0; i < 16; i++) {
//       arr[i] = fixedUuid[i]
//     }
//     return arr
//   })

//   beforeEach(() => {
//     // @ts-ignore
//     mockUuid.mockClear()
//     mockHandler.mockClear()
//   })

//   test('calls inner handler', async () => {
//     // Given
//     const wrappedHandler = DefaultAPIGatewayProxyRequestIdentifyingMiddleware(
//       mockHandler,
//     )

//     // When
//     await wrappedHandler(mockEmptyEvent)

//     // Then
//     expect(mockHandler).toBeCalled()
//   })
//   test('puts headers on an APIGatewayProxyEvent', async () => {
//     // Given
//     const wrappedHandler = DefaultAPIGatewayProxyRequestIdentifyingMiddleware(
//       mockHandler,
//     )

//     // When
//     await wrappedHandler(mockEmptyEvent)

//     // Then
//     expect(mockUuid).toBeCalled()
//     expect(mockHandler).toBeCalledWith(mockEmptyEvent, {
//       ...mockContext,
//       ...mockRequestIdentifierContextMixin,
//     })
//   })
//   test('puts new headers on an APIGatewayProxyResult', async () => {
//     // Given
//     const wrappedHandler = DefaultAPIGatewayProxyRequestIdentifyingMiddleware(
//       mockHandler,
//     )

//     // When
//     const result = await wrappedHandler(mockEmptyEvent)

//     // Then
//     expect(result.headers).toEqual({
//       'correlation-id': '123e4567-e89b-12d3-a4564266-55440000',
//       'request-id': '123e4567-e89b-12d3-a4564266-55440000',
//       'session-id': '123e4567-e89b-12d3-a4564266-55440000',
//       'span-id': '123e4567e89b12d3',
//       'trace-id': '123e4567e89b12d3a456426655440000',
//       'x-b3-spanid': '123e4567e89b12d3',
//       'x-b3-traceid': '123e4567e89b12d3a456426655440000',
//       'x-correlation-id': '123e4567-e89b-12d3-a4564266-55440000',
//       'x-request-id': '123e4567-e89b-12d3-a4564266-55440000',
//       'x-session-id': '123e4567-e89b-12d3-a4564266-55440000',
//       'x-span-id': '123e4567e89b12d3',
//       'x-trace-id': '123e4567e89b12d3a456426655440000',
//     })
//   })
//   test('passes existing headers to APIGatewayProxyResult', async () => {
//     // Given
//     const headerHandler: Handler<
//       APIGatewayProxyEvent,
//       APIGatewayProxyResult
//     > = async () => {
//       return {...mockEmptyResult, headers: {'test-header': 'test'}}
//     }
//     const wrappedHandler = DefaultAPIGatewayProxyRequestIdentifyingMiddleware(
//       headerHandler,
//     )

//     // When
//     const result = await wrappedHandler(mockEmptyEvent)

//     // Then
//     expect(result.headers).toHaveProperty('test-header', 'test')
//   })
//   test('handles permutations of headers', () => {})
// })
