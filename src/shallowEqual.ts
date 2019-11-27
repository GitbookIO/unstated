// From https://github.com/reduxjs/react-redux/blob/3e53ff96ed10f71c21346f08823e503df724db35/src/utils/shallowEqual.js
const hasOwn = Object.prototype.hasOwnProperty;

function is(x: any, y: any): boolean {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    }
    return false;
}

export function shallowEqual(objA: any, objB: any): boolean {
    if (is(objA, objB)) {
        return true;
    }

    if (
        typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null
    ) {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    for (const keyA in keysA) {
        if (!hasOwn.call(objB, keyA) || !is(objA[keyA], objB[keyA])) {
            return false;
        }
    }

    return true;
}
