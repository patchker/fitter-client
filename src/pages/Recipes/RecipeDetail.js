import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import ip from "../../config/Ip";


function RecipeDetail() {
    const [meal, setMeal] = useState({});
    const {id: mealId} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(ip+`/api/meal/${mealId}/`);
                setMeal(response.data);
            } catch (error) {
                console.error("An error occurred while fetching meal data", error);
            }
        };

        fetchData();
    }, [mealId]);

    const renderTextWithLineBreaks = (text) => {
        if (!text) {
            return <span>Brak danych</span>;
        }
        return text.split('\n').map((item, key) => {
            return <span key={key}>{item}<br/></span>;
        });
    }


    return (
        <div className="container mx-auto px-4 my-10">
            <div className="text-2xl mb-4">{meal.name}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="w-full h-96">
                    <img src={"../" + meal.image_url} alt={meal.meal}
                         className="w-full h-full object-cover rounded-md shadow-lg"/>
                </div>

                <div>
                    <h1 className="text-4xl font-bold mb-4">{meal.meal}</h1>
                    <h3 className="text-2xl font-semibold mb-4">Sposób przygotowania:</h3>
                    <p className="mb-6 text-lg">{renderTextWithLineBreaks(meal.long_description)}</p>
                </div>
            </div>

            <div className="mt-10">
                <div className="px-8 py-6 bg-gray-50 rounded-md shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">Szczegóły:</h3>
                    <p className="mb-6 text-lg"><strong>Kalorie:</strong> {meal.calories} kcal</p>
                    <p className="mb-6 text-lg"><strong>Czas przygotowania:</strong> {meal.preparation_time} minut</p>
                </div>

                <div className="px-8 py-6 mt-6 bg-gray-50 rounded-md shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">Makroskładniki:</h3>
                    <ul className="list-disc list-inside mb-6 text-lg">
                        <li><strong>Białko:</strong> {meal.protein}g</li>
                        <li><strong>Tłuszcze:</strong> {meal.fats}g</li>
                        <li><strong>Węglowodany:</strong> {meal.carbohydrates}g</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetail;
