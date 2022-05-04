import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { SimpleDropDown } from '../elements/SimpleDropDown';
import { AppContext } from '../contexts/AppContext';

export const Footer = () => {
    const { state, dispatch } = useContext(AppContext);

    return (
        <ThemeContext.Consumer>
            {theme => (
                <footer
                    className={[
                        'layout_footer'
                    ].join(' ')}
                    style={theme.footer || {}}
                >
                    <div className="flex_expander"></div>
                    © Alexey Maistrenko from <a href="https://vedulabs.com/" target="_blank">VEduLabs</a> special for <a href="https://www.robotict.com/" target="_blank">RobotICT</a>
                    <div className="flex_expander"></div>
                    <SimpleDropDown
                        items={[
                            { label: 'default theme', value: 'default' },
                            { label: 'dark theme',    value: 'dark' }
                        ].map(item => ({ ...item, selected: item.value === state.theme.name}))}
                        onChange={event => dispatch({ type: 'theme_change', payload: event.target.value })}
                    />
                </footer>
            )}
        </ThemeContext.Consumer>
    );
};
