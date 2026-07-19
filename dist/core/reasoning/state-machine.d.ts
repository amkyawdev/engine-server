export type StateType = 'idle' | 'analyzing' | 'planning' | 'executing' | 'observing' | 'reasoning' | 'finished' | 'error';
export interface StateTransition {
    from: StateType | '*';
    to: StateType;
    condition: (context: StateContext) => boolean;
    action?: (context: StateContext) => Promise<void>;
}
export interface StateContext {
    currentState: StateType;
    input: string;
    history: StateType[];
    data: Record<string, unknown>;
    error?: Error;
}
export interface StateMachineResult {
    finalState: StateType;
    history: StateType[];
    data: Record<string, unknown>;
    success: boolean;
}
export declare class StateMachineReasoner {
    private transitions;
    private maxIterations;
    constructor(maxIterations?: number);
    private setupTransitions;
    reason(input: string, initialContext?: Record<string, unknown>): Promise<StateMachineResult>;
    private findNextState;
    addTransition(transition: StateTransition): void;
}
export declare const stateMachineReasoner: StateMachineReasoner;
//# sourceMappingURL=state-machine.d.ts.map