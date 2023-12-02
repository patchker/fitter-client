import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../../contexts/AuthContext';
import ip from '../../config/Ip'

function UserProfile() {
    const {userData, setUserData} = useAuth();
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [editableData, setEditableData] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(false);
        }, 6000);
        return () => clearTimeout(timer);
    }, [showTooltip]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('Nowe hasła się nie zgadzają.');
            return;
        }
        if (!validatePassword(newPassword)) {
            setError('Hasło nie spełnia wymagań.');
            return;
        }
        const accessToken = localStorage.getItem('access_token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        try {
            const response = await axios.post(ip + '/api/change-password/', {
                old_password: oldPassword,
                new_password: newPassword
            }, { headers });

            if (response.status === 200) {
                // Obsługa pomyślnej zmiany hasła
                setChangePassword(false);
                setError('');
                setOldPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
                setShowTooltip(true)
                // Możesz też zaktualizować użytkownika lub wymusić ponowne logowanie
            }
        } catch (error) {
            console.log(error.response.data.error)
            if(error.response.data.error === "Niepoprawne stare hasło")
            {
                setError('Niepoprawne stare hasło');

            }else
            {
                setError('Wystąpił błąd podczas zmiany hasła.');


            }

            // Tutaj można obsłużyć szczegółowe błędy z odpowiedzi serwera
        }
    };

// Funkcja do walidacji siły hasła
    const validatePassword = (password) => {
        // Przykładowe kryteria: minimum 8 znaków, przynajmniej jedna cyfra i jedna wielka litera
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return regex.test(password);
    };


    useEffect(() => {
        if (!userData && !editableData) {
            const fetchData = async () => {
                try {
                    const accessToken = localStorage.getItem('access_token');
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    };
                    const response = await axios.get(ip + '/api/profile/', {headers});
                    if (response.status === 200) {
                        setUserData(response.data);
                        setEditableData(response.data);
                        setEditing(false);
                        setError('');
                    }

                } catch (err) {
                    console.error('An error occurred while fetching user data.', err);
                }
            };
            fetchData();
        } else if (userData && !editableData) {
            setEditableData(userData);
        }
    }, [userData, setUserData, editableData]);


    const handleInputChange = (e) => {
        if (editableData) {
            const {id, value} = e.target;
            setEditableData(prevData => ({
                ...prevData,
                [id]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            };

            const url = ip + `/api/profile/`;
            const response = await axios.patch(url, editableData, {headers});

            if (response.status === 200) {
                setUserData(response.data);
                setEditing(false);
                setError('');
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 3000);
            } else {
                setError('An error occurred while updating your profile.');
                console.log("EditableData: ", editableData)
            }
        } catch (error) {
            console.error('Error Response:', error.response); // logowanie szczegółów błędu
            setError('An error occurred while updating your profile.');
        }

    };


    return (
        <div className="w-full max-w-md mx-auto mt-20">
            {showTooltip && (
                <div className="fixed top-10 right-0 p-4">
                    <div className="bg-green-500 text-white p-4 rounded shadow-lg flex items-center">
                        <p>Profil został pomyślnie zaktualizowany!</p>
                        <button onClick={() => setShowTooltip(false)} className="ml-4 text-xl">×</button>
                    </div>
                </div>
            )}
            <div className="bg-white shadow-2xl rounded-3xl px-8 pt-6 pb-8 mb-4">
                <h1 className="mb-6 text-2xl font-bold">Profil Użytkownika</h1>

                {!changePassword ? (
                    <div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2" htmlFor="first_name">
                            Imię
                        </label>
                        <input
                            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="first_name"
                            type="text"
                            placeholder="Imię"
                            value={editableData?.first_name || ''}
                            onChange={handleInputChange}
                            disabled={!editing}
                        />

                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2" htmlFor="last_name">
                            Nazwisko
                        </label>
                        <input
                            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="last_name"
                            type="text"
                            placeholder="Nazwisko"
                            value={editableData?.last_name || ''}
                            onChange={handleInputChange}
                            disabled={!editing}
                        />
                    </div>



                    <div className="flex items-center gap-5 justify-center mt-6">
                        {!editing ? (
                            <button
                                className="bg-emerald-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditing(true);
                                }}>
                                Edytuj dane
                            </button>

                        ) : (
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit">
                                Zatwierdź dane
                            </button>
                        )}

                        <button
                            onClick={() => setChangePassword(true)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Zmień hasło
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
                </form>



                    </div>
                ) : (
                    <form onSubmit={handlePasswordChange}>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2" htmlFor="last_name">
                                Stare hasło
                            </label>
                            <input
                                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="password"
                                placeholder="Stare hasło"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2" htmlFor="last_name">
                                Nowe hasło
                            </label>
                            <input
                                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="password"
                                placeholder="Nowe hasło"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2" htmlFor="last_name">
                                Potwierdź nowe hasło
                            </label>
                            <input
                                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="password"
                                placeholder="Potwierdź nowe hasło"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2" htmlFor="last_name">
                                {error}
                            </label>

                        </div>
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Zatwierdź zmianę hasła
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
