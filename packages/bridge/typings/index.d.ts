declare class JSBridge {
    /**
     * 原生在加载 html 之前注入的 jsBridgeChannel
     */
    private static _jsBridgeChannel;
    /**
     * 存储回调函数
     */
    private static _callBacks;
    /**
     * 准备就绪
     */
    private _ready;
    /**
     * 存储注册事件供APP调用
     */
    private _registeredHandlers;
    /**
     * 存储调取原生方法
     */
    private _callHandlers;
    /**
     * 前端调取原生方法
     */
    get call(): CallHandlerMap;
    get ready(): Promise<void>;
    constructor();
    private setCallHandlers;
    private action;
    /**
     * 注册事件供APP调用
     * @param handlerName 事件名称
     * @param fn 事件函数
     */
    registerHandler(handlerName: string, fn: RegisterHandler): void;
    /**
     * 原生调用js方法
     * @param handlerName // js方法名称
     * @param data // 原生传递过来的数据
     * @param callbackId // 回调函数id
     */
    executeJs(handlerName: string, data: any, callbackId: string): void;
    /**
     * 原生调用 js 回调方法
     * @param handlerName // js方法名称 这里必须是 callback
     * @param data // 原生传递过来的数据
     * @param callbackId // js回调函数id
     */
    executeJsCallback(callbackId: string, data: any): void;
    /**
     * 执行原生的回调方法
     * @param callbackId // js回调函数id
     * @param data // 回调参数
     */
    private static executeNativeCallback;
}
type JSBridgeChannel = any;
type RegisterHandler<T = any, D = void> = (data: T) => D;
type CallbackHandler<T = any, D = void> = (data: T) => D;
type CallHandlerType$1 = 'url' | 'file' | 'view' | 'app' | 'msg';
type CallHandler = <T = any>(content: string, data?: T, callback?: CallbackHandler) => void;
type CallHandlerMap = {
    [k in CallHandlerType$1]: CallHandler;
};

type CallHandlerType = 'url' | 'file' | 'view' | 'app' | 'msg';
type HandlerObj = Record<string, (params: any) => any[]>;
declare class MockBridge {
    private _ready;
    /**
     * 注册事件供APP调用
     */
    private _registeredHandlers;
    /**
     * 调取原生方法
     */
    private _callHandlers;
    /**
     * 连接 mock 环境的
     */
    private _socket;
    constructor();
    private setupBridge;
    private initCallHandlers;
    private action;
    onReady(): Promise<void>;
    registerHandler(name: any, fn: any): void;
    callHandler(): Record<CallHandlerType, HandlerObj>;
}

export { JSBridge, MockBridge };
export type { CallHandler, CallHandlerType$1 as CallHandlerType, JSBridgeChannel, RegisterHandler as registerHandler };
