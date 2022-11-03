import { isObject } from "../utils/index";
import { MoEventBus } from "../event-bus";
const setProxyObj=(obj:object,thisArg:any)=>{
  return new Proxy(obj,{
    get(target,key,receiver){
      return Reflect.get(target,key,receiver)
    },
    set(target:any,key,newValue,receiver){
      if(target.key===newValue) 
          return false 
        Reflect.set(target,key,newValue,receiver)
        thisArg.event.emit(key as string,newValue)
        return true
    }
  })
}
export class MoEventStore {
  public state: Record<string, any>;
  public event: MoEventBus;
  public eventV2: MoEventBus;
  public actions: object | undefined;

  constructor(options: { state: object; actions?: object }) {
    if (!isObject(options.state)) {
      throw new TypeError("the state must be object type");
    }
    //有action并且action是object
    if (options.actions && isObject(options.actions)) {
      const values = Object.values(options.actions);
      for (const value of values) {
        if (typeof value !== "function") {
          throw new TypeError("the value of actions must be a function");
        }
      }
      this.actions = options.actions;
    }
    //初始化
    this.state = this._proxy(options.state);
    // this._observe(options.state);
    this.event = new MoEventBus();
    this.eventV2 = new MoEventBus();
  }

  _observe(state: Record<string, any>) {
    const _this = this;
    Object.keys(state).forEach((key) => {
      let _value = state[key];
      Object.defineProperty(state, key, {
        get: function () {
          return _value;
        },
        set: function (newValue) {
          if (_value === newValue) return;
          _value = newValue;
          _this.event.emit(key, _value);
          // _this.eventV2.emit(key, { [key]: _value });
        },
      });
    });
  }
  _proxy(_state: Record<string, any>) {
    const _this = this;
    const state = new Proxy(_state,{
      get(target,key,receiver){
        // if(typeof target.key==="object")
        // target.key=setProxyObj(_state.key,_this)
        return Reflect.get(target,key,receiver)
        // return 123
      },
      set(target,key,newValue,receiver){
        if(target.key===newValue) 
          return false 
        Reflect.set(target,key,newValue,receiver)
        _this.event.emit(key as string,newValue)
        return true
      },
    })
    return state 
  }
  onState(stateKey: string, stateCallback: Function) {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state does not contain your key");
    }
    // 存入eventBus
    this.event.on(stateKey, stateCallback);

    // callback
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    //拿到state的初始值
    const value = this.state[stateKey];
    stateCallback.apply(this.state, [value]);
  }

  offState(stateKey: string, stateCallback: Function) {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state does not contain your key");
    }
    // 从bus中删除回调
    this.event.off(stateKey, stateCallback);
  }
}
