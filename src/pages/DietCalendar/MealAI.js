import React, { useState } from 'react';
import axios from 'axios';
import Ip from "../../config/Ip"
import './MealAI.css'; // Zaimportuj plik CSS

const MealAI = () => {
    const [dietData, setDietData] = useState([]);

    const fetchData = async () => {
        const url = Ip+'/generate-diet'; // Adres URL do Twojego API
        const requestData = {
            start_date: "2023-12-01",
            end_date: "2023-12-07",
            meals_per_day: 4,
            not_preferred_ingredients: [],
            max_calories: 4000,
            dietary_preferences: [],
            allergens_to_avoid: [],
            user_weight: 60
        };

        try {
            const response = await axios.post(url, requestData);
            console.log(response.data); // Tutaj możesz przetworzyć odpowiedź
            setDietData(response.data)
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
        }
    };

    return (
        <div className="diet-plan">
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
