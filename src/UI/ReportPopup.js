import React, { useState } from 'react';
import './ReportPopup.css';
import axios from 'axios';


const ReportPopup = ({ shelterNumber, onClose, onSubmit, report, refreshReports }) => {

    const [reportText, setReportText] = useState(report ? report : '');

    const handleInputChange = (event) => {
        setReportText(event.target.value.slice(0, 30));
    };

    /*SUBMIT REPORT */
    const handleSubmit = async () => {
        try {
            if (report === null) {
                await axios.post('http://localhost:3000/api/reports', { shelterNum: shelterNumber, report: reportText });
            } else {
                await axios.put(`http://localhost:3000/api/reports/${shelterNumber}`, { report: reportText });
            }
            onSubmit(reportText);
            refreshReports(); // Refresh reports after submission
            onClose();
        } catch (error) {
            console.error('Error submitting report:', error);
        }
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
