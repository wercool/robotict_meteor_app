import React, { useReducer } from 'react';

export const AppContext = React.createContext();

/**
 * Visinumbers application state reducer,
 * accessible globally over applicaiton
 * through the AppContext as `dispatch`
 * @param {*} state 
 * @param {*} action 
 */
const appStateReducer = (state, action) => {
  switch (action.type) {
    case 'theme_change':
        if (state.theme.name !== action.payload) {
            return {
                ...state,
                theme: {
                    name: action.payload,
                    loading: true
                },
            };
        } else {
            return state;
        }
    case 'theme_ready':
        return {
            ...state,
            theme: {
                ...action.payload,
                loading: false
            },
        };
    default:
      return state;
  }
}

export const AppContextProvider = ({...props}) => {
    /**
     * App global state
     */
    const [state, dispatch] = useReducer(appStateReducer, {
        // app UI theme
        theme: {
            // default UI theme name
            name: 'default',
            // theme is being loaded flag
            loading: true,
        }
    });

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            { props.children }
        </AppContext.Provider>
    );
};