import React from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { ContentRouter } from '../routers/ContentRouter';

export const Content = () => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <section
                    className="layout_content"
                    style={theme.content || {}}
                >
                    <ContentRouter/>
                </section>
            )}
        </ThemeContext.Consumer>
    );
};
