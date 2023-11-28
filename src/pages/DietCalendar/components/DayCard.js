import React from 'react';
import MealCard from './MealCard';

function calculateMacros(meals) {
    let totalProteins = 0;
    let totalFats = 0;
    let totalCarbs = 0;

    meals.forEach(meal => {
        totalProteins += parseFloat(meal.protein * (meal.quantity) / 100) || 0;
        totalFats += parseFloat(meal.fats * (meal.quantity) / 100) || 0;
        totalCarbs += parseFloat(meal.carbohydrates * (meal.quantity) / 100) || 0;
    });

    return {
        totalProteins,
        totalFats,
        totalCarbs
    };
}

function DayCard({day, date, meals, isToday}) {
    const {totalProteins, totalFats, totalCarbs} = calculateMacros(meals);


    const mealsByTimeAndType = meals.reduce((acc, meal) => {
        // Klucz do grupowania to czas i typ posiłku
        const key = `${meal.time}-${meal.type}`;
        if (!acc[key]) {
            acc[key] = {
                time: meal.time,
                type: meal.type,
                meals: []
            };
        }
        acc[key].meals.push(meal);
        return acc;
    }, {});

    const mealsArray = Object.values(mealsByTimeAndType);


    return (
        <div
            className={`bg-gray-100 p-4 rounded-lg  shadow-md space-y-4 h-full ${isToday ? 'ring-4 ring-blue-300' : ''}`}
            style={{minHeight: '450px'}}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{day.charAt(0).toUpperCase() + day.slice(1)}</h2>
                <span className="text-gray-500">{date}</span>
            </div>

            <div className="flex justify-between items-center">
                <span>B: {totalProteins}g</span>
                <span>T: {totalFats}g</span>
                <span>W: {totalCarbs}g</span>
            </div>
            {mealsArray.length > 0 ? (
                mealsArray.map((group, index) => (
                    <MealCard key={index} mealGroup={group}/>
                ))
            ) : (
                <p className="text-gray-500">Pusto</p>
            )}
        </div>
    );

}

export default DayCard;
