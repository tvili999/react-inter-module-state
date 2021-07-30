import React from "react";
import { withContainer } from "../ContainerContext";

class GlobalState extends React.Component {
    state = {
        apis: null,
        states: { }
    }

    stateChange = (state, store) => this.setState({ states: {
        ...this.state.states,
        [store]: state
    } });

    async componentDidMount() {
        if(!this.props.container)
            throw "ContainerProvider is not present";
        const globalState = await this.props.container.get("globalState");

        const stores = Array.isArray(this.props.store) ? this.props.store : [this.props.store];
        
        const apis = {};
        for(const store of stores) {
            apis[store] = {
                get state() {
                    return globalState.get(store);
                },
                set: (...args) => globalState.set(store, ...args),
                mutate: (...args) => globalState.mutate(store, ...args),
                subscribe: (...args) => globalState.subscribe(store, ...args),
                unsubscribe: (...args) => globalState.unsubscribe(store, ...args),
                subscribeOnce: (...args) => globalState.subscribeOnce(store, ...args)
            }

            apis[store].subscribe(this.stateChange);
        }

    
        this.setState({ apis });
    }

    componentWillUnmount() {
        for(const api of this.state.apis) 
            api.unsubscribe(this.stateChange);
    }

    render() {
        return this.state.apis && (
            this.props.children?.(this.state.apis)
        );
    }
}
GlobalState = withContainer(GlobalState);

const withGlobalState = (store, Component) => {
    const hoc = (props) => (
        <GlobalState store={store}>
            {states => <Component {...props} {...states}/>}
        </GlobalState>
    );
    hoc.displayName = "withGlobalState()";

    return hoc;
}

export { GlobalState, withGlobalState };

