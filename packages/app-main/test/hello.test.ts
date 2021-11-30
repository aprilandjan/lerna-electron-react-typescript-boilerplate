// hello.test.js
import * as testModule from '@/hello';

describe('test spy on with function expressions', function() {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should NOT mock message in foo', function() {
    const actual = testModule.foo();

    expect(actual).toBe('Hello world');
  });
});
