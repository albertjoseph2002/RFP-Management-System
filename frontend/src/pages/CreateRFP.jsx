import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateRFP() {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [structuredData, setStructuredData] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/rfps', {
                description
            });
            setStructuredData(response.data.structuredData);
            alert('RFP created successfully!');
            navigate(`/rfp/${response.data._id}`);
        } catch (error) {
            console.error('Error creating RFP:', error);
            alert('Failed to create RFP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-rfp">
            <h2>Create New RFP</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Describe your procurement needs:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="10"
                        placeholder="Example: I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty."
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Create RFP'}
                </button>
            </form>

            {structuredData && (
                <div className="structured-preview">
                    <h3>Structured RFP Data:</h3>
                    <pre>{JSON.stringify(structuredData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default CreateRFP;
