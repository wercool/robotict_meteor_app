import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard';
import { Settings    } from '../components/settings/Settings';

export const ContentRouter = () => {
    return (
        <Routes>
            <Route path="/" element={ <Dashboard /> } />
            <Route path="/settings" element={ <Settings/> } />
        </Routes>
    );
};
