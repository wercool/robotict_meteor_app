import React, { createContext, useContext, lazy, Suspense, useEffect } from 'react';
import { Tracker } from 'meteor/tracker';
import { AppContext } from './AppContext';
import { ThemesCollection } from '../../api/themes';
const SimpleSpinner = lazy(() => import('../widgets/spinners/simple-spinner/SimpleSpinner'));

export const ThemeContext = createContext();

export const ThemeProvider = ({...props}) => {
    const { state, dispatch } = useContext(AppContext);

    useEffect(() => {
        Tracker.autorun(() => {
            const theme = ThemesCollection.findOne({ name: state.theme.name });
            if (theme) {
                dispatch({ type: 'theme_ready', payload: theme });
            }
        });
    }, [state.theme.name]);

    if (!state.theme.loading) {
        return (
            <ThemeContext.Provider value={state.theme}>
                {props.children}
            </ThemeContext.Provider>
        );
    } else {
        return (
            <Suspense fallback={<div id="suspense">loading...</div>}>
                <SimpleSpinner/>
            </Suspense>
        );
    }

};