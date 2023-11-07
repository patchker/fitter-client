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

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={editableData?.email || ''}
                            onChange={handleInputChange}
                            disabled={!editing}
                        />
                    </div>

                    <div className="flex items-center justify-center mt-6">
                        {!editing ? (
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditing(true);
                                }}>
                                Edit Profile
                            </button>

                        ) : (
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit">
                                Update Profile
                            </button>
                        )}
                    </div>
                    {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default UserProfile;
