import show1 from 'module-a';
import show2 from 'module-b';

export default function show() {
  return {
    name1: show1(),
    name2: show2(),
  };
}
