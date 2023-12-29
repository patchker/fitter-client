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
    const [usernameError, setUsernameError] = useState('');

    const validatePassword = (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\\[\]{};':"\\|,.<>\/?~`-]{8,}$/;
        return passwordRegex.test(value);
    };
    const validateUsername = (value) => {
        return value.length >= 4 && value.length <= 20;
    };

    const handleUsernameBlur = () => {
        setUsernameError(validateUsername(username) ? '' : 'Nazwa użytkownika musi mieć od 4 do 20 znaków.');
    }

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handlePasswordBlur = () => {
        setPasswordError(validatePassword(password) ? '' : 'Hasło musi zawierać co najmniej jedną dużą literę, jedną małą literę, jedną cyfrę i musi mieć co najmniej 8 znaków.');
    }

    const handleConfirmPasswordBlur = () => {
        setConfirmPasswordError(password === confirmPassword ? '' : 'Hasła nie są zgodne.');
    }

    const handleEmailBlur = () => {
        setEmailError(validateEmail(email) ? '' : 'Niepoprawny format.');
    }



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Zresetuj błąd
        setError("");

        // Walidacja wszystkich pól
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isUsernameValid = validateUsername(username);
        const isPasswordConfirmed = password === confirmPassword;

        if (!isEmailValid) {
            setError("Niepoprawny format email.");
            return;
        }
        if (!isPasswordValid) {
            setError("Hasło nie spełnia wymagań.");
            return;
        }
        if (!isUsernameValid) {
            setError("Nazwa użytkownika musi mieć od 4 do 20 znaków.");
            return;
        }
        if (!isPasswordConfirmed) {
            setError("Hasła nie są zgodne.");
            return;
        }

        try {
            // Wysyłanie żądania
            await axios.post(ip + '/api/register/', {
                first_name: firstName,
                last_name: lastName,
                username,
                email,
                password
            });

            // Przekierowanie po udanej rejestracji
            window.location.href = "/login?registered=true";
        } catch (error) {
            // Obsługa błędów z serwera
            if (error.response && error.response.data) {
                console.error(error.response.data);

                if (error.response.data.username) {
                    setError(error.response.data.username);
                } else {
                    setError('Wystąpił nieoczekiwany błąd.');
                }
            } else {
                setError('Wystąpił nieoczekiwany błąd.');
            }
        }
    };


    return (

        <div className="w-full mt-10 bg-white shadow-2xl rounded-3xl h-[750px]">
            <div className="font-masque text-5xl pt-5">Fitter</div>
            <div className="mt-10">Dołącz do nas</div>
            <form onSubmit={handleSubmit} className=" rounded px-8 pt-6 mb-4">

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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={handleUsernameBlur}
                    />
                    {usernameError && <p className="text-red-500 text-xs italic">{usernameError}</p>}

                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm  mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="text" placeholder="Email"
                        value={email}
                        onBlur={handleEmailBlur}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
                        Hasło
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="Hasło"
                        onBlur={handlePasswordBlur}
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2" htmlFor="confirmPassword">
                        Potwierdź hasło
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirmPassword" type="password" placeholder="Potwierdź hasło"
                        onBlur={handleConfirmPasswordBlur}
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    />


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

            {/*
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
*/}
            <div className="mt-4 pb-10 w-[300px] flex justify-center items-center m-auto sm:absolute top-[720px] right-[173px] sm:right-[100px] sm:top-[603px] md:right-[100px] md:top-[603px]  lg:left-[-700px] lg:top-[350px] ">
                <button
                    onClick={props.handleBackClick}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center lg:px-8 lg:py-4 lg:rounded-lg"
                >
                    <span className="mr-2">Logowanie</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                </button>

            </div>


        </div>

    );
}

export default Register;
