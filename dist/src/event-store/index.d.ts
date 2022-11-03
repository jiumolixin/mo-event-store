import { MoEventBus } from "../event-bus";
export declare class MoEventStore {
    state: Record<string, any>;
    event: MoEventBus;
    eventV2: MoEventBus;
    actions: object | undefined;
    constructor(options: {
        state: object;
        actions?: object;
    });
    _observe(state: Record<string, any>): void;
    onState(stateKey: string, stateCallback: Function): void;
    offState(stateKey: string, stateCallback: Function): void;
}
