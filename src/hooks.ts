import {
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { Container, ContainerConstructor } from './container';
import { StateContext } from './provider';
import { shallowEqual } from './shallowEqual';

export type ContainerType<C extends Container> = ContainerConstructor<C> | C;
type ShouldUpdateFn<C, R> = (c: C) => R;

/*
 * Get the state of containers.
 */
export function useContainer<C extends Container>(
    ContainerItem: ContainerType<C>
): C {
    const map = useContext(StateContext);
    if (map === null) {
        throw new Error('You must wrap your hook component with a <Provider>');
    }

    return useMemo(() => {
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
    }, [map, ContainerItem]);
}

/*
 * Get the state of containers and listen to updates.
 */
export function useUnstated<C extends Container, UpdateCriteria = []>(
    ContainerItem: ContainerType<C>,
    /*
     * Function to determine for which criteria the component should be updated.
     * When a boolean is passed, it always update (or never).
     */
    shouldUpdate?: ShouldUpdateFn<C, UpdateCriteria>
): C {
    const instance = useContainer(ContainerItem);
    const setUpdates = useState(0)[1];
    const latestStateRef = useRef<object | null>(null)
    const updateCriteriaRef = useRef<UpdateCriteria | null>(null);
    const unmountedRef = useRef(false);

    // Allow shouldUpdate to be a changing arrow function
    const shouldUpdateRef = useRef<
        ShouldUpdateFn<C, UpdateCriteria> | undefined
    >(shouldUpdate);
    shouldUpdateRef.current = shouldUpdate;

    useEffect(() => {
        const computeShouldRender = () => {
            // When no shouldUpdate, we just compare the raw reference state
            if (!shouldUpdateRef.current) {
                if (latestStateRef.current !== instance.state) {
                    latestStateRef.current = instance.state;
                    return true;
                }
                return false;
            }

            const result = shouldUpdateRef.current(instance);
            const isEqual = !shallowEqual(updateCriteriaRef.current, result);
            updateCriteriaRef.current = result;
            return isEqual;
        };

        const onUpdate = () => {
            if (!computeShouldRender()) {
                return;
            }
            if (!unmountedRef.current) {
                setUpdates(prev => prev + 1);
            }
        };

        instance.subscribe(onUpdate);

        // Between render and useEffect, it may have changed
        onUpdate();

        return () => {
            unmountedRef.current = true;
            instance.unsubscribe(onUpdate);
        };
    }, [instance]);

    latestStateRef.current = instance.state;
    return instance
}
