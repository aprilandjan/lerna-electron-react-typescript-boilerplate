import { LoDashStatic } from 'lodash';

export function clone<T>(s: T): T {
  return s;
}

export function getLodash() {
  console.log(123);
  return __non_webpack_require__('lodash') as LoDashStatic;
}
