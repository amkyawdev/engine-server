// State Machine Reasoning
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('reasoning:state-machine');

export type StateType = 
  | 'idle'
  | 'analyzing'
  | 'planning'
  | 'executing'
  | 'observing'
  | 'reasoning'
  | 'finished'
  | 'error';

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

export class StateMachineReasoner {
  private transitions: StateTransition[] = [];
  private maxIterations: number;

  constructor(maxIterations = 20) {
    this.maxIterations = maxIterations;
    this.setupTransitions();
  }

  private setupTransitions(): void {
    // Idle -> Analyzing (when input received)
    this.transitions.push({
      from: 'idle',
      to: 'analyzing',
      condition: (ctx) => !!ctx.input,
    });

    // Analyzing -> Planning
    this.transitions.push({
      from: 'analyzing',
      to: 'planning',
      condition: () => true,
    });

    // Planning -> Executing
    this.transitions.push({
      from: 'planning',
      to: 'executing',
      condition: () => true,
    });

    // Executing -> Observing
    this.transitions.push({
      from: 'executing',
      to: 'observing',
      condition: () => true,
    });

    // Observing -> Reasoning
    this.transitions.push({
      from: 'observing',
      to: 'reasoning',
      condition: () => true,
    });

    // Reasoning -> Planning (loop) or Finished
    this.transitions.push({
      from: 'reasoning',
      to: 'planning',
      condition: (ctx) => {
        const needsMore = ctx.data.needsMoreIterations === true;
        if (!needsMore) {
          ctx.data.needsMoreIterations = false;
        }
        return needsMore;
      },
    });

    this.transitions.push({
      from: 'reasoning',
      to: 'finished',
      condition: (ctx) => ctx.data.needsMoreIterations !== true,
    });

    // Error handling
    this.transitions.push({
      from: '*',
      to: 'error',
      condition: (ctx) => !!ctx.error,
    });
  }

  async reason(
    input: string,
    initialContext: Record<string, unknown> = {}
  ): Promise<StateMachineResult> {
    logger.info({ input: input.slice(0, 100) }, 'Starting state machine reasoning');

    const context: StateContext = {
      currentState: 'idle',
      input,
      history: ['idle'],
      data: { ...initialContext },
    };

    let iterations = 0;

    while (context.currentState !== 'finished' && context.currentState !== 'error') {
      iterations++;

      if (iterations >= this.maxIterations) {
        logger.warn({ iterations }, 'Max iterations reached');
        break;
      }

      const nextState = this.findNextState(context);
      if (!nextState) break;

      context.currentState = nextState;
      context.history.push(nextState);

      logger.debug({ state: nextState, iteration: iterations }, 'State transition');

      // Execute transition action if any
      const transition = this.transitions.find(
        (t) =>
          (t.from === context.history[context.history.length - 2] || t.from === '*') &&
          t.to === nextState
      );
      if (transition?.action) {
        await transition.action(context);
      }
    }

    return {
      finalState: context.currentState,
      history: context.history,
      data: context.data,
      success: context.currentState === 'finished',
    };
  }

  private findNextState(context: StateContext): StateType | null {
    for (const transition of this.transitions) {
      if (
        (transition.from === context.currentState || transition.from === '*') &&
        transition.condition(context)
      ) {
        return transition.to;
      }
    }
    return null;
  }

  addTransition(transition: StateTransition): void {
    this.transitions.push(transition);
  }
}

export const stateMachineReasoner = new StateMachineReasoner();
