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
    const [counter] = useUnstated(Counter);

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

## Credits

This module is based on [`unstated`](https://github.com/jamiebuilds/unstated). It started as a fork to add support for hooks.