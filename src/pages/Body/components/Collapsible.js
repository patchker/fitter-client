import React, { useState } from 'react';
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

const ExerciseItem = ({ exercise }) => (
    <div className="my-3 p-3 bg-gradient-to-r from-gray-50 to-gray-200 rounded-lg shadow">
        <div className="font-semibold text-emerald-600 text-lg">{exercise.name}</div>
        {(exercise.series || []).map((serie, serieIndex) => (
            <div key={serieIndex} className="text-sm mt-1 pl-4 text-gray-700">
               [{serieIndex+1}] {serie.weight}kg x {serie.repetitions}
            </div>
        ))}
    </div>
);

const Collapsible = ({ training }) => {
    const [isOpen, setIsOpen] = useState(false);
    const exercises = training.exercises || [];


    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };


    return (
        <div className="flex items-center justify-center"> {/* Zapewnia wyśrodkowanie w pionie i poziomie na całej wysokości ekranu */}
            <div className="max-w-[700px] w-full mx-auto"> {/* Ogranicza szerokość i wyśrodkowuje w poziomie */}
                <div className="border border-gray-300 rounded-lg shadow-lg my-2 overflow-hidden">
                    <button
                        className="w-full text-center py-3 px-4 hover:bg-gradient-to-r from-gray-200 to-gray-300 font-semibold text-lg bg-gradient-to-l from-gray-100 to-gray-200 flex items-center justify-center"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="text-gray-500 mr-2">ID: {[training.id]} </span> - Trening dnia {formatDate(training.date)}
                        {isOpen ? <FaAngleUp className="h-5 w-5 ml-2" /> : <FaAngleDown className="h-5 w-5 ml-2" />}
                    </button>
                    {isOpen && (
                        <div className="p-4 bg-white">
                            {exercises.map((exercise, index) => (
                                <ExerciseItem key={index} exercise={exercise} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default Collapsible;
