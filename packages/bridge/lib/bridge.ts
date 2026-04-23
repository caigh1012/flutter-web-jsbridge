export type JSBridgeChannel = any;

export type RegisterHandler<T = any, D = void> = (data: T) => D;

export type CallbackHandler<T = any, D = void> = (data: T) => D;

export type CallHandler = <T = any>(content: string, data?: T, callback?: CallbackHandler) => void;

export type CallHandlerType = 'url' | 'file' | 'view' | 'app' | 'msg';

export type CallHandlerMap = {
  [k in CallHandlerType]: CallHandler;
};
