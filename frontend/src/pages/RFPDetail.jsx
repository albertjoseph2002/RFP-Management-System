import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function RFPDetail() {
    const { id } = useParams();
    const [rfp, setRfp] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [comparison, setComparison] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        fetchRFP();
        fetchVendors();
        fetchProposals();
    }, [id]);

    const fetchRFP = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/rfps/${id}`);
            setRfp(response.data);
        } catch (error) {
            console.error('Error fetching RFP:', error);
        }
    };

    const fetchVendors = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vendors');
            setVendors(response.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    const fetchProposals = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/rfps/${id}/proposals`);
            setProposals(response.data);
        } catch (error) {
            console.error('Error fetching proposals:', error);
        }
    };

    const handleSendRFP = async () => {
        if (selectedVendors.length === 0) {
            alert('Please select at least one vendor');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/rfps/${id}/send`, {
                vendorIds: selectedVendors
            });
            alert('RFP sent successfully!');
            fetchRFP();
        } catch (error) {
            console.error('Error sending RFP:', error);
            alert('Failed to send RFP');
        }
    };

    const handleCompare = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/rfps/${id}/comparison`);
            setComparison(response.data);
            setActiveTab('comparison');
        } catch (error) {
            console.error('Error generating comparison:', error);
            alert('Failed to generate comparison');
        }
    };

    if (!rfp) return <div>Loading...</div>;

    return (
        <div className="rfp-detail">
            <h2>{rfp.title}</h2>

            <div className="tabs">
                <button
                    className={activeTab === 'details' ? 'active' : ''}
                    onClick={() => setActiveTab('details')}
                >
                    Details
                </button>
                <button
                    className={activeTab === 'send' ? 'active' : ''}
                    onClick={() => setActiveTab('send')}
                >
                    Send to Vendors
                </button>
                <button
                    className={activeTab === 'proposals' ? 'active' : ''}
                    onClick={() => setActiveTab('proposals')}
                >
                    Proposals ({proposals.length})
                </button>
                <button
                    className={activeTab === 'comparison' ? 'active' : ''}
                    onClick={() => setActiveTab('comparison')}
                >
                    Comparison
                </button>
            </div>

            {activeTab === 'details' && (
                <div className="tab-content">
                    <h3>Original Description:</h3>
                    <p>{rfp.description}</p>

                    <h3>Structured Data:</h3>
                    <div className="structured-data">
                        <p><strong>Budget:</strong> ${rfp.structuredData.budget?.toLocaleString()}</p>
                        <p><strong>Delivery Deadline:</strong> {rfp.structuredData.deliveryDeadline}</p>
                        <p><strong>Payment Terms:</strong> {rfp.structuredData.paymentTerms}</p>
                        <p><strong>Warranty:</strong> {rfp.structuredData.warrantyRequirements}</p>

                        <h4>Items:</h4>
                        <ul>
                            {rfp.structuredData.items?.map((item, idx) => (
                                <li key={idx}>
                                    {item.quantity}x {item.name} - {item.specifications}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'send' && (
                <div className="tab-content">
                    <h3>Select Vendors to Send RFP:</h3>
                    <div className="vendor-selection">
                        {vendors.map(vendor => (
                            <label key={vendor._id} className="vendor-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedVendors.includes(vendor._id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedVendors([...selectedVendors, vendor._id]);
                                        } else {
                                            setSelectedVendors(selectedVendors.filter(id => id !== vendor._id));
                                        }
                                    }}
                                />
                                <div>
                                    <strong>{vendor.name}</strong>
                                    <p>{vendor.email}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <button onClick={handleSendRFP} className="send-btn">
                        Send RFP to Selected Vendors
                    </button>
                </div>
            )}

            {activeTab === 'proposals' && (
                <div className="tab-content">
                    <h3>Received Proposals:</h3>
                    {proposals.length === 0 ? (
                        <p>No proposals received yet. Check your email inbox for vendor responses.</p>
                    ) : (
                        <div className="proposals-list">
                            {proposals.map(proposal => (
                                <div key={proposal._id} className="proposal-card">
                                    <h4>{proposal.vendorId.name}</h4>
                                    <p><strong>Total Amount:</strong> ${proposal.parsedData.totalAmount?.toLocaleString()}</p>
                                    <p><strong>Delivery:</strong> {proposal.parsedData.deliveryTime}</p>
                                    <p><strong>Payment Terms:</strong> {proposal.parsedData.paymentTerms}</p>
                                    <p><strong>Warranty:</strong> {proposal.parsedData.warranty}</p>

                                    <h5>Items:</h5>
                                    <ul>
                                        {proposal.parsedData.items?.map((item, idx) => (
                                            <li key={idx}>
                                                {item.quantity}x {item.name} - ${item.unitPrice} each = ${item.totalPrice}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                    {proposals.length > 0 && (
                        <button onClick={handleCompare} className="compare-btn">
                            Generate AI Comparison
                        </button>
                    )}
                </div>
            )}

            {activeTab === 'comparison' && comparison && (
                <div className="tab-content">
                    <h3>AI-Powered Proposal Comparison</h3>

                    <div className="recommendation">
                        <h4>🏆 Recommended Vendor</h4>
                        <p><strong>{comparison.aiAnalysis.comparisonMatrix.find(v => v.vendorId === comparison.aiAnalysis.recommendation)?.vendorName}</strong></p>
                        <p>{comparison.aiAnalysis.reasoning}</p>
                    </div>

                    <h4>Detailed Comparison:</h4>
                    <div className="comparison-matrix">
                        {comparison.aiAnalysis.comparisonMatrix.map(vendor => (
                            <div key={vendor.vendorId} className="vendor-comparison">
                                <h5>{vendor.vendorName} - Score: {vendor.score}/100</h5>

                                <div className="scores">
                                    <div>Price: {vendor.priceScore}/100</div>
                                    <div>Delivery: {vendor.deliveryScore}/100</div>
                                    <div>Terms: {vendor.termsScore}/100</div>
                                    <div>Completeness: {vendor.completenessScore}/100</div>
                                </div>

                                <div className="pros-cons">
                                    <div>
                                        <strong>Pros:</strong>
                                        <ul>{vendor.pros.map((pro, i) => <li key={i}>{pro}</li>)}</ul>
                                    </div>
                                    <div>
                                        <strong>Cons:</strong>
                                        <ul>{vendor.cons.map((con, i) => <li key={i}>{con}</li>)}</ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RFPDetail;
