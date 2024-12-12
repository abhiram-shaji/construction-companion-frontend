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
                    <li><NavLink to="/Users" className={({ isActive }) => isActive ? 'active' : ''}>Users</NavLink></li>
                </ul>
            </nav>

            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            <h1>Welcome to Construction Companion</h1>
                            <section>
                                <h2>Estimates</h2>
                                <Estimates />
                            </section>
                            <section>
                                <h2>Budgets</h2>
                                <Budgets />
                            </section>
                            <section>
                                <h2>Tasks</h2>
                                <Tasks />
                            </section>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;