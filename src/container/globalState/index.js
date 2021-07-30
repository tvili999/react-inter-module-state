module.exports = container => (container
    .inject("globalState", () => {
        let __states = {};
        let __handlers = {};

        const fireHandlers = (store, ...args) => {
            for(const handler of (__handlers[store] || []))
                handler(...args);
        }

        const api = {
            set: (store, state) => api.mutate(store, (prevState) =>
                (typeof prevState == "object" && typeof state === "object") ? 
                    Object.assign(prevState, state) :
                    state
            ),
            mutate: async (store, mutator) => {
                __states[store] = await mutator(__states[store]);
                fireHandlers(store, __states[store], store);
            },
            get: (store) => __states[store],
            subscribe: (store, handler) => {
                if(!__handlers[store])
                    __handlers[store] = [];
                __handlers[store] = [...__handlers[store], handler];
            },
            unsubscribe: (store, handler) => {
                if(!__handlers[store])
                    return
                __handlers[store] = __handlers[store].filter(x => x !== handler);
            },
            subscribeOnce: (store, handler) => {
                const wrapperHandler = (...args) => {
                    const drop = handler(...args);
                    if(drop === false)
                        return;
                    api.unsubscribe(store, wrapperHandler);
                }
                api.subscribe(store, wrapperHandler);
            }
        }

        return api;
    })
)
