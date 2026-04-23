export default {
  a: 10,
  b: 20,
  c: 30,
  port: 3000,
  response: {
    url: (url, arg) => {
      console.log(`打开${url}?${JSON.stringify(arg)}`);
      return 'to url success';
    },
    view: (v, arg) => {
      console.log(`打开 ${v} 原生视图,传入参数${JSON.stringify(arg)}`);
      return 'open view';
    },
  },
};
