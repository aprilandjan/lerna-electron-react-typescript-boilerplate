import { clone } from '@/util';

describe('file ts', () => {
  it('should pass', () => {
    const a = 'a';
    const b = clone(a);
    expect(b).toEqual(a);
  });
});
