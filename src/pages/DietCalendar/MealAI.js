import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Ip from "../../config/Ip"
import './MealAI.css';

const MealAI = () => {
    const [dietData, setDietData] = useState([]);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [maxCalories, setMaxCalories] = useState('');
    const [userWeight, setUserWeight] = useState('');
    const [mealPerDay, setMealPerDay] = useState('');

    useEffect(() => {
        const today = new Date();
        const inSevenDays = new Date();
        inSevenDays.setDate(today.getDate() + 7);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        setStartDate(formatDate(today));
        setEndDate(formatDate(inSevenDays));
        setMaxCalories(3000);
        setMealPerDay(3);
        setUserWeight(70);
    }, []);

    const fetchData = async () => {
        const url = Ip+'/generate-diet';
        const requestData = {
            start_date: startDate,
            end_date: endDate,
            meals_per_day: mealPerDay,
            not_preferred_ingredients: [],
            max_calories: maxCalories,
            dietary_preferences: [],
            allergens_to_avoid: [],
            user_weight: userWeight
        };

        try {
            const response = await axios.post(url, requestData);
            setDietData(response.data);
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
        }
    };



    return (
        <div className="diet-plan">
            <div className="input-container">
                <input
                    className="input-field"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Data rozpoczęcia"
                />
            </div>
            <div className="input-container">
                <input
                    className="input-field"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Data zakończenia"
                />
            </div>
            <div className="input-container">
                <input
                    className="input-field"
                    type="number"
                    value={maxCalories}
                    onChange={(e) => setMaxCalories(e.target.value)}
                    placeholder="Maksymalna liczba kalorii"
                />
            </div>
            <div className="input-container">
                <input
                    className="input-field"
                    type="number"
                    value={userWeight}
                    onChange={(e) => setUserWeight(e.target.value)}
                    placeholder="Waga użytkownika"
                />
            </div>
            <div className="input-container">
                <input
                    className="input-field"
                    type="number"
                    value={mealPerDay}
                    onChange={(e) => setMealPerDay(e.target.value)}
                    placeholder="Liczba posiłków"
                />
            </div>
            <button onClick={fetchData} className="fetch-button">Pobierz Plan Diety</button>
            <div className="days-container">
                {dietData.map((day, index) => (
                    <div key={index} className="day">
                        <h3 className="date-header">Data: {day.date} - {day.total_calories}kcal</h3>
                        <div className="meals">
                            {day.meals.map((meal, mealIndex) => (
                                <div key={mealIndex} className="meal-card">
                                    <div className="meal-header">
                                        <h4>{meal.name}</h4>
                                        <span className="meal-type">{meal.meal_type}</span>
                                    </div>
                                    <div className="meal-info">
                                        <p>Kalorie: {meal.calories}</p>
                                        <p>Białko: {meal.protein}</p>
                                        <p>Tłuszcz: {meal.fat}</p>
                                        <p>Węglowodany: {meal.carbs}</p>
                                        <p>Porcje: {meal.portions}</p>
                                    </div>
                                    <div className="meal-ingredients">
                                        <p>Składniki: {meal.ingredients.join(', ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealAI;
