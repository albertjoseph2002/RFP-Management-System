import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VendorManagement() {
    const [vendors, setVendors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactPerson: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vendors');
            setVendors(response.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/vendors', formData);
            alert('Vendor added successfully!');
            setFormData({ name: '', email: '', contactPerson: '', phone: '', address: '' });
            setShowForm(false);
            fetchVendors();
        } catch (error) {
            console.error('Error adding vendor:', error);
            alert('Failed to add vendor');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                await axios.delete(`http://localhost:5000/api/vendors/${id}`);
                fetchVendors();
            } catch (error) {
                console.error('Error deleting vendor:', error);
            }
        }
    };

    return (
        <div className="vendor-management">
            <h2>Vendor Management</h2>

            <button onClick={() => setShowForm(!showForm)} className="add-btn">
                {showForm ? 'Cancel' : 'Add New Vendor'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="vendor-form">
                    <input
                        type="text"
                        placeholder="Vendor Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Contact Person"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    <button type="submit">Add Vendor</button>
                </form>
            )}

            <div className="vendor-list">
                {vendors.map(vendor => (
                    <div key={vendor._id} className="vendor-card">
                        <h3>{vendor.name}</h3>
                        <p>Email: {vendor.email}</p>
                        <p>Contact: {vendor.contactPerson}</p>
                        <p>Phone: {vendor.phone}</p>
                        <button onClick={() => handleDelete(vendor._id)} className="delete-btn">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VendorManagement;
