import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [rfps, setRfps] = useState([]);

    useEffect(() => {
        fetchRFPs();
    }, []);

    const fetchRFPs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rfps');
            setRfps(response.data);
        } catch (error) {
            console.error('Error fetching RFPs:', error);
        }
    };

    return (
        <div className="dashboard">
            <h2>All RFPs</h2>
            <div className="rfp-list">
                {rfps.map(rfp => (
                    <div key={rfp._id} className="rfp-card">
                        <h3>{rfp.title}</h3>
                        <p>Status: <span className={`status-${rfp.status}`}>{rfp.status}</span></p>
                        <p>Budget: ${rfp.structuredData.budget?.toLocaleString()}</p>
                        <p>Created: {new Date(rfp.createdAt).toLocaleDateString()}</p>
                        <Link to={`/rfp/${rfp._id}`}>
                            <button>View Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
