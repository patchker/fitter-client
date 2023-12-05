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
        console.log("Fetching orders")
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
        <div className="flex flex-col justify-center items-center m-auto border-2 bg-slate-50 border-gray-50 p-6 space-y-6 shadow-md pb-10 mt-10">
            <div className="bg-gray-200 p-8 rounded-[50px] shadow-sm space-y-4">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Twoja Droga do Zdrowszego Życia</h2>
                <p className="text-lg text-gray-700 text-center">Poznaj nasze narzędzia</p>
                <p className="text-sm text-gray-600 text-center">Śledź swoje postępy i osiągaj cele zdrowotne z naszymi spersonalizowanymi planami.</p>
                {isLoading ? <span>Loading...</span> : (
                    <button
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 text-center transition-colors duration-200 w-72 h-12 rounded-md"
                        onClick={handleButtonClick}
                    >
                        Przejdź do Diety
                    </button>
                )}
                <ul className="list-disc list-inside text-gray-600 text-left">
                    <li>Zdrowe przepisy</li>
                    <li>Personalizowane plany żywieniowe</li>
                    <li>Wsparcie społeczności</li>
                    <li>Monitorowanie postępów</li>
                </ul>
            </div>
        </div>
    );
}

export default Content;
