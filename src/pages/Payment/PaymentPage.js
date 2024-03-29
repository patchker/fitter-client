import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {usePayment} from '../../contexts/PaymentContext';
import ip from '../../config/Ip'
import {OrderPlacedContext} from "../../contexts/orderPlacedContext";

function PaymentPage() {
    const navigate = useNavigate();
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [duration, setDuration] = useState(null);
    const [street, setStreet] = useState("test1");
    const [city, setCity] = useState("test2");
    const [zipCode, setZipCode] = useState("test3");
    const [country, setCountry] = useState("test4");
    const {paymentData} = usePayment();
    const {orderPlaced, setOrderPlaced, setOrder} = useContext(OrderPlacedContext);


    React.useEffect(() => {
        if (paymentData) {
            setStreet(paymentData.address.street)
            setCity(paymentData.address.city)
            setZipCode(paymentData.address.zipCode)
            setCountry(paymentData.address.country)
            setSelectedDiet(paymentData.selectedPlan)
            setDuration(paymentData.duration)
        }
    }, [paymentData]);


    const fetchOrders = async (userToken) => {
        try {
            const response = await axios.get(ip + '/api/user_orders/', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });



            return response.data;
        } catch (error) {
            console.error('There was an error fetching the orders!', error);
            return null;
        }
    };
    useEffect(() => {

        const checkSubscription = async ()=>
        {
            const userToken = localStorage.getItem('access_token');

            const orders = await fetchOrders(userToken);

            if (orders && orders.length > 0) {
                const lastOrder = orders[orders.length - 1];
                const currentDate = new Date();
                const startDate = new Date(lastOrder.data_rozpoczecia);
                const endDate = new Date(lastOrder.data_zakonczenia);
                endDate.setHours(23, 59, 59, 999);

                if (currentDate >= startDate && currentDate <= endDate) {
                    navigate("/dietcalendar");
                }
            }
        }


        checkSubscription();

    }, [])


    const handlePayment = () => {
        const token = localStorage.getItem('access_token');

        axios({
            method: 'patch',
            url: ip + '/api/profile/',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                street: street,
                city: city,
                zipCode: zipCode,
                country: country,
            }
        })
            .then((response) => {

            })
            .catch((error) => {
                console.log(error);
            });

        axios({
            method: 'post',
            url: ip + '/api/zamowienia/',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                dieta_id: selectedDiet.id,
                duration: duration
            }
        })
            .then((response) => {
                setOrder()
                setOrderPlaced(true)

                navigate("/successPage");
            })
            .catch((error) => {

                console.log(error);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-semibold mb-4">Strona Płatności</h2>
            <p className="text-lg mb-6">Proszę kliknąć poniżej, aby dokonać płatności.</p>
            <button
                onClick={handlePayment}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                Zapłać
            </button>
        </div>
    );
}

export default PaymentPage;
