import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Ip from "../../../config/Ip"
import Collapsible from "./Collapsible"
const Trainings = () => {
    const [trainings,setTrainings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
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
            }
        };

        fetchData();
    }, []);






    return (
        <div className="my-4">
            {trainings.map((training, index) => (
                <Collapsible key={index} training={training} />
            ))}
        </div>
    );
};

export default Trainings;
