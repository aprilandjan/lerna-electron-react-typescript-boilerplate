const cache = {};

function importAll(r) {
  r.keys().forEach(key => (cache[key] = r(key)));
}

importAll(require.context('@/utils/dynamic', true, /\.js$/));

console.log('---> cache', cache);

export default key => {
  console.log(123, 456124);
  //  so webpack resolve plugin does not work with require context
  return require(`@/utils/dynamic/${key}.js`);
};
