import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Ip from '../../config/Ip';
import ip from "../../config/Ip";
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


    console.log("data", data)
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        axios.get(Ip + '/user-progress/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(response => {
            console.log("response.data", response.data)
            setData(response.data);
        })
            .catch(error => console.error('Error fetching data', error));
    }, []);


    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        axios.get(Ip + '/user-progress/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(response => {
            console.log("response.data", response.data);
            setData(response.data);

            // Przygotowanie danych do wykresu
            if (response.data.body_measurements && response.data.body_measurements.length > 0) {
                // Przygotowanie danych do wykresu
                const sortedMeasurements = response.data.body_measurements
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                setLatestMeasurement(sortedMeasurements[0]);

                const labels = response.data.body_measurements.map(measurement => measurement.date);
                const bicepsData = response.data.body_measurements.map(measurement => measurement.bicep);
                const waistData = response.data.body_measurements.map(measurement => measurement.waist);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Obwód Bicepsa',
                            data: bicepsData,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        },
                        {
                            label: 'Obwód Talii',
                            data: waistData,
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1
                        }
                    ]
                });
            }
        })
            .catch(error => console.error('Error fetching data', error));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Your Training Sessions</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Kafelki z informacjami */}
                <div className="card center-content rounded-2xl col-span-1">
                    <div className="number">{data.num_trainings_this_week}</div>
                    <div className="text">Trainings this week</div>
                </div>
                <div className="card center-content rounded-2xl col-span-1">
                    <div className="number">{data.total_trainings}</div>
                    <div className="text">Total trainings</div>
                </div>

                <button
                    className="card justify-center items-center flex bg-emerald-500 rounded-2xl text-2xl font-semibold text-white col-span-1 hover:scale-[102%] hover: transition hover: cursor-pointer"
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
                    <img src="man4.png" className="w-52"/> {/* Dostosuj rozmiar obrazu według potrzeb */}
                    <span className="absolute top-48 left-2 bg-gray-400 bg-opacity-70 p-1 rounded-md">
        <span className="text-xs font-semibold text-gray-800">Biceps</span><br/>
        <span className="text-lg font-semibold text-emerald-500">{latestMeasurement ? `${latestMeasurement.bicep}cm` : 'N/A'}</span>
    </span>
                    <span className="absolute top-40 left-56 bg-gray-400 bg-opacity-70 p-1 rounded-md">
        <span className="text-xs font-semibold text-gray-800">Klatka</span><br/>
        <span className="text-lg font-semibold text-emerald-500">100cm</span>
    </span>
                    <span className="absolute top-60 left-52 bg-gray-400 bg-opacity-80 p-1 rounded-md">
        <span className="text-xs font-semibold text-gray-800">Pas</span><br/>
        <span className="text-lg font-semibold text-emerald-500">85cm</span>
    </span>
                    <span className="absolute top-80 left-10 bg-gray-400 bg-opacity-70 p-1 rounded-md">
        <span className="text-xs font-semibold text-gray-800">Udo</span><br/>
        <span className="text-lg font-semibold text-emerald-500">50cm</span>
    </span>
                </div>


                <div onClick={()=>navigate("/trainings")} className="card rounded-2xl col-span-1 lg:col-span-1 hover:scale-[102%] hover: transition hover: cursor-pointer">
                    <div className="header-text mb-5">Last trainings:</div>

                    {data.last_three_trainings && data.last_three_trainings.map((session, sessionIndex) => (
                        <div key={sessionIndex} className="session-block">

                            <p className="session-date text-lg font-semibold">Date: {session.date}</p>
                            {session.exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className="exercise-block my-2">
                                    <p className="exercise-name font-bold">{exercise.name}</p>
                                    {exercise.series.map((serie, serieIndex) => (
                                        <p key={serieIndex}
                                           className="serie-details text-sm">Series {serieIndex + 1}: {serie.weight} kg
                                            - {serie.repetitions} reps</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Wykres */}
                <div className="card rounded-2xl col-span-2 lg:col-span-2">
                    <h2 className="text-2xl font-bold my-4">Pomiary ciała</h2>
                    {chartData && <Line data={chartData}/>}
                </div>


            </div>
        </div>
    );
};

export default UserProgress;
