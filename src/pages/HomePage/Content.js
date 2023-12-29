import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import {useAuth} from "../../contexts/AuthContext";
import axios from "axios";
import ip from "../../config/Ip";

function Content() {
    const [hasSubscription,setHasSubscription] = useState(false); // Tutaj zastąp true logiką sprawdzającą subskrypcję
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser, setCurrentUser, logout, currentRole, setCurrentRole} = useAuth();
    const [dietPath, setDietPath] = useState("/dieta");
    const fetchOrders = async (userToken) => {
        try {
            const response = await axios.get(ip + '/api/user_orders/', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            console.log("Fetching orders response", response.data)
            if (response.data.length === 0) {
                setHasSubscription(true)
                return null;

            }
            return response.data;
        } catch (error) {
            console.error('There was an error fetching the orders!', error);
            return null;
        }
    };
    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            const checkSubscription = async () => {
                const userToken = localStorage.getItem('access_token');
                const orders = await fetchOrders(userToken);

                if (orders && orders.some(order => {
                    const currentDate = new Date();
                    const startDate = new Date(order.data_rozpoczecia);
                    const endDate = new Date(order.data_zakonczenia);
                    return currentDate >= startDate && currentDate <= endDate;
                })) {
                    setHasSubscription(true)
                } else {
                    setHasSubscription(false)
                }

                setIsLoading(false);
            };

            checkSubscription();
        } else {
            setDietPath("/dieta");
        }
    }, [currentUser, fetch]);


    const handleButtonClick = () => {
        console.log("hasSubscription",hasSubscription)
        if (hasSubscription) {
            navigate('/dietcalendar');
        } else {
            navigate('/dieta');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center m-auto border-2 bg-gradient-to-r from-slate-100 to-slate-50 border-gray-100 p-10 space-y-8 shadow-2xl">
            <div className="bg-white p-10 rounded-[50px] shadow-xl space-y-6">
                <h2 className="text-4xl font-bold text-center text-gray-800">Twoja Droga do Zdrowszego Życia</h2>
                <p className="text-xl text-gray-700 text-center">Poznaj nasze narzędzia</p>
                <p className="text-md text-gray-600 text-center">Śledź swoje postępy i osiągaj cele zdrowotne z naszymi spersonalizowanymi planami.</p>
                {isLoading ? <span>Loading...</span> : (
                    <button
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 text-center transition-all duration-500 w-full md:w-80 h-14 rounded-lg shadow-md hover:shadow-lg"
                        onClick={handleButtonClick}
                    >
                        Przejdź do Diety
                    </button>
                )}
                <div className="flex justify-center">
                    <ul className="text-gray-600 space-y-3">
                        <li className="flex items-center hover:text-emerald-500 transition-colors duration-300">
                            <span className="text-emerald-500 mr-2">•</span> Zdrowe przepisy
                        </li>
                        <li className="flex items-center hover:text-emerald-500 transition-colors duration-300">
                            <span className="text-emerald-500 mr-2">•</span> Personalizowane plany żywieniowe
                        </li>
                        <li className="flex items-center hover:text-emerald-500 transition-colors duration-300">
                            <span className="text-emerald-500 mr-2">•</span> Wsparcie społeczności
                        </li>
                        <li className="flex items-center hover:text-emerald-500 transition-colors duration-300">
                            <span className="text-emerald-500 mr-2">•</span> Monitorowanie postępów
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );


}

export default Content;
