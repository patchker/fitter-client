import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Ip from '../../../config/Ip';
import "./ActualMeasurements.css"
import {useNavigate} from "react-router-dom";

function ActualMeasurements() {
    // State to store measurements data
    const [measurements, setMeasurements] = useState([]);
    const [newMeasurement, setNewMeasurement] = useState({ date: '', waist: '', chest: '', bicep: '', thigh: '' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [measurementToDelete, setMeasurementToDelete] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTodayMeasured, setIsTodayMeasured] = useState(false);

    const navigate = useNavigate();

    const requestDelete = (measurementId) => {
        setIsDeleteModalOpen(true);
        setMeasurementToDelete(measurementId);
    };

    // Updated to perform the actual deletion
    const confirmDelete = async () => {
        if (measurementToDelete != null) {
            try {
                const token = localStorage.getItem("access_token");
                const headers = { Authorization: `Bearer ${token}` };
                await axios.delete(`${Ip}/api/measurements/${measurementToDelete}/`, { headers });
                setMeasurements(measurements.filter(measurement => measurement.id !== measurementToDelete));
            } catch (error) {
                console.error("Error deleting measurement: ", error);
            }
        }
        setIsDeleteModalOpen(false);
        setMeasurementToDelete(null);
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setMeasurementToDelete(null);
    };

    const handleInputChange = (e) => {
        setNewMeasurement({ ...newMeasurement, [e.target.name]: e.target.value });
    };

    // Updated to show the add modal
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsAddModalOpen(true);
    };
    // Fetch measurements data from Django backend on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access_token"); // Replace with your actual token key
                const headers = {
                    Authorization: `Bearer ${token}`
                };
                const response = await axios.get(`${Ip}/api/measurements/`, { headers });
                console.log(response.data)

                setMeasurements(response.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {

        const currentDate = new Date().toISOString().split('T')[0];
        const todayMeasurementExists = measurements.some(measurement => measurement.date === currentDate);
        setIsTodayMeasured(todayMeasurementExists);
        console.log(currentDate)
        console.log(todayMeasurementExists)
    }, [measurements]);


    const confirmAddMeasurement = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.post(`${Ip}/api/measurements/`, newMeasurement, { headers });
            setMeasurements([...measurements, response.data]);
            setNewMeasurement({ date: '', waist: '', chest: '', bicep: '', thigh: '' }); // Reset form
        } catch (error) {
            console.error("Error adding measurement: ", error);
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


    const deleteMeasurement = async (measurementId) => {
        if (window.confirm("Are you sure you want to delete this measurement?")) {
            try {

                const token = localStorage.getItem("access_token");
                const headers = { Authorization: `Bearer ${token}` };
                await axios.delete(`${Ip}/api/measurements/${measurementId}/`, { headers });

                // Update the state to reflect the deletion
                setMeasurements(measurements.filter(measurement => measurement.id !== measurementId));
            } catch (error) {
                console.error("Error deleting measurement: ", error);
            }
        }
    };

    return (
        <div className="measurements-container p-4">
            <h1 className="text-2xl font-semibold">Historia pomiarów</h1>
            <div className="w-full flex justify-end relative ">
                <div className="relative">
                    <button className={`mr-20 w-30 p-3 rounded text-white font-semibold ${isTodayMeasured ? 'bg-gray-400' : 'bg-emerald-500'}`}
                            disabled={isTodayMeasured}
                            onClick={() => navigate("/addmeasurement")}>
                        Add Measurement
                    </button>
                    {isTodayMeasured && (
                        <div className="tooltip-text">There is already a record for today</div>
                    )}
                </div>
            </div>


            {measurements.length > 0 ? (
                    <div className=" flex flex-col justify-center items-center ">
                <div className="w-full max-w-[800px]">
                    {measurements.map((measurement, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-4 m-2 rounded-lg shadow-md">
                            <div>
                                <span className="text-gray-700 text-sm md:text-base mr-2">{measurement.date}</span>
                                <span className="text-gray-700 text-sm md:text-base mr-2">Waist: {measurement.waist}</span>
                                <span className="text-gray-700 text-sm md:text-base mr-2">Chest: {measurement.chest}</span>
                                <span className="text-gray-700 text-sm md:text-base mr-2">Bicep: {measurement.bicep}</span>
                                <span className="text-gray-700 text-sm md:text-base">Thigh: {measurement.thigh}</span>
                            </div>
                            <button onClick={() => requestDelete(measurement.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                X
                            </button>
                        </div>
                    ))}
                </div>
                    </div>
            ) : (
        <p>No measurements found.</p>
    )}





            {isDeleteModalOpen && (
                <div className="modal">
                    <div className="modal-content p-6 bg-white rounded-lg shadow-lg">
                        <h4 className="text-lg font-semibold mb-4">Confirm Delete</h4>
                        <p>Are you sure you want to delete this measurement?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={cancelDelete}>No</button>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={confirmDelete}>Yes</button>
                        </div>
                    </div>
                </div>

            )}



        </div>
    );


};

export default ActualMeasurements;
