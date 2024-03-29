export const localStorageMock = (function() {
    let store = {};
    
    return {
        getItem(key) {
            return store[key];
        },
        setItem(key, value) {
            store[key] = value;
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });