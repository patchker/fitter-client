import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {useAuth} from "../../contexts/AuthContext";
import ip from '../../config/Ip'


const formatDate = (dateString) => {
    const options = {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return new Date(dateString).toLocaleDateString(undefined, options);
};
const formatDate2 = (dateString) => {
    const options = {year: 'numeric', month: 'short', day: 'numeric'};
    return new Date(dateString).toLocaleDateString(undefined, options);
};
const UserList = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const {logout} = useAuth();
    const [orderStatusFilter, setOrderStatusFilter] = useState('');
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    const handleFilterChange = (event) => {
        setOrderStatusFilter(event.target.value);
    };

    const handleRowClick = (orderID) => {
        navigate(`/dieteditor/${orderID}`);
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
                    params.orderStatus = orderStatusFilter;
                }

                const response = await axios.get(ip + '/api/users/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    params: params
                });
                setUsers(response.data);
                setTotalPages(Math.ceil(response.data.count / 10));

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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    function translateStatus(status) {
        const statusTranslations = {
            'completed': 'Zakończone',
            'Completed': 'Zakończone',
            'pending': 'Oczekujące',
            'Pending': 'Oczekujące',
            'Cancelled': 'Anulowane',
            'cancelled': 'Anulowane',
            'new': 'Nowe',
            'New': 'Nowe',
        };

        return statusTranslations[status] || status;
    }

    return (
        <div className="container mx-auto p-4">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Szukaj użytkowników"
                className="p-2 border border-gray-300 rounded mb-4 w-full"
            />

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className=" w-40 py-2 px-4 border-b border-gray-200">ID zamówienia</th>
                        <th className="py-2 px-4 border-b border-gray-200">Nazwa użytkownika</th>
                        <th className="py-2 px-4 border-b border-gray-200">
                            <select
                                value={orderStatusFilter}
                                onChange={handleFilterChange}
                                className="p-2 border border-gray-300 rounded"
                                onFocus={() => setIsSelectOpen(true)}
                                onBlur={() => setIsSelectOpen(false)}
                            >
                                <option value="">{isSelectOpen ? "Wszystkie" : "Status"}</option>
                                <option value="completed">Zakończone</option>
                                <option value="pending">Oczekujące</option>
                                <option value="new">Nowe</option>
                                <option value="cancelled">Anulowane</option>
                            </select>

                        </th>
                        <th className="py-2 px-4 border-b border-gray-200">Długość diety</th>
                        <th className="py-2 px-4 border-b border-gray-200">Złożenie zamówienia</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.results ? (
                        users.results.map(zamowienie => (
                            <tr key={zamowienie.id}
                                onClick={() => handleRowClick(zamowienie.id, zamowienie.uzytkownik)}
                                className="hover:bg-gray-100 cursor-pointer">
                                <td className="py-2 px-4 border-b border-gray-200">{zamowienie.id}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{zamowienie.username}</td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    {translateStatus(zamowienie.status)}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    {zamowienie.duration + ' msc'}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <span className="block md:hidden">{formatDate2(zamowienie.data_rozpoczecia)}</span>
                                    <span className="hidden md:block">{formatDate(zamowienie.data_rozpoczecia)}</span>
                                </td>
                            </tr>
                        ))
                    ) : null}
                    </tbody>


                </table>
            </div>

            <div className="mt-4 flex justify-center">
                {Array.from({length: totalPages}, (_, i) => i + 1).map(pageNumber => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`mx-1 px-4 py-2 rounded ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserList;