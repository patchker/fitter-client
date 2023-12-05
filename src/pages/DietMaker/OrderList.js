import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ip from '../../config/Ip'

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userToken = localStorage.getItem('access_token');

    const fetchOrders = async (userToken) => {
        try {
            const response = await axios.get(ip+'/api/user_orders/', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            console.log("response.data", response.data)

            return response.data;
        } catch (error) {
            console.error('There was an error fetching the orders!', error);
            console.log("ERROR", error)
            return null;
        }
    };

    useEffect(() => {
        const loadOrders = async () => {
            const fetchedOrders = await fetchOrders(userToken);
            if (fetchedOrders) {
                setOrders(fetchedOrders);
                //console.log("Orders", fetchedOrders)
            }
            setIsLoading(false);
        };

        loadOrders();
    }, [userToken]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Your Orders</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <p className="text-gray-500 italic">Loading orders...</p>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {orders.map(order => (
                                <li key={order.id}>
                                    <a href="#" className="block hover:bg-gray-50">
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-indigo-600 truncate">
                                                    {order.dieta ? order.dieta.nazwa : "Brak nazwy"}

                                                        {order.duration === 1 && ` (${order.duration} miesiąc)`}
                                                        {order.duration > 1 && order.duration < 12 && ` (${order.duration} miesiące)`}
                                                        {order.duration === 12 && ` (${order.duration} miesięcy)`}
                                                </p>



                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {order.status}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">

                                                    <p className="flex items-center text-sm text-gray-500">
                                                        Order ID: {order.id}
                                                    </p>

                                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                        Start Date: {formatDate(order.data_rozpoczecia)}
                                                    </p>

                                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                        End Date: {formatDate(order.data_zakonczenia)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;
