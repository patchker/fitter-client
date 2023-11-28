// TrainingContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from "axios";
import Ip from "../config/Ip";

export const TrainingContext = createContext();

export const useTrainings = () => useContext(TrainingContext);

export const TrainingProvider = ({ children }) => {
    const [trainings, setTrainings] = useState([]);

    const fetchTrainings = async () => {
        console.log("Wywołanie funkcji fetchTrainings w ContextAPI");

        try {
            const token = localStorage.getItem("access_token"); // Replace with your actual token key
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = await axios.get(`${Ip}/api/trainings/`, { headers });
            console.log("Dane treningów",response.data)

            setTrainings(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }    };

    // W TrainingContext.js
    const addTraining = (trainingId, newExercise) => {
        console.log(`Wywołanie funkcji addTraining w ContextAPI z ćwiczeniem`, newExercise);
        // Logika aktualizacji stanu treningów
        setTrainings(prevTrainings => {
            // Znajdź i zaktualizuj odpowiedni trening
            return prevTrainings.map(training => {
                if (training.id === trainingId) {
                    return { ...training, exercises: [...training.exercises, newExercise] };
                }
                return training;
            });
        });
    };

    return (
        <TrainingContext.Provider value={{ trainings, setTrainings, fetchTrainings, addTraining }}>
            {children}
        </TrainingContext.Provider>
    );
};
