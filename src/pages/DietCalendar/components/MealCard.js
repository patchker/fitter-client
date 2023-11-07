import React from 'react';
import {Tooltip} from 'react-tooltip';
import {Link} from 'react-router-dom';
import "./Tooltips.css";
import {FaBone, FaTint, FaBreadSlice} from "react-icons/fa";

function MealCard({mealGroup}) {
    const time = mealGroup.time;

    return (
        <div className="flex flex-col items-start space-y-2">
            <span className="text-lg font-medium">{time}</span>
            {mealGroup.meals.map(meal => {
                const tooltipId = `mealTip-${meal.uuid}`;
                return (
                    <div key={meal.id} className="bg-white p-3 rounded-md shadow-sm w-full">
                        <div id={tooltipId}>
                            <p>{meal.meal} ({meal.quantity}g)</p>

                        </div>
                        <Tooltip
                            key={`${meal.id}-${meal.quantity}`}
                            anchorSelect={`#${tooltipId}`}
                            clickable
                            style={{zIndex: 1000}}
                            className="tooltip hover:bg-white hover:opacity-100"
                        >
                            <div className="tooltip-content hover:opacity-100">
                                <img src={meal.image_url} alt="meal" className="w-20 h-20 mb-2 rounded"/>
                                <p className="text-black text-lg mb-2"><strong>{meal.meal}</strong></p>
                                <p className="text-sm text-gray-600 mb-2">{meal.short_description}</p>
                                <div className="flex items-center mb-2">
                                    <FaBone/>
                                    <span>{meal.protein * (meal.quantity) / 100}g</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <FaTint/>
                                    <span>{meal.fats * (meal.quantity) / 100}g</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <FaBreadSlice/>
                                    <span>{meal.carbohydrates * (meal.quantity) / 100}g</span>
                                </div>
                                <p className="text-sm mb-2"><strong>Czas
                                    przygotowania: </strong> {meal.preparation_time} min</p>
                                <p className="text-sm"><strong>Kalorie:</strong> {meal.calories}kcal</p>
                                <Link to={`/recipe/${meal.id}`} className="tooltip-button bg-emerald-600">
                                    Sprawdź przepis
                                </Link>
                            </div>
                        </Tooltip>
                    </div>
                );
            })}


        </div>
    );
}
export default MealCard;
