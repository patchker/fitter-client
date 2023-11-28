import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../Shared/Spinner';
import { useLocation } from "react-router-dom";
import ip from "../../../config/Ip";

function Ingredients() {
    const [isLoading, setIsLoading] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const location = useLocation();
    const [currentWeekStart, setCurrentWeekStart] = useState();

    useEffect(() => {
        if (location.state && location.state.currentWeekStart) {
            setCurrentWeekStart(new Date(location.state.currentWeekStart));
        }
    }, [location]);

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const generate_diet_ingridients = () => {
        setIsLoading(true);
        const startDate = formatDate(currentWeekStart);
        const endDate = formatDate(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6));
        const accessToken = localStorage.getItem('access_token');

        axios.get(`${ip}/diet-ingredients/${startDate}/${endDate}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(response => {
            setIsLoading(false);
            setIngredients(response.data.ingredients);
        }).catch(error => {
            setIsLoading(false);
            console.log("Błąd z generacji", error);
        });
    }

    return (
        <div className="container mx-auto p-4 max-w-[600px]">
            {ingredients.length === 0 && !isLoading && (
                <div className="text-center mt-40">
                    <p className="mb-2">Kliknij, aby wygenerować listę składników diety na bieżący tydzień.</p>
                    <button
                        onClick={generate_diet_ingridients}
                        className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Generuj Składniki Diety
                    </button>
                </div>
            )}
            {isLoading && <Spinner />}
            {ingredients.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-3">Składniki na tydzień {formatDate(currentWeekStart)} - {formatDate(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6))}</h2>
                    <ul className="list-none">
                        {ingredients.map((ingredient, index) => (
                            <li key={index} className="bg-gray-100 p-4 my-2 rounded flex justify-between items-center">
                                <span className="font-bold">{ingredient.ingredient__name}</span>
                                <span className="italic">{ingredient.total_quantity} {ingredient.ingredient__measurement_unit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Ingredients;
