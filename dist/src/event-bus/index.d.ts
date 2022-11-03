export declare class MoEventBus {
    eventBus: Record<string, {
        eventCallback: Function;
        thisArg: any;
    }[]>;
    constructor();
    on(eventName: string, eventCallback: Function, thisArg?: any): this;
    once(eventName: string, eventCallback: Function, thisArg?: any): this;
    emit(eventName: string, ...payload: any[]): this;
    off(eventName: string, eventCallback: Function): void;
}
