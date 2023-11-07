import React, {useState} from 'react';
import axios from 'axios';
import ip from "../../config/Ip";

function Register(props) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validatePassword = (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(value);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        setPasswordError(validatePassword(value) ? '' : 'Password must contain at least one uppercase letter, one lowercase letter, and one number and must have at least 8 characters.');
    }

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
        setConfirmPasswordError(password === value ? '' : 'Passwords do not match.');
    }
    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Hasła nie są zgodne.");
            return;
        }

        try {
            await axios.post(ip + '/api/register/', {
                first_name: firstName,
                last_name: lastName,
                username,
                email,
                password
            });

            window.location.href = "/login?registered=true";
        } catch (error) {
            if (error.response && error.response.data) {
                console.error(error.response.data);

                if (error.response.data.username) {
                    setError(error.response.data.username);
                } else {
                    setError('An unexpected error occurred.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
        }

    };

    return (

        <div className="w-full mt-10 bg-white shadow-2xl rounded-3xl">
            <div className="font-masque text-5xl pt-5">Nazwa</div>
            <div className="mt-10">Dołącz do nas</div>
            <form onSubmit={handleSubmit} className=" rounded px-8 pt-6 pb-8 mb-4">

                {/* First Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2" htmlFor="firstName">
                        Imię
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="firstName" type="text" placeholder="Imię"
                        value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2" htmlFor="lastName">
                        Nazwisko
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="lastName" type="text" placeholder="Nazwisko"
                        value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm  mb-2" htmlFor="username">
                        Nazwa użytkownika
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="Nazwa użytkownika"
                        value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm  mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="text" placeholder="Email"
                        value={email} onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(validateEmail(e.target.value) ? '' : 'Invalid email format.');
                    }}/>
                    {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
                        Hasło
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="Hasło"
                        value={password} onChange={(e) => handlePasswordChange(e.target.value)}/>
                    {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2" htmlFor="confirmPassword">
                        Potwierdź hasło
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirmPassword" type="password" placeholder="Potwierdź hasło"
                        value={confirmPassword} onChange={(e) => handleConfirmPasswordChange(e.target.value)}/>
                    {confirmPasswordError && <p className="text-red-500 text-xs italic">{confirmPasswordError}</p>}
                </div>

                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <div className="flex items-center justify-between">
                    <button
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue m-auto"
                        type="submit">
                        Zarejestruj się
                    </button>
                </div>
            </form>


            <button
                onClick={props.handleBackClick}
                className="absolute top-80 left-[-50px]  transform -translate-y-1/2 -translate-x-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center"
            >
                <div className=" text-white py-2 px-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    <span className="mr-2">Logowanie</span>

                </div>
            </button>


        </div>

    );
}

export default Register;
