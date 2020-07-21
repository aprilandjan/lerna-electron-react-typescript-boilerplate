// hello.test.js
import * as testModule from '@/hello';

describe('test spyon with function expressions', function() {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should NOT mock message in foo', function() {
    const actual = testModule.foo();

    expect(actual).toBe('Hello world');
  });

  it('should mock message in foo', function() {
    // jest.spyOn(testModule, 'message').mockReturnValue('my message');
    const mockMessageFn = jest.fn().mockReturnValue('my message');
    // this is provided by 'babel-plugin-rewire-ts'
    (testModule as any).default.__Rewire__('message', mockMessageFn);

    const actual = testModule.foo();

    expect(actual).toBe('my message');
    expect(mockMessageFn).toHaveBeenCalledTimes(1);
  });
});
