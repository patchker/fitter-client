import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Ip from "../../config/Ip"
const AddTraining = () => {
    const [trainingData, setTrainingData] = useState([]);
    const [exercise, setExercise] = useState('');
    const [series, setSeries] = useState([{ weight: '', repetitions: '' }]);
    const [editableIndex, setEditableIndex] = useState(null); // Nowy stan do śledzenia edytowanego indeksu
    const [showForm, setShowForm] = useState(false); // Stan do kontroli wyświetlania formularza
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [trainingId, setTrainingId] = useState(null);


    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        axios.get(Ip + '/training-start/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(response => {
            console.log("response.data", response.data)
            setTrainingId(response.data.id)
        })
            .catch(error => console.error('Error fetching data', error));
    }, []);



    // Lista predefiniowanych ćwiczeń
    const predefinedExercises = ['Deadlift', 'Squat', 'Bench Press', 'Pull-up', 'Push-up'];

    const handleExerciseChange = (e) => {
        setExercise(e.target.value);
    };

    const handleEdit = (index) => {
        const dataToEdit = trainingData[index];
        if (dataToEdit.exercises && dataToEdit.exercises.length > 0) {
            const exerciseToEdit = dataToEdit.exercises[0];
            setExercise(exerciseToEdit.name);
            setSeries(exerciseToEdit.series || [{ weight: '', repetitions: '' }]);
            setEditableIndex(index); // Ustaw indeks edytowanego ćwiczenia
            setShowForm(true); // Pokaż formularz
        }
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
        const newExerciseData = {
            name: exercise,
            series: series.map(s => ({ weight: s.weight, repetitions: s.repetitions }))
        };

        try {
            const token = localStorage.getItem('access_token');
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            let response;

                // Dodawanie nowego ćwiczenia do istniejącego treningu
                // Dodawanie nowego ćwiczenia do istniejącego treningu
                response = await axios.post(`${Ip}/api/training-session/${trainingId}/add-exercise`, newExerciseData, { headers });

// Pobierz zaktualizowane dane treningu z odpowiedzi
                const updatedExercise = response.data;

// Aktualizuj stan z nowymi danymi treningu
            const newTrainingData = { date: new Date().toISOString().slice(0, 10), exercises: [newExerciseData] };

            // Wykonaj żądanie dodania do serwera
            response = await axios.post(Ip + '/api/training-session/', newTrainingData, { headers });
            setTrainingData(prevTrainingData => [...prevTrainingData, newTrainingData]);
        



        console.log(response.data);

            // Resetowanie formularza
            setExercise('');
            setSeries([{ weight: '', repetitions: '' }]);
            setShowForm(false); // Ukryj formularz po zapisie
        } catch (error) {
            console.error("There was an error saving the training data", error);
        }
    };

console.log("trainingData",trainingData)
console.log("trainingData",trainingId)


    return (
        <div className="mt-10 text-2xl font-semibold text-gray-800">
            <h1 className="text-center ">Nowy trening</h1>
            <div className="container lg:w-[700px] mx-auto p-6 bg-white rounded-2xl shadow-xl transition-all">
                {showForm ? (
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

                        <div className="flex items-center justify-between mt-4">
                            <button type="button" onClick={addSeries} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                                &#43; {/* Plus symbol */}
                            </button>
                            <div className="flex justify-end gap-5">
                                <button type="button" onClick={() => {setShowForm(false); setSeries([{ weight: '', repetitions: '' }])}} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <>

                        {/* Tabela danych treningowych z opcją edycji */}
                        <div className="overflow-x-auto rounded-lg shadow-sm font-normal text-lg">
                            <div className="space-y-6">
                                {trainingData.map((data, dataIndex) => (
                                    <div key={dataIndex} className="bg-white shadow-lg rounded-lg p-4">
                                        {data.exercises.map((exercise, exerciseIndex) => (
                                            <div key={exerciseIndex}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="text-lg font-semibold text-blue-600">{exercise.name}</h3>
                                                    <button onClick={() => handleEdit(dataIndex)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded transition duration-300">
                                                        Edit
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {exercise.series.map((s, seriesIndex) => (
                                                        <div key={seriesIndex} className="flex items-center bg-gray-100 p-2 rounded-lg shadow">
                                                            <span className="font-semibold mr-2 flex-none">{seriesIndex + 1}.</span>
                                                            <span className="flex-grow text-center">{s.weight} kg x {s.repetitions} </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>


                        <button onClick={() => setShowForm(true)} className=" mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mb-4 shadow-md">
                            Add exercise
                        </button>

                    </>
                )}
            </div>
        </div>
    );
};

export default AddTraining;
