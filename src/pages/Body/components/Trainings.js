import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Ip from "../../../config/Ip"
import Collapsible from "./Collapsible"
import { useTrainings } from '../../../contexts/TrainingContext';

const Trainings = () => {
    const { trainings, fetchTrainings } = useTrainings();




    useEffect(() => {

        fetchTrainings();
    }, []);


    useEffect(() => {
        fetchTrainings();
    }, [fetchTrainings]);



    return (
        <div className="my-4">
            {trainings.map((training, index) => (
                <Collapsible key={index} training={training} />
            ))}
        </div>
    );
};

export default Trainings;
