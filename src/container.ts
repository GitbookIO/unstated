import { unstable_batchedUpdates } from 'react-dom';

const batchUpdates =
    unstable_batchedUpdates ||
    ((callback: () => void) => {
        callback();
    });

type Listener = () => void;

// Type interface for the constructor of a container
export type ContainerConstructor<C extends Container> = new () => C;

// Base class for all container
class Container<State = {}> {
    public state: State;
    public listeners: Map<Listener, true> = new Map();

    public setState(
        updater: Partial<State> | ((prevState: State) => Partial<State> | null),
        callback?: () => void
    ): Promise<void> {
        const promise = new Promise(resolve => {
            const nextState =
                typeof updater === 'function' ? updater(this.state) : updater;

            if (nextState == null) {
                resolve();
                return;
            }

            this.state = Object.assign({}, this.state, nextState);

            batchUpdates(() => {
                this.listeners.forEach((value, listener) => {
                    listener();
                });
                resolve();
            });
        });

        return promise.then(() => {
            if (callback) {
                callback();
            }
        });
    }

    public subscribe(fn: Listener) {
        this.listeners.set(fn, true);
    }

    public unsubscribe(fn: Listener) {
        this.listeners.delete(fn);
    }
}

export { Container };
