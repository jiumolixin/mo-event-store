"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoEventStore = void 0;
const index_1 = require("../utils/index");
const event_bus_1 = require("../event-bus");
class MoEventStore {
    constructor(options) {
        if (!(0, index_1.isObject)(options.state)) {
            throw new TypeError("the state must be object type");
        }
        //有action并且action是object
        if (options.actions && (0, index_1.isObject)(options.actions)) {
            const values = Object.values(options.actions);
            for (const value of values) {
                if (typeof value !== "function") {
                    throw new TypeError("the value of actions must be a function");
                }
            }
            this.actions = options.actions;
        }
        //初始化
        this.state = options.state;
        this._observe(options.state);
        this.event = new event_bus_1.MoEventBus();
        this.eventV2 = new event_bus_1.MoEventBus();
    }
    _observe(state) {
        const _this = this;
        Object.keys(state).forEach((key) => {
            let _value = state[key];
            Object.defineProperty(state, key, {
                get: function () {
                    return _value;
                },
                set: function (newValue) {
                    if (_value === newValue)
                        return;
                    _value = newValue;
                    _this.event.emit(key, _value);
                    // _this.eventV2.emit(key, { [key]: _value });
                },
            });
        });
    }
    onState(stateKey, stateCallback) {
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
    offState(stateKey, stateCallback) {
        const keys = Object.keys(this.state);
        if (keys.indexOf(stateKey) === -1) {
            throw new Error("the state does not contain your key");
        }
        // 从bus中删除回调 
        this.event.off(stateKey, stateCallback);
    }
}
exports.MoEventStore = MoEventStore;
