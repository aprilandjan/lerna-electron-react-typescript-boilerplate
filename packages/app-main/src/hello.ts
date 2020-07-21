// https://github.com/facebook/jest/issues/936#issuecomment-545080082
// hello.ts
export function message() {
  return 'Hello world';
}

export function foo() {
  return message();
}
