import React from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Content } from './components/Content';
import { BrowserRouter } from 'react-router-dom';

export const RootLayout = () => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <div
                    id="root_layout"
                    className="root_layout"
                    style={theme.root_layout || {}}
                >
                    <BrowserRouter>
                        <Header/>
                        <Content/>
                        <Footer/>
                    </BrowserRouter>
                </div>
            )}
        </ThemeContext.Consumer>
    );
};
