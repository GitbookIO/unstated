import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { Container, ContainerConstructor } from './container';
import { StateContext } from './provider';

export type ContainersType<C extends Container> = Array<
    ContainerConstructor<C> | C
>;
export type ContainersInstance<
    Containers extends ContainersType<Container>
> = Container[];

/*
 * Get the state of containers.
 */
function useContainers<Containers extends ContainersType<Container>>(
    ...containers: Containers
): ContainersInstance<Containers> {
    const map = useContext(StateContext);
    if (map === null) {
        throw new Error('You must wrap your hook component with a <Provider>');
    }

    return useMemo(() => {
        return containers.map(ContainerItem => {
            let instance;
            if (
                typeof ContainerItem === 'object' &&
                ContainerItem instanceof Container
            ) {
                instance = ContainerItem;
            } else {
                instance = map.get(ContainerItem);

                if (!instance) {
                    instance = new ContainerItem();
                    map.set(ContainerItem, instance);
                }
            }
            return instance;
        });
    }, [map, ...containers]);
}

/*
 * Get the state of containers and listen to updates.
 */
function useUnstated<Containers extends ContainersType<Container>>(
    ...containers: Containers
): ContainersInstance<Containers> {
    const instances = useContainers(...containers);
    const setUpdates = useState(0)[1];
    const instancesRef = useRef([]);
    const unmountedRef = useRef(false);

    const unsubscribe = () => {
        instancesRef.current.forEach(container => {
            container.unsubscribe(onUpdate);
        });
    };

    const onUpdate = useCallback(() => {
        return new Promise(resolve => {
            if (!unmountedRef.current) {
                setUpdates(prev => prev + 1);
                resolve();
            } else {
                resolve();
            }
        });
    }, []);

    useEffect(() => {
        return () => {
            unmountedRef.current = true;
            unsubscribe();
        };
    }, []);

    // Return instances with listeners
    return useMemo(() => {
        unsubscribe();

        instances.forEach(instance => {
            instance.unsubscribe(onUpdate);
            instance.subscribe(onUpdate);
        });

        instancesRef.current = instances;
        return instancesRef.current;
    }, instances);
}

export { useContainers, useUnstated };
