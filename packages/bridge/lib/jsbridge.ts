import { v4 as uuidV4 } from 'uuid';
import type { CallbackHandler, CallHandlerMap, JSBridgeChannel, RegisterHandler } from './bridge';

class JSBridge {
  /**
   * 原生在加载 html 之前注入的 jsBridgeChannel
   */
  private static _jsBridgeChannel: JSBridgeChannel;

  /**
   * 存储回调函数
   */
  private static _callBacks: Record<string, CallbackHandler> = {};

  /**
   * 准备就绪
   */
  private _ready: Promise<void> = Promise.resolve();

  /**
   * 存储注册事件供APP调用
   */
  private _registeredHandlers = new Map<string, RegisterHandler>();

  /**
   * 存储调取原生方法
   */
  private _callHandlers: CallHandlerMap = {
    url: () => {},
    file: () => {},
    view: () => {},
    app: () => {},
    msg: () => {},
  };

  /**
   * 前端调取原生方法
   */
  get call() {
    return this._callHandlers;
  }

  get ready() {
    return this._ready;
  }

  constructor() {
    JSBridge._jsBridgeChannel = window.jsBridgeChannel;

    try {
      Object.defineProperty(window, 'jsBridge', {
        value: this,
        writable: false,
        configurable: false,
        enumerable: false,
      });
    } catch (e) {
      console.error('jsBridge initialization error', e);
    }

    this.setCallHandlers(this.action);
  }

  private setCallHandlers(sendFunc) {
    const fn = function (command) {
      return function (content, data, callback) {
        /**
         * 最终传递给 action 方法
         * @param command 事件协议 url file view app msg
         * @param content 事件内容
         * @param data 事件数据
         * @param callback 事件回调函数
         */
        return sendFunc({ command, content, data, callback });
      };
    };

    this._callHandlers = ['url', 'file', 'view', 'app', 'msg'].reduce(function (obj, k) {
      obj[k] = fn(k);
      return obj;
    }, this._callHandlers);
  }

  private action({ command, content, data, callback }) {
    let callbackId = undefined;
    if (callback) {
      // 如果有回调函数，生成一个唯一的 ID
      callbackId = uuidV4();
      JSBridge._callBacks[callbackId] = callback;
    }
    const params = callbackId ? { command, content, data, callbackId } : { command, content, data };

    try {
      JSBridge._jsBridgeChannel.postMessage(
        JSON.stringify({
          handlerName: 'executeNative',
          ...params,
        }),
      );
    } catch (e) {
      console.error('jsBridgeChannel is not defined:', e);
    }
  }

  /**
   * 注册事件供APP调用
   * @param handlerName 事件名称
   * @param fn 事件函数
   */
  registerHandler(handlerName: string, fn: RegisterHandler) {
    this._registeredHandlers.set(handlerName, fn);
  }

  /**
   * 原生调用js方法
   * @param handlerName // js方法名称
   * @param data // 原生传递过来的数据
   * @param callbackId // 回调函数id
   */
  executeJs(handlerName: string, data: any, callbackId: string) {
    if (this._registeredHandlers.has(handlerName)) {
      try {
        const response = this._registeredHandlers.get(handlerName)(data); // js方法执行之后的返回值
        // 如果有callbackId，返回结果给Flutter
        if (callbackId) {
          // 发送回调结果给Flutter
          JSBridge.executeNativeCallback(callbackId, response);
        }
      } catch (e) {
        console.error(`JSBridge handler ${handlerName} error:`, e);
      }
    } else {
      console.warn(`No handler found for ${handlerName}`);
    }
  }

  /**
   * 原生调用 js 回调方法
   * @param handlerName // js方法名称 这里必须是 callback
   * @param data // 原生传递过来的数据
   * @param callbackId // js回调函数id
   */
  executeJsCallback(callbackId: string, data: any) {
    JSBridge._callBacks[callbackId] && JSBridge._callBacks[callbackId](data);
    delete JSBridge._callBacks[callbackId];
  }

  /**
   * 执行原生的回调方法
   * @param callbackId // js回调函数id
   * @param data // 回调参数
   */
  private static executeNativeCallback(callbackId, data) {
    try {
      JSBridge._jsBridgeChannel.postMessage(
        JSON.stringify({
          handlerName: 'executeCallback',
          callbackId: callbackId,
          data: data, // 回调数据
        }),
      );
    } catch (err) {
      console.error('jsBridgeChannel is not defined');
    }
  }
}

export type { CallbackHandler, CallHandlerMap, JSBridgeChannel, RegisterHandler };

export default JSBridge;
