import React from 'react';

/**
 * This context will provide global application state.
 * A context provides some data to all children in the app, no matter how deep.
 * see https://fr.reactjs.org/docs/context.html#api
 * @type {React.Context<Object>}
 */
const AppStateContext = React.createContext();

export const useAppStateContext = () => {
	return React.useContext(AppStateContext);
};

/**
 * Values are passed to this context via the AppStateProvider, in the 'value' prop.
 * @type {React.Provider<Object>}
 */
export const AppStateProvider = AppStateContext.Provider;
