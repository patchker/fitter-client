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
                    <button className={`mr-20 w-30 p-3 rounded font-semibold ${isTodayMeasured ? 'bg-gray-400 text-gray-200' : 'bg-emerald-500 text-white'}`}
                            disabled={isTodayMeasured}
                            onClick={() => navigate("/addmeasurement")}>
                        Dodaj pomiar
                    </button>
                    {isTodayMeasured && (
                        <div className="tooltip-text">Pomiar na dzisiaj już jest w bazie.</div>
                    )}
                </div>
            </div>


            {measurements.length > 0 ? (
                <div className="flex flex-col justify-center items-center ">
                    <div className="w-full max-w-[1200px] overflow-x-auto">
                        <table className="min-w-full leading-normal mt-5">
                            <thead>
                            <tr>
                                <th className=" text-center px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-center  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Talia (cm)
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-center  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Klatka piersiowa (cm)
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Biceps (cm)
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-center  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Udo (cm)
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-center  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Akcja
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {measurements.map((measurement, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                        {measurement.date}
                                    </td>
                                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                        {measurement.waist}
                                    </td>
                                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                        {measurement.chest}
                                    </td>
                                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                        {measurement.bicep}
                                    </td>
                                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                        {measurement.thigh}
                                    </td>
                                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                        <button onClick={() => requestDelete(measurement.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                                            Usuń
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>Nie znaleziono pomiarów.</p>
            )}






            {isDeleteModalOpen && (
                <div className="modal">
                    <div className="modal-content p-6 bg-white rounded-lg shadow-lg">
                        <h4 className="text-lg font-semibold mb-4">Potwierdzenie usunięcia</h4>
                        <p>Czy na pewno chcesz usunąć ten pomiar?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={cancelDelete}>Nie</button>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={confirmDelete}>Tak</button>
                        </div>
                    </div>
                </div>

            )}



        </div>
    );


};

export default ActualMeasurements;
