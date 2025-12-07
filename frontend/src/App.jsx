import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateRFP from './pages/CreateRFP';
import RFPDetail from './pages/RFPDetail';
import VendorManagement from './pages/VendorManagement';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <h1>RFP Management System</h1>
                    <ul>
                        <li><Link to="/">Dashboard</Link></li>
                        <li><Link to="/create-rfp">Create RFP</Link></li>
                        <li><Link to="/vendors">Vendors</Link></li>
                    </ul>
                </nav>

                <div className="container">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/create-rfp" element={<CreateRFP />} />
                        <Route path="/rfp/:id" element={<RFPDetail />} />
                        <Route path="/vendors" element={<VendorManagement />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
