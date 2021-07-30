const configuration = require("./index");
const container = require("js-container");
const createStore = () => new Promise(resolve => container(configuration,
    ({run}) => run(async ({ get }) => resolve(await get("globalState")))
));

test('passes', () => {});

test('store gets created', async () => {
    const store = await createStore();
    expect(store).toBeTruthy();
})

test('mutator mutates a store', async () => {
    const store1 = "store1";
    const value = "newValue";

    const store = await createStore();

    await store.mutate(store1, async () => value);
    const state = store.get(store1);

    expect(state).toBe(value);
});

test('mutator fires an event', async () => {
    const store1 = "store1";
    const value = "newValue";

    const store = await createStore();

    const handler = jest.fn();
    store.subscribe(store1, handler);

    await store.mutate(store1, async () => value);

    expect(handler.mock.calls.length).toBe(1);
    expect(handler.mock.calls[0][0]).toBe(value);
});

test('mutator does not fire a wrong store', async () => {
    const store1 = "store1";
    const store2 = "store2";
    const value = "newValue";

    const store = await createStore();

    const handler1 = jest.fn();
    store.subscribe(store1, handler1);

    const handler2 = jest.fn();
    store.subscribe(store2, handler2);

    await store.mutate(store1, async () => value);

    expect(handler1.mock.calls.length).toBe(1);
    expect(handler1.mock.calls[0][0]).toBe(value);

    expect(handler2.mock.calls.length).toBe(0);
});

test('setter sets a store', async () => {
    const store1 = "store1";
    const value = "newValue";

    const store = await createStore();

    await store.set(store1, value);
    const state = store.get(store1);

    expect(state).toBe(value);
});

test('unsubscribe', async () => {
    const store1 = "store1";
    const value = "newValue";

    const store = await createStore();

    const handler = jest.fn();
    store.subscribe(store1, handler);

    await store.set(store1, value);
    store.unsubscribe(store1, handler);
    await store.set(store1, value);

    expect(handler.mock.calls.length).toBe(1);
});

test('subscribeOnce', async () => {
    const store1 = "store1";
    const value = "newValue";

    const store = await createStore();

    const handler = jest.fn();
    store.subscribeOnce(store1, handler);

    await store.set(store1, value);
    await store.set(store1, value);

    expect(handler.mock.calls.length).toBe(1);
});

test('subscribeOnce return false', async () => {
    const store1 = "store1";
    const value = "newValue";

    const store = await createStore();

    const handler = jest.fn(() =>  handler.mock.calls.length > 1 ? true : false);
    store.subscribeOnce(store1, handler);

    await store.set(store1, value);
    await store.set(store1, value);
    await store.set(store1, value);

    expect(handler.mock.calls.length).toBe(2);
});
