"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoEventBus = void 0;
class MoEventBus {
    constructor() {
        this.eventBus = {};
    }
    //向{name:[]}添加cb和this 会添加重复的callback
    on(eventName, eventCallback, thisArg = undefined) {
        if (typeof eventName !== "string") {
            throw new TypeError("the event name must be string type");
        }
        if (typeof eventCallback !== "function") {
            throw new TypeError("the event callback must be function type");
        }
        let hanlders = this.eventBus[eventName];
        if (!hanlders) {
            hanlders = [];
            this.eventBus[eventName] = hanlders;
        }
        hanlders.push({
            eventCallback,
            thisArg,
        });
        return this;
    }
    //不会添加重复的callback 在调用一次后就删除
    once(eventName, eventCallback, thisArg = undefined) {
        if (typeof eventName !== "string") {
            throw new TypeError("the event name must be string type");
        }
        if (typeof eventCallback !== "function") {
            throw new TypeError("the event callback must be function type");
        }
        const tempCallback = (...payload) => {
            this.off(eventName, tempCallback);
            eventCallback.apply(thisArg, payload);
        };
        return this.on(eventName, tempCallback, thisArg);
    }
    emit(eventName, ...payload) {
        if (typeof eventName !== "string") {
            throw new TypeError("the event name must be string type");
        }
        const handlers = this.eventBus[eventName] || [];
        handlers.forEach((handler) => {
            handler.eventCallback.apply(handler.thisArg, payload);
        });
        return this;
    }
    //删除 全部重复的callback
    off(eventName, eventCallback) {
        if (typeof eventName !== "string") {
            throw new TypeError("the event name must be string type");
        }
        if (typeof eventCallback !== "function") {
            throw new TypeError("the event callback must be function type");
        }
        const handlers = this.eventBus[eventName];
        if (handlers && eventCallback) {
            // handlers=[fna,fnb]
            const newHandlers = [...handlers];
            for (let i = 0; i < newHandlers.length; i++) {
                // handler = {thisArg,eventCallback}
                const handler = newHandlers[i];
                if (handler.eventCallback === eventCallback) {
                    const index = handlers.indexOf(handler);
                    handlers.splice(index, 1);
                }
            }
        }
        if (handlers.length === 0) {
            delete this.eventBus[eventName];
        }
    }
}
exports.MoEventBus = MoEventBus;
