import { v4 as uuidV4 } from 'uuid';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import type { CallbackHandler, CallHandlerMap, RegisterHandler } from './bridge';

class MockBridge {
  /**
   * 连接 mock 环境的
   */
  private static _socket: Socket;

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
    this.setupBridge();

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

  private setupBridge() {
    const { BRIDGE_MOCK_PORT = 3000 } = process.env;
    const port = BRIDGE_MOCK_PORT || 3000;
    try {
      MockBridge._socket = io(`ws://localhost:${port}`, {
        transports: ['websocket'],
        autoConnect: false,
      });

      MockBridge._socket.on('connect', () => {
        console.error('Connected to mock environment');
      });

      MockBridge._socket.on('disconnect', () => {
        console.error('Disconnected from mock environment');
      });

      MockBridge._socket.connect();
    } catch (e) {
      console.error('Error setting up MockBridge:', e);
    }
  }

  private setCallHandlers(sendFunc) {
    const fn = function (command) {
      return function (content, data, callback) {
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
      MockBridge._callBacks[callbackId] = callback;
    }
    const params = callbackId ? { command, content, data, callbackId } : { command, content, data };

    try {
      if (MockBridge._socket.connected) {
        MockBridge._socket.emit('executeNative', JSON.stringify(params));
      } else {
        console.error('Socket is not connected');
      }
    } catch (e) {
      console.error('Socket is not defined:', e);
    }
  }

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
          // JSBridge.executeNativeCallback(callbackId, response);
        }
      } catch (e) {
        console.error(`JSBridge handler ${handlerName} error:`, e);
      }
    } else {
      console.warn(`No handler found for ${handlerName}`);
    }
  }
}

export default MockBridge;
