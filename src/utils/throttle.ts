
export const throttle = (fn: Function, delay: number): Function => {
    /**
     * @fn is the handler to executed
     * @delay millseconds to be throttled
     */
    let valid = true
    return function (...args: any) {
        if (!valid) {
            // sleeping time, fn would not be executed.
            return
        }

        // working time, handler would set it's state to invalid.
        valid = false
        setTimeout(() => {
            fn(...args)
            valid = true;
        }, delay)
    }
}