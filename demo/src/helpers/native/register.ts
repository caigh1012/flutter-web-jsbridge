import { registerHandler } from 'bridge';
import bridge from './bridge';

/**
 * 注册方法供原生调用
 */
export function headerButtonCallBack(func: registerHandler<number, number>) {
  bridge.registerHandler('headerButtonCallBack', func);
}
