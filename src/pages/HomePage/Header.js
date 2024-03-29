import {useAuth} from '../../contexts/AuthContext';
import React, {useState, useEffect, useRef, useContext} from 'react';
import {useLocation, Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import ip from '../../config/Ip'
import {FaBars} from "react-icons/fa";
import {FaXmark} from "react-icons/fa6";
import {OrderPlacedContext} from '../../contexts/orderPlacedContext';

function Header() {
    const {currentUser, setCurrentUser, logout, currentRole, setCurrentRole} = useAuth();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();
    const [dietPath, setDietPath] = useState("/dieta");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef();
    const [fetch, setFetch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {orderPlaced, setOrderPlaced} = useContext(OrderPlacedContext);


    useEffect(() => {

        if (orderPlaced) {
            setDietPath("/dietcalendar");

        } else {
            setDietPath("/dieta");

        }

    }, [orderPlaced]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const fetchOrders = async (userToken) => {
        try {
            const response = await axios.get(ip + '/api/user_orders/', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });


            if (response.data.length === 0)  {
                setDietPath("/dieta")
                return null;
            }
            return response.data;
        } catch (error) {
            console.error('There was an error fetching the orders!', error);
            return null;
        }
    };


    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);


    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            const checkSubscription = async () => {
                const userToken = localStorage.getItem('access_token');
                const orders = await fetchOrders(userToken);

                if (orders && orders.length > 0) {
                    const lastOrder = orders[orders.length - 1];
                    const currentDate = new Date();
                    const startDate = new Date(lastOrder.data_rozpoczecia);
                    const endDate = new Date(lastOrder.data_zakonczenia);

                    endDate.setHours(23, 59, 59, 999);

                    if (currentDate >= startDate && currentDate <= endDate) {
                        setDietPath("/dietcalendar");
                    } else {
                        setDietPath("/dieta");
                    }
                } else {
                    setDietPath("/dieta");
                }

                setIsLoading(false);
            };

            checkSubscription();
        } else {
            setDietPath("/dieta");
        }
    }, [currentUser, fetch]);


    const handleMouseEnter = () => {
        setIsMenuVisible(true);
    };

    const handleMouseLeave = () => {
        setIsMenuVisible(false);
    };

    const handleLogout = () => {
        logout();
        setDietPath("/dieta");
        localStorage.removeItem('access_token');
        navigate('/login');
    };


    return (
        <header className="bg-white text-black shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" class="flex items-center">
                    <img src="./logo2.png" className="w-12"/>
                    <h1 className="text-2xl font-bold font-masque ml-3l">Fitter</h1>
                </Link>

                <div className="lg:hidden mr-5">
                    <button onClick={toggleMenu} className="text-black">
                        <FaBars className="text-2xl"/>
                    </button>
                </div>
                <nav ref={menuRef}
                     className={`fixed right-0 top-0 h-full bg-white z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out w-60 border-l-2 lg:w-auto lg:translate-x-0 lg:relative lg:flex lg:border-0`}>
                    <ul className={`flex flex-col lg:space-y-0  lg:flex-row lg:space-x-4 py-8 lg:py-0 ${isMenuOpen && 'mt-10'}`}>
                        {isLoading ? <span>Loading...</span> : (
                            <Link
                                to={dietPath}
                                className="hover:underline"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <li className={` border-b-2 sm:border-b-2 lg:border-0 py-2 ${isMenuOpen && 'bg-gray-300 rounded m-1'}`}>

                                    Dieta

                                </li>
                            </Link>
                        )}
                        {currentRole && currentRole.includes("Dietetyk") &&
                            <Link to="/userlist" className="hover:underline" onClick={() => setIsMenuOpen(false)}>

                                <li className={` border-b-2 sm:border-b-2 lg:border-0 py-2 ${isMenuOpen && 'bg-gray-300 rounded m-1'} `}>
                                    DietEditor
                                </li>
                            </Link>

                        }

                        <Link to="/body"
                              className="hover:underline"
                              onClick={() => setIsMenuOpen(false)}>
                            <li className={`  border-b-2 sm:border-b-2 lg:border-0 py-2 ${isMenuOpen && 'bg-gray-300 rounded m-1'}`}>
                                Ciało
                            </li>
                        </Link>

                        <li className={`border-b-2 sm:border-b-2 lg:border-0 py-2 ${isMenuOpen && 'bg-gray-300 rounded m-1'}`}>
                            <div className={` ${isMenuOpen ? 'ml-0' : 'ml-10'} min-w-[120px]  `}
                                 onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                {currentUser ? (<div className="relative">
                                    <div> <span
                                        className="cursor-pointer">{currentUser}</span></div>
                                    {isMenuVisible && (<div
                                        className=" z-10 absolute  left-1/2 transform -translate-x-1/2 bg-white border p-1 rounded shadow w-full ">
                                        <Link to="/UserProfile"
                                              className="block mb-2 hover:underline 0 bg-gray-300 rounded p-2  text-black"
                                              onClick={() => setIsMenuOpen(false)}>Mój profil</Link>
                                        <Link to="/OrderList"
                                              className="block mb-2 hover:underline bg-gray-300 rounded p-2 text-black"
                                              onClick={() => setIsMenuOpen(false)}>Zamówienia</Link>
                                        <button onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                                className="hover:underline w-full text-red-500 bg-gray-300 rounded p-2">Wyloguj
                                        </button>
                                    </div>)}
                                </div>) : (<Link to="/login"
                                                 className={`hover:underline ${isMenuOpen ? 'bg-gray-300 text-black  ' : 'bg-gray-600 text-white'}  pl-5 pr-5 p-1 rounded `}
                                                 onClick={() => setIsMenuOpen(false)}>Login</Link>)}
                            </div>
                        </li>
                    </ul>
                    <div className="lg:hidden absolute top-0 right-0 p-4 mr-3">
                        <button onClick={toggleMenu} className="text-black">
                            <FaXmark className="text-2xl"/>

                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;

