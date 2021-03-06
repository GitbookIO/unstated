import * as React from 'react';
import renderer from 'react-test-renderer';
import { Container, Provider, Subscribe, useUnstated } from '../src/';

function render(element: React.ReactNode) {
    return renderer.create(element).toJSON();
}

async function click({ children = [] }, id) {
    renderer.act(() => {
        const el: any = children.find(({ props = {} }) => props.id === id);
        el.props.onClick();
    });
}

class CounterContainer extends Container<{ count: number }> {
    public state = { count: 0, offset: 0 };
    public increment(amount = 1) {
        this.setState({ count: this.state.count + amount });
    }
    public decrement(amount = 1) {
        this.setState({ count: this.state.count - amount });
    }
    public setOffset(offset) {
        this.setState({ offset });
    }
}

function Counter() {
    return (
        <Subscribe to={CounterContainer}>
            {counter => (
                <div>
                    <span>{counter.state.count}</span>
                    <button id="decrement" onClick={() => counter.decrement()}>
                        -
                    </button>
                    <button id="increment" onClick={() => counter.increment()}>
                        +
                    </button>
                </div>
            )}
        </Subscribe>
    );
}

function CounterWithUse() {
    const counter = useUnstated(CounterContainer);
    return (
        <div>
            <span>{counter.state.count}</span>
            <button id="decrement" onClick={() => counter.decrement()}>
                -
            </button>
            <button id="increment" onClick={() => counter.increment()}>
                +
            </button>
        </div>
    );
}

function CounterWithShouldUpdate() {
    const counter = useUnstated(
        CounterContainer,
        instance => instance.state.offset
    );
    return (
        <div>
            <span id="offset-text">
                {counter.state.count + counter.state.offset}
            </span>
            <button id="reset" onClick={() => counter.setOffset(0)}>
                reset
            </button>
        </div>
    );
}

test('should incresase/decrease state counter in container', async () => {
    const counter = new CounterContainer();
    const tree = render(
        <Provider inject={[counter]}>
            <Counter />
        </Provider>
    );

    expect(counter.state.count).toBe(0);

    await click(tree, 'increment');
    expect(counter.state.count).toBe(1);

    await click(tree, 'decrement');
    expect(counter.state.count).toBe(0);
});

test('should incresase/decrease state counter in container using useUnstated', async () => {
    const counter = new CounterContainer();
    const tree = render(
        <Provider inject={[counter]}>
            <CounterWithUse />
        </Provider>
    );
    expect(counter.state.count).toBe(0);

    await click(tree, 'increment');
    expect(counter.state.count).toBe(1);

    await click(tree, 'decrement');
    expect(counter.state.count).toBe(0);
});

test('should remove subscriber listeners if component is unmounted', () => {
    const counter = new CounterContainer();
    const tree = renderer.create(
        <Provider inject={[counter]}>
            <Counter />
        </Provider>
    );
    const testInstance = tree.root.findByType(Subscribe)._fiber.stateNode;

    expect(counter.listeners.size).toBe(1);

    tree.unmount();

    expect(counter.listeners.size).toBe(0);
});

test('should remove subscriber listeners if component is unmounted with useUnstated', () => {
    const counter = new CounterContainer();
    const tree = renderer.create(
        <Provider inject={[counter]}>
            <CounterWithUse />
        </Provider>
    );
    expect(() => tree.root.findByType(CounterWithUse)).not.toThrow();
    expect(counter.listeners.size).toBe(1);

    counter.increment();

    tree.unmount();
    expect(() => tree.root.findByType(CounterWithUse)).toThrowError(
        "Can't access .root on unmounted test renderer"
    );
    expect(counter.listeners.size).toBe(0);
});

test('should throw an error if <Subscribe> component is not wrapper with <Provider>', () => {
    spyOn(console, 'error');
    expect(() => render(<Counter />)).toThrowError(
        'You must wrap your hook component with a <Provider>'
    );
});

test('should throw an error if component using useUnstated is not wrapper with <Provider>', () => {
    spyOn(console, 'error');
    expect(() => render(<CounterWithUse />)).toThrowError(
        'You must wrap your hook component with a <Provider>'
    );
});

test('should not re-render if shouldUpdate has not changed', () => {
    const counter = new CounterContainer();
    const tree = renderer.create(
        <Provider inject={[counter]}>
            <CounterWithShouldUpdate />
        </Provider>
    );

    renderer.act(() => {
        const el: any = tree
            .toJSON()
            .children.find(({ props = {} }) => props.id === 'offset-text');
        expect(el.children).toEqual(['0']);
    });

    // This update should not trigger a re-render
    renderer.act(() => {
        counter.increment();
    });

    renderer.act(() => {
        const el: any = tree
            .toJSON()
            .children.find(({ props = {} }) => props.id === 'offset-text');
        expect(el.children).toEqual(['0']);
    });

    // This update should trigger a re-render
    renderer.act(() => {
        counter.setOffset(10);
    });

    renderer.act(() => {
        const el: any = tree
            .toJSON()
            .children.find(({ props = {} }) => props.id === 'offset-text');
        expect(el.children).toEqual(['11']);
    });
});
