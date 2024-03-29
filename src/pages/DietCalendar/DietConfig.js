import React, {useState} from 'react';
import axios from 'axios';
import Ip from "../../config/Ip"
import {useNavigate} from "react-router-dom";
import {useLocation} from 'react-router-dom';

const DietConfigurator = ({onSubmit}) => {
    const [diet_type, setDiet_type] = useState('standard');
    const [mealCount, setMealCount] = useState(3);
    const [otherComments, setOtherComments] = useState('');
    const [step, setStep] = useState(1);

    const categorizedDishes = {
        Śniadania: ['Owsianka', 'Jajecznica', 'Smoothie', 'Tosty z awokado'],
        Obiady: ['Pierogi', 'Pizza', 'Spaghetti', 'Sushi'],
        Kolacje: ['Sałatka', 'Zupa pomidorowa', 'Risotto', 'Wrapy'],
        Przekąski: ['Owoce', 'Orzechy', 'Warzywne paluszki', 'Domowe batoniki'],
        Desery: ['Ciasto bananowe', 'Mus czekoladowy', 'Pudding chia', 'Owocowe sorbety']
    };

    const preferenceValues = {
        "Nie lubię": 0,
        "Neutralnie": 1,
        "Lubię": 2
    };


    const initialFoodPreferences = Object.values(categorizedDishes).flat().reduce((prefs, dish) => {
        prefs[dish] = 1;
        return prefs;
    }, {});
    const [foodPreferences, setFoodPreferences] = useState(initialFoodPreferences);
    const dislikedDishes = ['Brussels Sprouts', 'Oysters', 'Tripe', 'Durian'];


    const handleDislikedFoodChange = (event) => {
        const dish = event.target.value;
        setDislikes(dislikes.includes(dish) ? dislikes.filter(item => item !== dish) : [...dislikes, dish]);
    };

    const [dislikes, setDislikes] = useState([]);
    const [preferences, setPreferences] = useState({
        gluten_free: false,
        lactose_free: false,
        nut_free: false,
        fish_free: false,
        soy_free: false,
    });

    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [activityLevel, setActivityLevel] = useState('low');
    const isFormValid = gender !== '' && age !== '' && weight !== '' && height !== '' && activityLevel !== '';

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    const handleAgeBlur = (e) => {
        setAge(e.target.value);
    };

    const handleWeightBlur = (e) => {
        setWeight(e.target.value);
    };
    const handleHeightBlur = (e) => {
        setHeight(e.target.value);
    };

    const handleActivityLevelChange = (e) => {
        setActivityLevel(e.target.value);
    };

    const navigate = useNavigate();

    const handleNext = (event) => {
        event.preventDefault();
        setStep(step + 1);
    };

    const handlePrev = (event) => {
        event.preventDefault();
        setStep(step - 1);
    };

    const handleFinalSubmit = (event) => {
        event.preventDefault();
    };

    const handleCommentsChange = (event) => {
        setOtherComments(event.target.value);
    };
    const location = useLocation();
    const state = location.state;

    const handleDietChange = (event) => {
        setDiet_type(event.target.value);
    };

    const handleMealCountChange = (event) => {
        setMealCount(event.target.value);
    };

    const handlePreferenceChange = (event) => {
        const {name, checked} = event.target;
        setPreferences(prev => ({
            ...prev,
            [name]: checked,
        }));
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        const accessToken = localStorage.getItem('access_token');
        const apiEndpoint = Ip + '/api/diet-preferences/';
        const diet_id = state.orderInfo.dieta
        const orderID = state.orderInfo.id


        axios.post(apiEndpoint, {
            diet_id,
            diet_type,
            orderID,
            mealCount,
            preferences,
            foodPreferences,
            preferences_set: true,
            gender,
            age,
            weight,
            height,
            activityLevel,

        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                navigate("../dietcalendar")
            })
            .catch(error => {
                if (error.response) {
                    console.error('Nie udało się zaktualizować konfiguracji diety:', error.response);
                } else if (error.request) {
                    console.error('Brak odpowiedzi z serwera:', error.request);
                } else {
                    console.error('Error', error.message);
                }
            });
    };


    const handleFoodPreferenceChange = (dish, preferenceLabel) => {
        const preferenceValue = preferenceValues[preferenceLabel];
        setFoodPreferences(prevPreferences => ({
            ...prevPreferences,
            [dish]: preferenceValue,
        }));
    };


    const allPreferencesSelected = () => {
        return Object.values(foodPreferences).every(preference => preference !== "");
    };
    const preferencesMapping = {
        'gluten_free': 'Bez glutenu',
        'lactose_free': 'Bez laktozy',
        'nut_free': 'Bez orzechów',
        'fish_free': 'Bez ryb',
        'soy_free': 'Bez soi',
    };
    return (
        <div>


            {step === 1 && (
                <div className="max-w-4xl mx-auto p-8">
                    <h2 className="text-7xl font-masque text-gray-900 mb-20 text-center">WITAMY W EKIPIE!</h2>

                    <form onSubmit={handleSubmit}
                          className="bg-gray-50 shadow-2xl rounded-3xl px-8 pt-6 pb-8 border border-gray-100">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Konfiguracja nowej
                            diety</h2>

                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="mb-4 md:mb-0">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Typ diety:
                                </label>
                                <select
                                    className="form-select text-center block py-2 w-full text-xl mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={diet_type}
                                    onChange={handleDietChange}
                                >
                                    <option value="standard">Standardowa</option>
                                    <option value="vegetarian">Wegetariańska</option>
                                    <option value="vegan">Wegańska</option>
                                    <option value="lowIG">Dieta z niskim IG</option>
                                </select>
                            </div>

                            <div className="mb-4 md:mb-0">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Liczba posiłków dziennie:
                                </label>
                                <input
                                    type="number"
                                    className="form-input mt-1 text-xl text-center block w-full py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    min="1"
                                    max="6"
                                    value={mealCount}
                                    onChange={handleMealCountChange}
                                />
                            </div>
                        </div>

                        <fieldset className="mb-4 mt-6">
                            <legend className="text-gray-700 text-sm font-bold mb-2">Preferencje:</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(preferences).map(([key, value]) => (
                                    <label key={key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            name={key}
                                            checked={value}
                                            onChange={handlePreferenceChange}
                                        />
                                        <span className="ml-2 text-gray-700">
                    {preferencesMapping[key] || key}
                </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>


                        <div className="mb-6">
                            <label htmlFor="otherComments" className="block text-gray-700 text-sm font-bold mb-2">
                                Inne uwagi dotyczące diety:
                            </label>
                            <textarea
                                id="otherComments"
                                rows="4"
                                className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={otherComments}
                                onChange={handleCommentsChange}
                                placeholder="Twoje uwagi..."
                            />
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                className="px-6 py-2 text-sm font-bold text-white transition-colors duration-200 transform bg-emerald-500 rounded-md hover:bg-emerald-700 focus:outline-none focus:bg-emerald-600"
                                onClick={handleNext}
                            >
                                Dalej
                            </button>
                        </div>
                    </form>
                </div>)}

            {step === 2 && (
                <div className="max-w-4xl mx-auto p-8">
                    <h2 className="text-7xl font-masque text-gray-900 mb-20 text-center">WITAMY W EKIPIE!</h2>
                    <form onSubmit={handleSubmit}
                          className="bg-gray-50 shadow-2xl rounded-3xl px-8 pt-6 pb-8 border border-gray-100">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Co lubisz jeść?</h2>

                        {Object.entries(categorizedDishes).map(([category, dishes], categoryIndex) => (
                            <div key={categoryIndex} className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{category}</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {dishes.map((dish, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-gray-700">{dish}</span>
                                            <div className="flex items-center">
                                                {['Nie lubię', 'Neutralnie', 'Lubię'].map(preferenceLabel => (
                                                    <label key={preferenceLabel}
                                                           className="inline-flex items-center ml-6">
                                                        <input
                                                            type="radio"
                                                            name={dish}
                                                            value={preferenceValues[preferenceLabel]}
                                                            checked={foodPreferences[dish] === preferenceValues[preferenceLabel]}
                                                            onChange={() => handleFoodPreferenceChange(dish, preferenceLabel)}
                                                            className="form-radio h-5 w-5 text-indigo-600"
                                                        />
                                                        <span
                                                            className="ml-2 text-gray-700 capitalize">{preferenceLabel}</span>
                                                    </label>
                                                ))}

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between mt-6">
                            <button
                                className="px-6 h-9 mt-6 text-sm font-bold text-white transition-colors duration-200 transform bg-gray-500 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-600"
                                onClick={handlePrev}
                            >
                                Wstecz
                            </button>

                            <div className="flex justify-end mt-6">
                                <button
                                    className="px-6 py-2 text-sm font-bold text-white transition-colors duration-200 transform bg-emerald-500 rounded-md hover:bg-emerald-700 focus:outline-none focus:bg-emerald-600"
                                    onClick={handleNext}
                                >
                                    Dalej
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            )}


            {step === 3 && (
                <div className="max-w-4xl mx-auto p-8">
                    <h2 className="text-7xl font-masque text-gray-900 mb-20 text-center">WITAMY W EKIPIE!</h2>

                    <form onSubmit={handleSubmit}
                          className="bg-gray-50 shadow-2xl rounded-3xl px-8 pt-6 pb-8 border border-gray-100">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Powiedz nam coś o
                            sobie.</h2>

                        <div className="mb-6">
                            {/* Płeć */}
                            <label className="block mb-2 text-sm font-medium text-gray-900">Płeć</label>
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={handleGenderChange}
                            >
                                <option value="male">Mężczyzna</option>
                                <option value="female">Kobieta</option>
                            </select>

                            {/* Wiek */}
                            <label className="block mt-4 mb-2 text-sm font-medium text-gray-900">Wiek</label>
                            <input
                                type="number"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onBlur={handleAgeBlur}
                            />

                            {/* Waga */}
                            <label className="block mt-4 mb-2 text-sm font-medium text-gray-900">Waga (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onBlur={handleWeightBlur}
                            />

                            {/* Wzrost */}
                            <label className="block mt-4 mb-2 text-sm font-medium text-gray-900">Wzrost (cm)</label>
                            <input
                                type="number"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onBlur={handleHeightBlur}
                            />

                            {/* Poziom aktywności fizycznej */}
                            <label className="block mt-4 mb-2 text-sm font-medium text-gray-900">Poziom aktywności
                                fizycznej</label>
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={handleActivityLevelChange} // Użyj `onChange` zamiast `onBlur`
                            >
                                <option value="low">Niska</option>
                                <option value="medium">Średnia</option>
                                <option value="high">Wysoka</option>
                            </select>
                        </div>
                        {/* Przyciski nawigacyjne */}
                        <div className="flex justify-between mt-6">
                            <button
                                className="px-6 py-2 text-sm font-bold text-white transition-colors duration-200 transform bg-gray-500 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-600"
                                onClick={handlePrev}
                            >
                                Wstecz
                            </button>


                            <button
                                type="submit"
                                disabled={!isFormValid}

                                className={`px-6 py-2 text-sm font-bold text-white transition-colors duration-200 rounded transform ${isFormValid ? 'bg-emerald-500 hover:bg-emerald-700 focus:outline-none focus:bg-emerald-600' : 'bg-gray-500'}`}
                            >
                                Zapisz i prześlij
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </div>
    );
};

export default DietConfigurator;
