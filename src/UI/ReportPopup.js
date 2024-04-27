import React, { useState } from 'react';
import './ReportPopup.css'; // Add your CSS for styling the pop-up

const ReportPopup = ({ shelterNumber, onClose, onSubmit }) => {
    const [reportText, setReportText] = useState('');

    const handleInputChange = (event) => {
        setReportText(event.target.value.slice(0, 30)); // Limiting input to 30 characters
    };

    const handleSubmit = () => {
        onSubmit(reportText);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="report-popup-container">
            <div className="report-popup">
                <h2>Shelter Number: {shelterNumber}</h2>
                <textarea
                    className="report-text"
                    value={reportText}
                    onChange={handleInputChange}
                    maxLength={30}
                    placeholder="Enter your report here..."
                />
                <div className="button-container">
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ReportPopup;
