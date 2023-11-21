import React, { useState } from 'react';
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

const Collapsible = ({ training }) => {
    const [isOpen, setIsOpen] = useState(false);
    const exercises = training.exercises || [];

    return (
        <div className="border border-gray-300 rounded-lg shadow-lg my-2 overflow-hidden">
            <button
                className="w-full text-center py-3 px-4 hover:bg-gradient-to-r from-gray-200 to-gray-300 font-semibold text-lg bg-gradient-to-l from-gray-100 to-gray-200 flex items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                ID:{[training.id]} Training on {training.date}
                {isOpen ? <FaAngleUp className="h-5 w-5 ml-2" /> : <FaAngleDown className="h-5 w-5 ml-2" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-white">
                    {exercises.map((exercise, index) => (
                        <div key={index} className="my-3 p-3 bg-gradient-to-r from-gray-50 to-gray-200 rounded-lg shadow">
                            <div className="font-semibold text-emerald-600 text-lg">{exercise.name}</div>
                            {/* Zapewnienie domyślnej pustej tablicy dla series */}
                            {(exercise.series || []).map((serie, serieIndex) => (
                                <div key={serieIndex} className="text-sm mt-1 pl-4 text-gray-700">
                                    {serie.repetitions} reps of {serie.weight}kg
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Collapsible;
