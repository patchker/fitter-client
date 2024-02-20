import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Ip from '../../config/Ip';
import "./Body.css";
import {Line} from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {useNavigate} from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const UserProgress = () => {
    const navigate = useNavigate();
    const [latestMeasurement, setLatestMeasurement] = useState(null);


    const [data, setData] = useState({
        num_trainings_this_week: 0,
        last_three_trainings: [],
        total_trainings: 0,
        body_measurements: []
    })

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });


    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        axios.get(Ip + '/api/user-progress/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(response => {
            setData(response.data);
        })
            .catch(error => console.error('Error fetching data', error));
    }, []);


    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        axios.get(Ip + '/api/user-progress/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(response => {
            setData(response.data);

            if (response.data.body_measurements && response.data.body_measurements.length > 0) {
                const sortedMeasurements = response.data.body_measurements
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                setLatestMeasurement(sortedMeasurements[0]);

                const labels = response.data.body_measurements.map(measurement => measurement.date);
                const bicepsData = response.data.body_measurements.map(measurement => measurement.bicep);
                const waistData = response.data.body_measurements.map(measurement => measurement.waist);
                const chestData = response.data.body_measurements.map(measurement => measurement.chest);
                const thighData = response.data.body_measurements.map(measurement => measurement.thigh);


                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Biceps',
                            data: bicepsData,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        },
                        {
                            label: 'Talia',
                            data: waistData,
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1
                        },
                        {
                            label: 'Klatka',
                            data: chestData,
                            fill: false,
                            borderColor: 'rgb(252, 231, 98)',
                            tension: 0.1
                        },
                        {
                            label: 'Udo',
                            data: thighData,
                            fill: false,
                            borderColor: 'rgb(202, 60, 255)',
                            tension: 0.1
                        }
                    ]
                });
            }
        })
            .catch(error => console.error('Error fetching data', error));
    }, []);


    function formatDate(dateString) {
        const options = {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
        return new Date(dateString).toLocaleDateString('pl-PL', options);
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Twoje sesje treningowe</h2>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
                <div className="card center-content rounded-2xl col-span-1">
                    <div className="number">{data.num_trainings_this_week}</div>
                    <div className="text">Treningi w tym tygodniu</div>
                </div>
                <div className="card center-content rounded-2xl col-span-1">
                    <div className="number">{data.total_trainings}</div>
                    <div className="text">Wszystkie treningi</div>
                </div>

                <button
                    className="card h-full justify-center items-center flex bg-emerald-500 rounded-2xl text-2xl font-semibold text-white col-span-1 hover:scale-[102%] hover: transition hover: cursor-pointer"
                    onClick={() => navigate("/addtraining")}
                >
                    NOWY TRENING
                </button>
                <div onClick={() => navigate("/body/measurements")}
                     className="card rounded-2xl row-span-2 flex justify-center items-center relative hover:scale-[102%] hover: transition hover: cursor-pointer">
                     <span
                         className="current-measurements absolute top-0 left-1/2 transform -translate-x-1/2 p-1 rounded-md w-full">
        <span className="text-lg font-semibold text-black">Aktualne pomiary</span>
    </span>
                    <img src="man4.png" className="w-full"/>


                    <span className="absolute bg-gray-400 rounded"
                          style={{top: '30%', left: '2%'}}>
                        <span className="text-xs font-semibold text-gray-800">Biceps</span><br/>
        <span
            className="text-lg font-semibold text-emerald-500">{latestMeasurement ? `${latestMeasurement.bicep}cm` : 'N/A'}</span>
    </span>


                    <span className="absolute bg-gray-400 rounded"
                          style={{top: '20%', left: '50%'}}>
                        <span className="text-xs font-semibold text-gray-800">Klatka</span><br/>
        <span
            className="text-lg font-semibold text-emerald-500">{latestMeasurement ? `${latestMeasurement.chest}cm` : 'N/A'}</span>
    </span>

                    <span className="absolute bg-gray-400 rounded"
                          style={{top: '40%', left: '50%'}}>
                        <span className="text-xs font-semibold text-gray-800">Pas</span><br/>
        <span
            className="text-lg font-semibold text-emerald-500">{latestMeasurement ? `${latestMeasurement.waist}cm` : 'N/A'}</span>
    </span>

                    <span className="absolute bg-gray-400 rounded"
                          style={{top: '50%', left: '2%'}}>
                        <span className="text-xs font-semibold text-gray-800">Udo</span><br/>
        <span
            className="text-lg font-semibold text-emerald-500">{latestMeasurement ? `${latestMeasurement.thigh}cm` : 'N/A'}</span>
    </span>


                </div>


                <div onClick={() => navigate("/trainings")}
                     className="card2 rounded-2xl col-span-1 lg:col-span-1 hover:scale-[102%] hover:transition hover:cursor-pointer flex flex-col justify-center">
                    <div className="header-text mb-5">Ostatni trening:</div>

                    {data.last_three_trainings && data.last_three_trainings.length > 0 ? (
                        <div className="session-block">
                            <p className="session-date text-lg font-semibold">
                                {formatDate(data.last_three_trainings[0].date)}
                            </p>
                            {data.last_three_trainings[0].exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className="exercise-block my-2">
                                    <p className="exercise-name font-bold">{exercise.name}</p>
                                    {exercise.series.map((serie, serieIndex) => (
                                        <p key={serieIndex}
                                           className="serie-details text-sm">[{serieIndex + 1}]: {serie.weight} kg
                                            x {serie.repetitions}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-400">Brak informacji o treningach.</div>
                    )}
                </div>


                <div onClick={() => navigate("/body/measurements")}
                     className="card rounded-2xl col-span-2 lg:col-span-2 flex flex-col hover:scale-[102%] hover: transition hover: cursor-pointer">
                    <h2 className="text-2xl font-bold my-4">Pomiary ciała</h2>
                    {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
                        <Line data={chartData}/>
                    ) : (
                        <div className="flex text-xl text-gray-400 justify-center items-center flex-grow mb-20">
                            <p>Brak danych o pomiarach. Kliknij, aby dodać nowe.</p>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default UserProgress;
