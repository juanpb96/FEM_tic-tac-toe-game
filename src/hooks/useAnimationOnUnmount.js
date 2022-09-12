import { useEffect, useRef, useState } from 'react';

export const useAnimationOnUnmount = (setMount) => {
    const [isComponentSet, setIsComponentSet] = useState(false);
    const componentRef = useRef();

    const setComponentToUnmount = (ref) => {
        componentRef.current = ref;
        setIsComponentSet(true);
    };

    useEffect(() => {
        if (componentRef.current) {
            componentRef.current.addEventListener('animationend', () => {
                setMount(false);
            }, { once: true });
        }
    }, [isComponentSet]);

    return {
        setComponentToUnmount
    };
}
