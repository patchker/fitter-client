import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Ip from '../../../config/Ip';
import "./ActualMeasurements.css"
import {useNavigate} from "react-router-dom";

function ActualMeasurements() {
    const [measurements, setMeasurements] = useState([]);
    const [newMeasurement, setNewMeasurement] = useState({waist: '', chest: '', bicep: '', thigh: ''});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const handleInputChange = (e) => {
        const value = e.target.value;
        const numericValue = Number(value);

        if (!isNaN(numericValue) && numericValue >= 0 && numericValue < 999) {
            setNewMeasurement({...newMeasurement, [e.target.name]: numericValue});
            setErrorMessage("");
        } else if (value === '') {
            setNewMeasurement({...newMeasurement, [e.target.name]: ''});
        }
    };


    const confirmAddMeasurement = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const currentDate = new Date().toISOString().split('T')[0];

            const measurementToAdd = {
                ...newMeasurement,
                date: currentDate
            };

            const headers = {Authorization: `Bearer ${token}`};

            const response = await axios.post(`${Ip}/api/measurements/`, measurementToAdd, {headers});
            setMeasurements([...measurements, response.data]);

            setNewMeasurement({date: currentDate, waist: '', chest: '', bicep: '', thigh: ''});
            navigate("/body/measurements");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.error || "An error occurred.");
            } else {
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
        const allFieldsFilled = Object.values(newMeasurement).every(value => value > 0);

        if (allFieldsFilled) {
            setIsAddModalOpen(true);
        } else {
            setErrorMessage("Wszystkie pola muszą być wypełnione i większe od 0.");
        }
    };


    return (
        <div className="measurements-container p-4">
            <div className="w-full flex justify-start">
                <button className="ml-10 w-30 p-3 rounded text-white font-semibold bg-gray-500"
                        onClick={() => navigate("/body/measurements")}>Powrót do pomiarów
                </button>
            </div>

            <form onSubmit={handleSubmit2}
                  className="mt-8 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4">Dodaj nowy pomiar</h3>
                <div className="w-full max-w-md">


                    <div>
                        <label htmlFor="waist" className="block text-sm font-medium text-gray-700">Talia (cm)</label>
                        <input type="number" id="waist" name="waist" min="0" value={newMeasurement.waist}
                               onChange={handleInputChange}
                               className="mt-1 w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="chest" className="block text-sm font-medium text-gray-700">Klatka piersiowa
                            (cm)</label>
                        <input type="number" id="chest" name="chest" value={newMeasurement.chest}
                               onChange={handleInputChange}
                               className="mt-1 w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="bicep" className="block text-sm font-medium text-gray-700">Biceps (cm)</label>
                        <input type="number" id="bicep" name="bicep" value={newMeasurement.bicep}
                               onChange={handleInputChange}
                               className="mt-1 w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="thigh" className="block text-sm font-medium text-gray-700">Udo (cm)</label>
                        <input type="number" id="thigh" name="thigh" value={newMeasurement.thigh}
                               onChange={handleInputChange}
                               className="mt-1 w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                </div>
                <button type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4">
                    Dodaj pomiar
                </button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            </form>


            {isAddModalOpen && (
                <div className="modal">


                    <div className="modal-content">
                        <div className="p-6 bg-white rounded-lg shadow-lg">
                            <h4 className="text-lg font-semibold mb-4">Potwierdź nowy pomiar</h4>
                            <p>Jesteś pewien, że chcesz dodać ten pomiar?</p>

                            <ul className="mt-2">
                                <li className="flex justify-between mb-2 border-b-2">
                                    <span>Talia:</span> <span>{newMeasurement.waist} cm</span>
                                </li>
                                <li className="flex justify-between mb-2 border-b-2">
                                    <span>Klatka piersiowa:</span> <span>{newMeasurement.chest} cm</span>
                                </li>
                                <li className="flex justify-between mb-2 border-b-2">
                                    <span>Biceps:</span> <span>{newMeasurement.bicep} cm</span>
                                </li>
                                <li className="flex justify-between mb-2 border-b-2">
                                    <span>Udo:</span> <span>{newMeasurement.thigh} cm</span>
                                </li>
                            </ul>

                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                    onClick={cancelAdd}>Nie
                                </button>
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={confirmAddMeasurement}>Tak
                                </button>
                            </div>
                        </div>
                    </div>


                </div>

            )}


        </div>
    );


};

export default ActualMeasurements;
