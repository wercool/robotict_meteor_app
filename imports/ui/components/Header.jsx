import React from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Link, Route, Routes } from 'react-router-dom';

export const Header = () => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <header
                    className={[
                        'layout_header',
                        'noselect'
                    ].join(' ')}
                    style={theme.header || {}}
                >
                    <Routes>
                        <Route path="/" element={ <h2>visinumbers</h2> } />
                        <Route path="/settings" element={ 
                            <Link to="/">
                                <h2 style={(theme.link && theme.link.generic) || {}}>visinumbers</h2>
                            </Link>
                        } />
                    </Routes>

                    <div className="flex_expander"></div>
                        <Routes>
                            <Route path="/" element={ <h2>Dashboard</h2> } />
                            <Route path="/settings" element={ <h2>Settings</h2> } />
                        </Routes>
                    <div className="flex_expander"></div>

                    <Routes>
                        <Route path="/" element={ <Link to="/settings" className="link"><h2>⚙</h2></Link> } />
                        <Route path="/settings" element={ <Link to="/" className="link"><h2>⌂</h2></Link> } />
                    </Routes>
                </header>
            )}
        </ThemeContext.Consumer>
    );
};
