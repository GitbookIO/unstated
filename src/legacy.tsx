import * as React from 'react';
import { Container } from './container';
import { ContainersInstance, ContainersType, useUnstated } from './hooks';

/*
 * This component is deprecated and should not be used.
 * You should use the hooks instead.
 */
function Subscribe<Containers extends ContainersType<Container>>(props: {
    to: Containers;
    children: (
        ...instances: ContainersInstance<Containers>
    ) => React.ReactElement;
}): React.ReactElement {
    const { to, children } = props;
    const instances = useUnstated(...to);

    return children(...instances);
}

export { Subscribe };
