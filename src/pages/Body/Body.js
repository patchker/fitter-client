import React, { useState } from 'react';
import axios from 'axios';
import Ip from "../../config/Ip"
const GymProgressTracker = () => {
    const [trainingData, setTrainingData] = useState([]);
    const [exercise, setExercise] = useState('');
    const [series, setSeries] = useState([{ weight: '', repetitions: '' }]);
    const [editableIndex, setEditableIndex] = useState(null); // Nowy stan do śledzenia edytowanego indeksu


    // Lista predefiniowanych ćwiczeń
    const predefinedExercises = ['Deadlift', 'Squat', 'Bench Press', 'Pull-up', 'Push-up'];

    const handleExerciseChange = (e) => {
        setExercise(e.target.value);
    };

    const handleEdit = (index) => {
        const dataToEdit = trainingData[index];

        // Zakładamy, że chcesz edytować pierwsze ćwiczenie z listy
        if (dataToEdit.exercises && dataToEdit.exercises.length > 0) {
            const firstExercise = dataToEdit.exercises[0];
            setExercise(firstExercise.name);
            setSeries(firstExercise.series || [{ weight: '', repetitions: '' }]);
        } else {
            setExercise('');
            setSeries([{ weight: '', repetitions: '' }]);
        }
        setEditableIndex(index);
    };





    const handleUpdate = () => {
        const updatedData = [...trainingData];
        updatedData[editableIndex] = { exercise, series };
        setTrainingData(updatedData);
        setExercise('');
        setSeries([{ weight: '', repetitions: '' }]);
        setEditableIndex(null); // Resetowanie indeksu edytowanego elementu
    };



    const handleSeriesChange = (index, field, value) => {
        const newSeries = [...series];
        newSeries[index][field] = value;
        setSeries(newSeries);
    };

    const addSeries = () => {
        setSeries([...series, { weight: '', repetitions: '' }]);
    };

    const removeSeries = (index) => {
        const newSeries = series.filter((_, i) => i !== index);
        setSeries(newSeries);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editableIndex !== null) {
            handleUpdate();
        } else {
            const newExerciseData = {
                name: exercise,
                series: series.map(s => ({
                    weight: s.weight,
                    repetitions: s.repetitions
                }))
            };



            const newTrainingData = {
                date: new Date().toISOString().slice(0, 10),
                exercises: [newExerciseData]
            };
            console.log("newTrainingData",newTrainingData)
            setTrainingData(prevTrainingData => [...prevTrainingData, newTrainingData]);
            setExercise('');
            setSeries([{weight: '', repetitions: ''}]);

            try {
                const token = localStorage.getItem('access_token');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
                const response = await axios.post(Ip + '/api/training-session/', newTrainingData, { headers });
                console.log(response.data);
                // Tutaj możesz czyścić stan, jeśli to konieczne
            } catch (error) {
                console.error("There was an error saving the training data", error);
            }
        }
    };


    return (
        <div className="container mx-auto p-4">
            <form onSubmit={handleSubmit} className="mb-6">
                {/* Wyszukiwarka ćwiczeń */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="exercise">
                        Exercise
                    </label>
                    <input
                        list="exercises"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="exercise"
                        type="text"
                        placeholder="e.g., Deadlift"
                        value={exercise}
                        onChange={handleExerciseChange}
                        required
                    />
                    <datalist id="exercises">
                        {predefinedExercises.map((ex, index) => (
                            <option key={index} value={ex} />
                        ))}
                    </datalist>
                </div>

                {series.map((s, index) => (
                    <div key={index} className="flex items-center mb-4 space-x-2">
                        <div className="flex-1">
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="number"
                                placeholder="Weight in kg"
                                value={s.weight}
                                onChange={(e) => handleSeriesChange(index, 'weight', e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="number"
                                placeholder="Repetitions"
                                value={s.repetitions}
                                onChange={(e) => handleSeriesChange(index, 'repetitions', e.target.value)}
                                required
                            />
                        </div>
                        {series.length > 1 && (
                            <button type="button" onClick={() => removeSeries(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                &#x2212; {/* Minus symbol */}
                            </button>
                        )}
                    </div>
                ))}

                <div className="flex items-center space-x-2">
                    <button type="button" onClick={addSeries} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        &#43; {/* Plus symbol */}
                    </button>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </div>
            </form>
            {/* Tabela danych treningowych z opcją edycji */}
            <div className="overflow-x-auto mt-6">
                <table className="table-auto w-full">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Exercise</th>
                        <th className="px-4 py-2">Series</th>
                        <th className="px-4 py-2">Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {trainingData.map((data, dataIndex) => (
                        <tr key={dataIndex} className="bg-white">
                            <td className="border px-4 py-2">
                                {data.exercises.map((exercise, exerciseIndex) => (
                                    <div key={exerciseIndex}>{exercise.name}</div>
                                ))}
                            </td>
                            <td className="border px-4 py-2">
                                {data.exercises.map((exercise, exerciseIndex) => (
                                    <div key={exerciseIndex}>
                                        {exercise.series.map((s, seriesIndex) => (
                                            <div key={seriesIndex} className="my-2">
                                                <span className="font-semibold">Series {seriesIndex + 1}:</span> {s.weight} kg - {s.repetitions} reps
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEdit(dataIndex)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default GymProgressTracker;
