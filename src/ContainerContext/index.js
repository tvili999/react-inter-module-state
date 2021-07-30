import React from "react";

const { Provider, Consumer } = React.createContext();

export const withContainer = (Component) => {
    const hoc = (props) => (
        <Consumer>
            {container => <Component {...props} container={container}/>}
        </Consumer>
    )

    hoc.displayName = "withContainer()";

    return hoc;
}

export const ContainerProvider = Provider;
export const ContainerConsumer = Consumer;
