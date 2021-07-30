const configuration = require("./index");
const container = require("js-container");
const createModuleManager = () => new Promise(resolve => container(configuration,
    ({run}) => run(async ({ get }) => resolve(await get("moduleManager")))
));

test('passes', async () => { })

test('module manager gets created', async () => {
    const moduleManager = await createModuleManager();
    expect(moduleManager).toBeTruthy();
})

test('add module works', async () => {
    const moduleManager = await createModuleManager();
    
    const module = Symbol();
    const moduleName = "module";

    moduleManager.register(moduleName, module);
    const result = await moduleManager.get(moduleName);
    expect(result).toBe(module);
})

test('add module twice throws', async () => {
    const moduleManager = await createModuleManager();
    
    const module = Symbol();
    const moduleName = "module";

    moduleManager.register(moduleName, module);
    expect(() => {
        moduleManager.register(moduleName, module);
    }).toThrow();
})

test('wait for module to be added', async () => {
    const moduleManager = await createModuleManager();

    const module = Symbol();
    const moduleName = "module";

    const result = moduleManager.get(moduleName);

    moduleManager.register(moduleName, module);

    expect(await result).toBe(module);
})
