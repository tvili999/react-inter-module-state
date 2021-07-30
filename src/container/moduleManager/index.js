module.exports = container => (container
    .inject("moduleManager", () => {
        let __modules = {};
        let __registerHandlers = {};

        const api = {
            register: (name, mod) => {
                if(__modules[name])
                    throw `Module '${name}' already registered.`;
                __modules[name] = mod;

                for(const handler of (__registerHandlers[name] || []))
                    handler(__modules[name]);

                delete __registerHandlers[name];
            },
            get: (name) => new Promise(resolve => {
                if(__modules[name]) {
                    resolve(__modules[name]);
                    return;
                }

                __registerHandlers[name] = [...(__registerHandlers[name] || []), resolve];
            })
        }

        return api;
    })
)