import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import {useLocation} from 'react-router-dom';
import {motion} from "framer-motion";
import Register from '../Register/Register';
import ip from '../../config/Ip'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {setCurrentUser} = useAuth();
    const [showTooltip, setShowTooltip] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate()
    const location = useLocation();
    const handleBackClick = () => {
        setShowLogin(true);
        setTimeout(() => {
            setShowRegister(false);
        }, 300);
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
        setTimeout(() => {
            setShowLogin(false);
        }, 300);
    };


    useEffect(() => {
        if (new URLSearchParams(location.search).get('registered') === 'true') {
            setShowTooltip(true);
            const timer = setTimeout(() => {
                setShowTooltip(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [location]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(ip + '/api/token/', {
                username,
                password
            });
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                setCurrentUser(username);
                navigate('/dashboard?logged=true')
            }
        } catch (err) {
            setError("Nieprawidłowa nazwa użytkownika lub hasło.");
        }
    };


    return (
        <div className="flex flex-col items-center h-screen mb-32">
            <div className="relative w-[500px] ">
                {showLogin && (
                    <motion.div
                        className="absolute w-full mt-20"
                        initial={{x: showRegister ? 300 : 0, opacity: 0}}
                        animate={{x: showRegister ? 300 : 0, opacity: showRegister ? 0 : 1}}
                        transition={{duration: 0.3}}
                    >
                        <div className=" relative w-full">
                            {showTooltip && (
                                <div className="fixed top-20 right-0 p-4">
                                    <div
                                        className="bg-green-500 text-white p-4 rounded-3xl shadow-lg flex items-center">
                                        <p>Pomyślnie zarejestrowano! Możesz się teraz zalogować.</p>
                                        <button onClick={() => setShowTooltip(false)} className="ml-4 text-xl">×
                                        </button>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}
                                  className="shadow-2xl rounded-3xl px-4 pt-6 pb-8 mb-4 bg-white h-[500px]">

                                <div className="font-masque text-5xl mb-20">NAZWA</div>
                                <div className=" text-xl mb-8">Zaloguj się za pomocą swoich danych</div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm mb-2" htmlFor="username">
                                        Nazwa użytkownika
                                    </label>
                                    <input
                                        className="shadow appearance-none border-2 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="username" type="text" placeholder="Nazwa użytkownika"
                                        value={username} onChange={(e) => setUsername(e.target.value)}/>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
                                        Hasło
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="password" type="password" placeholder="Hasło"
                                        value={password} onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                                <div className="mb-5 font-bold">


                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue m-auto"
                                        type="submit">
                                        Zaloguj
                                    </button>
                                </div>
                                {/* Przycisk rejestracji */}
                                <div className="mt-4 md:absolute md:right-0 md:top- md:transform md:-translate-y-1/2 lg:right-[-250px] lg:top-[250px]">
                                    <button
                                        onClick={handleRegisterClick}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center lg:px-8 lg:py-4 lg:rounded-lg"
                                    >
                                        <span className="mr-2">Rejestracja</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                                        </svg>
                                    </button>

                                </div>

                            </form>


                        </div>
                    </motion.div>
                )}

                {showRegister && (
                    <motion.div
                        className="absolute w-full"
                        initial={{x: -300, opacity: 0}}
                        animate={{
                            x: showLogin ? -300 : 0,
                            opacity: showLogin ? 0 : 1
                        }}
                        transition={{
                            duration: 0.3,
                            delay: showLogin ? 0 : 0.3
                        }}
                        exit={{x: 0, opacity: 0}}
                    >
                        <Register handleBackClick={handleBackClick}/>
                    </motion.div>
                )}


            </div>
        </div>
    );
}

export default Login;
