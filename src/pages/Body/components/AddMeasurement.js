import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Ip from '../../../config/Ip';
import "./ActualMeasurements.css"
import {useNavigate} from "react-router-dom";

function ActualMeasurements() {
    // State to store measurements data
    const [measurements, setMeasurements] = useState([]);
    const [newMeasurement, setNewMeasurement] = useState({ date: '', waist: '', chest: '', bicep: '', thigh: '' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        setNewMeasurement({ ...newMeasurement, [e.target.name]: e.target.value });
    }


    // Updated to perform the actual addition
    const confirmAddMeasurement = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const currentDate = new Date().toISOString().split('T')[0];

            // Create a new measurement object for the request
            const measurementToAdd = {
                ...newMeasurement,
                date: currentDate
            };

            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.post(`${Ip}/api/measurements/`, measurementToAdd, { headers });
            setMeasurements([...measurements, response.data]);

            // Reset the form fields except for the date
            setNewMeasurement({ date: currentDate, waist: '', chest: '', bicep: '', thigh: '' });
            navigate("/body/measurements");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.error || "An error occurred.");
            }else
            {
                console.error("Error adding measurement: ", error);

            }
        }
        setIsAddModalOpen(false);
    };

    const cancelAdd = () => {
        setIsAddModalOpen(false);
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        setIsAddModalOpen(true);
    };




    return (
        <div className="measurements-container p-4">
            <div className="w-full flex justify-start">
                <button className="ml-10 w-30 p-3 rounded text-white font-semibold bg-gray-500" onClick={()=> navigate("/body/measurements")}>Back to measurements</button>
            </div>

            <form onSubmit={handleSubmit2} className="mt-8 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4">Add New Measurement</h3>
                <div className="w-full max-w-md">


                    <div>
                        <label htmlFor="waist" className="block text-sm font-medium text-gray-700">Waist (in cm)</label>
                        <input type="number" id="waist" name="waist" value={newMeasurement.waist} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="chest" className="block text-sm font-medium text-gray-700">Chest (in cm)</label>
                        <input type="number" id="chest" name="chest" value={newMeasurement.chest} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="bicep" className="block text-sm font-medium text-gray-700">Bicep (in cm)</label>
                        <input type="number" id="bicep" name="bicep" value={newMeasurement.bicep} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="thigh" className="block text-sm font-medium text-gray-700">Thigh (in cm)</label>
                        <input type="number" id="thigh" name="thigh" value={newMeasurement.thigh} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4">
                    Add Measurement
                </button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            </form>




            {isAddModalOpen && (
                <div className="modal">


                    <div className="modal-content">
                        <div className="modal-content p-6 bg-white rounded-lg shadow-lg">
                            <h4 className="text-lg font-semibold mb-4">Confirm New Measurement</h4>
                            <p>Are you sure you want to add this measurement?</p>

                            <ul>
                                <li>Waist: {newMeasurement.waist}</li>
                                <li>Chest: {newMeasurement.chest}</li>
                                <li>Bicep: {newMeasurement.bicep}</li>
                                <li>Thigh: {newMeasurement.thigh}</li>
                            </ul>

                            <div className="flex justify-end mt-4">
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={cancelAdd}>No</button>
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={confirmAddMeasurement}>Yes</button>
                            </div>
                        </div>
                    </div>

                </div>

            )}


        </div>
    );


};

export default ActualMeasurements;
