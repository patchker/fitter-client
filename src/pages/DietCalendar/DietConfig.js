import React, { useState } from 'react';
import axios from 'axios';
import Ip from "../../config/Ip"
const DietConfigurator = ({ onSubmit }) => {
    const [diet_type, setDiet_type] = useState('standard');
    const [mealCount, setMealCount] = useState(3);
    const [preferences, setPreferences] = useState({
        gluten_free: false,
        lactose_free: false,
        nut_free: false,
        fish_free: false,
        soy_free: false,
    });

    const handleDietChange = (event) => {
        setDiet_type(event.target.value);
    };

    const handleMealCountChange = (event) => {
        setMealCount(event.target.value);
    };

    const handlePreferenceChange = (event) => {
        const { name, checked } = event.target;
        setPreferences(prev => ({
            ...prev,
            [name]: checked,
        }));
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        const accessToken = localStorage.getItem('access_token');; // Powinieneś zdobyć token w jakiś sposób
        const apiEndpoint = Ip+'/api/diet-preferences/'; // Tutaj zmień na odpowiedni endpoint
const diet_id=2
        axios.post(apiEndpoint, {
            diet_id,
            diet_type,
            mealCount,
            preferences,
            preferences_set: true,

        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Jeśli potrzebujesz autoryzacji
            },
        })
            .then(response => {
                console.log('Konfiguracja diety zaktualizowana:', response.data);
                // Tutaj możesz wykonać dalsze operacje z odpowiedzią
            })
            .catch(error => {
                if (error.response) {
                    // Zapytanie zostało wykonane i serwer odpowiedział kodem statusu
                    // który wypada poza zakres 2xx
                    console.error('Nie udało się zaktualizować konfiguracji diety:', error.response);
                } else if (error.request) {
                    // Zapytanie zostało wysłane, ale nie otrzymało odpowiedzi
                    // `error.request` jest instancją XMLHttpRequest w przeglądarce i instancją
                    // http.ClientRequest w node.js
                    console.error('Brak odpowiedzi z serwera:', error.request);
                } else {
                    // Coś poszło nie tak w trakcie tworzenia zapytania
                    console.error('Error', error.message);
                }
            });
    };

// Twoja dalsza logika komponentu pozostaje bez zmian



    return (
        <div className="max-w-lg mx-auto p-8">
            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Konfiguracja diety</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                        Typ diety:
                    </label>
                    <select
                        className="form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={diet_type}
                        onChange={handleDietChange}
                    >
                        <option value="standard">Standardowa</option>
                        <option value="vegetarian">Wegetariańska</option>
                        <option value="vegan">Wegańska</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                        Liczba posiłków dziennie:
                    </label>
                    <input
                        type="number"
                        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        min="1"
                        max="6"
                        value={mealCount}
                        onChange={handleMealCountChange}
                    />
                </div>

                <fieldset className="mb-4">
                    <legend className="text-gray-700 font-bold mb-2">Preferencje:</legend>
                    <div className="space-y-4">
                        {Object.entries(preferences).map(([key, value]) => (
                            <label key={key} className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    name={key}
                                    checked={value}
                                    onChange={handlePreferenceChange}
                                />
                                <span className="ml-2 text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className="flex justify-end mt-6">
                    <button
                        className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600"
                        type="submit"
                    >
                        Zapisz
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DietConfigurator;
