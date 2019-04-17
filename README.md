# `@gitbook/unstated`

Simple state library for react application. It is based on [`unstated` by James Kyle](https://github.com/jamiebuilds/unstated).

## Installation

```
$ yarn add @gitbook/unstated
```

## Usage

```tsx
import { Container, useUnstated } from '@gitbook/unstated';

class Counter extends Container<{
    count: number
}> {
    state = {
        count: 0
    };

    increment() {
        this.setState({ count: this.state.count + 1 });
    }

    decrement() {
        this.setState({ count: this.state.count - 1 });
    }
}

function Counter() {
    const counter = useUnstated(Counter);

    return (
        <div>
            <button onClick={() => counter.decrement()}>-</button>
            <span>{counter.state.count}</span>
            <button onClick={() => counter.increment()}>+</button>
        </div>
    );
}

render(
    <Provider>
        <Counter />
    </Provider>,
    document.getElementById('root')
);
```

## API

### `useUnstated`

```ts
import { useUnstated } from '@gitbook/unstated';

useUnstated(
    C: ContainerConstructor,
    shouldUpdate?: (C: Container) => any
): Container
```

Hook to access a container and update the compontent each time the state is updated.

The `shouldUpdate` function can be used to prevent update of your component for certain updates of state. The result of the function will be shallowly compare to previous result.

### `useContainer`

```ts
import { useContainer } from '@gitbook/unstated';

useContainer(
    C: ContainerConstructor
): Container
```

Similar to `useUnstated` but the component is not updated when the state is updated. You can use this hook to access actions to modify the container.


## Credits

This module is based on [`unstated`](https://github.com/jamiebuilds/unstated). It started as a fork to add support for hooks.