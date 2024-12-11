import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Estimates from './components/Estimates';
import Budgets from './components/Budgets';
import Tasks from './components/Tasks';
import './Navigation.css';

const App = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
                    <li><NavLink to="/estimates" className={({ isActive }) => isActive ? 'active' : ''}>Estimates</NavLink></li>
                    <li><NavLink to="/budgets" className={({ isActive }) => isActive ? 'active' : ''}>Budgets</NavLink></li>
                    <li><NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>Tasks</NavLink></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/" element={<h1>Welcome to Construction Companion</h1>} />
                <Route path="/estimates" element={<Estimates />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </Router>
    );
};

export default App;
