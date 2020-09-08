export default function log() {
  console.log(456);
}

export function clone<T>(data: T): T {
  console.log(123);
  return data;
}
