import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {useAuth} from "../../contexts/AuthContext";
import ip from '../../config/Ip'

const calculateTimeDifference = (dateString) => {
    const orderDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - orderDate;
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const differenceInMinutes = differenceInSeconds / 60;
    const differenceInHours = differenceInMinutes / 60;
    const differenceInDays = differenceInHours / 24;

    if (differenceInDays > 1) return `${Math.round(differenceInDays)} days ago`;
    if (differenceInHours > 1) return `${Math.round(differenceInHours)} hours ago`;
    if (differenceInMinutes > 1) return `${Math.round(differenceInMinutes)} minutes ago`;
    return "Just now";
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};
const formatDate2 = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};
const UserList = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 20;
    const { logout } = useAuth();
    const [orderStatusFilter, setOrderStatusFilter] = useState(''); // Dodatkowy stan dla filtra
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const handleFilterChange = (event) => {
        setOrderStatusFilter(event.target.value);
    };
    const handleRowClick = (userId, username) => {
        navigate(`/dietmaker/${userId || username}`);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                const params = {
                    search: searchTerm,
                    page: currentPage
                };

                if (orderStatusFilter) {
                    params.orderStatus = orderStatusFilter; // Dodaj filtr statusu zamówienia do parametrów
                }

                const response = await axios.get(ip + '/api/users/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    params: params
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
                if (error.response && error.response.status === 401) {
                    logout();
                    navigate("/login")
                }
            }
        };
        fetchData();
    }, [searchTerm, currentPage, orderStatusFilter]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="container mx-auto p-4">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search users"
                className="p-2 border border-gray-300 rounded mb-4 w-full"
            />

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b border-gray-200">Username</th>
                    <th className="py-2 px-4 border-b border-gray-200">
                        {/* Rozwijana lista wewnątrz nagłówka */}
                        <select
                            value={orderStatusFilter}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded"
                            onFocus={() => setIsSelectOpen(true)}
                            onBlur={() => setIsSelectOpen(false)}
                        >
                            <option value="">{isSelectOpen ? "Wszystkie" : "Status"}</option>
                            <option value="Active">Aktywne</option>
                            <option value="Completed">Zakończone</option>
                            <option value="Pending">Oczekujące</option>
                        </select>

                    </th>
                    <th className="py-2 px-4 border-b border-gray-200">Order Duration</th>
                    <th className="py-2 px-4 border-b border-gray-200">Order Creation Time</th>
                </tr>
                </thead>
                <tbody>
                {users.results ? users.results.map(user => (
                    <tr key={user.zamowienia[0].id}
                        onClick={() => handleRowClick(user.id, user.username)}
                        className="hover:bg-gray-100 cursor-pointer">
                        <td className="py-2 px-4 border-b border-gray-200">{user.username}</td>
                        <td className="py-2 px-4 border-b border-gray-200">
                            {user.zamowienia && user.zamowienia.length > 0 ? user.zamowienia[0].status : "Brak zamówień"}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                            {user.zamowienia && user.zamowienia.length > 0 ? user.zamowienia[0].duration + ' msc' : "-"}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                            <span className="block md:hidden">{formatDate2(user.zamowienia[0].data_rozpoczecia)}</span>
                            <span className="hidden md:block">{formatDate(user.zamowienia[0].data_rozpoczecia)}</span>
                        </td>
                    </tr>
                )) : null}
                </tbody>
            </table>
            </div>

            <div className="mt-4">
                {/* Komponent paginacji */}
            </div>
        </div>
    );
};

export default UserList;