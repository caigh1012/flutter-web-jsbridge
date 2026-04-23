import bridge from './bridge';

/**
 * 调用原生方法
 */
export function executeNative() {
  bridge.call.msg('getUser', '454654564', (data) => {
    console.log(data, '原生返回');
  });
}
