import {useAuth} from '../../contexts/AuthContext';
import React, {useState, useEffect, useRef, useContext} from 'react';
import {useLocation, Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import ip from '../../config/Ip'
import {FaBars} from "react-icons/fa";
import { usePayment } from '../../contexts/PaymentContext';
import { OrderPlacedContext } from '../../contexts/orderPlacedContext';

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
    const { orderPlaced, setOrderPlaced } = useContext(OrderPlacedContext);

    console.log("AAAAA",currentRole)
    useEffect(() => {
        console.log("ORder placed");
        if(orderPlaced)
        {
            setDietPath("/dietcalendar");

        }else{
            setDietPath("/dieta");

        }

    }, [orderPlaced]);

console.log("orderPlaced",orderPlaced)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const fetchOrders = async (userToken) => {
        console.log("Fetching orders")
        try {
            const response = await axios.get(ip + '/user_orders/', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            console.log("Fetching orders response", response.data)
            if (response.data.length === 0) {
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

                if (orders && orders.some(order => {
                    const currentDate = new Date();
                    const startDate = new Date(order.data_rozpoczecia);
                    const endDate = new Date(order.data_zakonczenia);
                    return currentDate >= startDate && currentDate <= endDate;
                })) {
                    setDietPath("/dietcalendar");
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
                <img src="../logo2.png" className="w-12"/>
                <h1 className="text-2xl font-bold font-masque ml-3l">Nazwa</h1>
            </Link>

            <div className="lg:hidden">
                <button onClick={toggleMenu} className="text-black">
                    <FaBars className="text-2xl"/>
                </button>
            </div>
            <nav ref={menuRef}
                 className={`fixed right-0 top-0 h-full bg-white z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out w-60 border-l-2 lg:w-auto lg:translate-x-0 lg:relative lg:flex lg:border-0`}>
                <ul className={`flex flex-col lg:space-y-0 lg:flex-row lg:space-x-4 py-8 lg:py-0 ${isMenuOpen && 'mt-10'}`}>
                    <li className=" border-b-2 sm:border-b-2 lg:border-0 py-2">
                        {isLoading ? <span>Loading...</span> : (
                            <Link
                                to={dietPath}
                                className="hover:underline"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dieta
                            </Link>
                        )}
                    </li>

                    {currentRole && currentRole.includes("Dietetyk") &&
                        <li className=" border-b-2 sm:border-b-2 lg:border-0 py-2">
                            <Link to="/userlist" className="hover:underline" onClick={() => setIsMenuOpen(false)}>
                                DietaMaker
                            </Link>
                        </li>
                    }



                    <li className="  border-b-2 sm:border-b-2 lg:border-0 py-2"><Link to="/body"
                                                                                      className="hover:underline"
                                                                                      onClick={() => setIsMenuOpen(false)}>Ciało</Link></li>

                    <li>
                        <div className={` ${isMenuOpen ? 'ml-0' : 'ml-10'} min-w-[100px] mt-2`}
                             onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            {currentUser ? (<div className="relative">
                                <Link to="/UserProfile" onClick={() => setIsMenuOpen(false)}><span
                                    className="cursor-pointer">{currentUser}</span></Link>
                                {isMenuVisible && (<div
                                    className=" z-10 absolute left-1/2 transform -translate-x-1/2 bg-white border p-2 rounded shadow min-w-[100px]">
                                    <Link to="/UserProfile" className="block mb-2 hover:underline"
                                          onClick={() => setIsMenuOpen(false)}>Mój profil</Link>
                                    <Link to="/OrderList" className="block mb-2 hover:underline"
                                          onClick={() => setIsMenuOpen(false)}>Zamówienia</Link>
                                    <button onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }} className="hover:underline text-red-500">Wyloguj
                                    </button>
                                </div>)}
                            </div>) : (<Link to="/login"
                                             className="hover:underline bg-gray-600 pl-5 pr-5 p-1 rounded text-white"
                                             onClick={() => setIsMenuOpen(false)}>Login</Link>)}
                        </div>
                    </li>
                </ul>
                <div className="lg:hidden absolute top-0 right-0 p-4">
                    <button onClick={toggleMenu} className="text-black">
                        Close
                    </button>
                </div>
            </nav>
        </div>
    </header>
    );
}

export default Header;

