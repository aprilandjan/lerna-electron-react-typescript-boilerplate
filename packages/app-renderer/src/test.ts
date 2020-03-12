export default function log() {
  console.log(456);
}

export function clone<T>(data: T): T {
  return data;
}
