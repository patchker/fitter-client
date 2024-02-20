import React, {createContext, useState, useContext} from 'react';
import axios from "axios";
import Ip from "../config/Ip";

export const TrainingContext = createContext();

export const useTrainings = () => useContext(TrainingContext);

export const TrainingProvider = ({children}) => {
    const [trainings, setTrainings] = useState([]);

    const fetchTrainings = async () => {

        try {
            const token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = await axios.get(`${Ip}/api/trainings/`, {headers});

            setTrainings(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const addTraining = (trainingId, newExercise) => {
        setTrainings(prevTrainings => {
            return prevTrainings.map(training => {
                if (training.id === trainingId) {
                    return {...training, exercises: [...training.exercises, newExercise]};
                }
                return training;
            });
        });
    };

    return (
        <TrainingContext.Provider value={{trainings, setTrainings, fetchTrainings, addTraining}}>
            {children}
        </TrainingContext.Provider>
    );
};
