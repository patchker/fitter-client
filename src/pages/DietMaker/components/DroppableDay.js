import {FaDrumstickBite} from "react-icons/fa";
import {FaDroplet, FaWheatAwn} from "react-icons/fa6";
import React from "react";

function DroppableDay({
                          day,
                          onMealDropped,
                          meals,
                          isDragging,
                          updateMealGrams,
                          updateMealCalories,
                          saveDietData,
                          handleChanges,
                          setMeals,
                          handleDeleteMeal,
                          dietPlanInfo,
                          calculateMacros,
                          MealDropArea,
                          mapTimeToMealType
                      }) {
    //console.log("Rendering DroppableDay:", day.date, meals); // log

    const {totalProteins, totalFats, totalCarbs, totalKcal} = calculateMacros(meals);

    const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'AFTERNOON_SNACK', 'EVENING_SNACK'];
    const dateObject = new Date(day.date);
    const weekDay = dateObject.toLocaleDateString('en-US', {weekday: 'long'});
    const weekDayCapitalized = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
    const currentDate = new Date(day.date);
    currentDate.setHours(12, 0, 0, 0);


    const prettyMealTypes = {
        BREAKFAST: 'Breakfast',
        LUNCH: 'Lunch',
        DINNER: 'Dinner',
        AFTERNOON_SNACK: 'Afternoon Snack',
        EVENING_SNACK: 'Evening Snack',
    };

    function formatMealType(mealType) {
        return prettyMealTypes[mealType] || mealType;
    }

    const dietStart = new Date(dietPlanInfo.diet_start_date);
    dietStart.setHours(12, 0, 0, 0);

    const dietEnd = new Date(dietPlanInfo.diet_end_date);
    dietEnd.setHours(12, 0, 0, 0);

    const isWithinDietPlan = currentDate >= dietStart && currentDate <= dietEnd;

    if (!isWithinDietPlan) {
        return null; // Or some other placeholder indicating this is not a diet day
    }

    function isToday(date) {
        date = new Date(date);
        //console.log("EEEE",date);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }


    return (
        <div
            className={`bg-gray-100 p-4 rounded-lg shadow-md  h-full ${isToday(day.date) && 'border-blue-400 border-4'}`}
            style={{minHeight: '250px'}}>
            <div className="flex justify-between items-center border-b-2 pb-1 ">
                <h2 className="text-2xl font-semibold">{weekDayCapitalized}</h2>
                <span className="text-gray-500">{day.date}</span>
            </div>
            <div className="flex justify-between items-center border-b-2">
                <span className="py-1"><FaDrumstickBite className="inline"/> {totalProteins}g</span>
                <span className="py-1"><FaDroplet className="inline"/> {totalFats}g</span>
                <span className="py-1"><FaWheatAwn className="inline"/> {totalCarbs}g</span>
                <span className="border-l-2 pl-2 py-1">{totalKcal}Kcal</span>
            </div>
            {mealTypes.map(mealType2 => {
                // console.log("Key (mealType2):", mealType2); // Logowanie wartości klucza

                return (
                    <div className="flex flex-col mt-4  " key={`${mealType2}-${day.date}`}>
                        <span className="text-lg font-medium text-left">{formatMealType(mealType2)}</span>
                        <MealDropArea
                            key={mealType2}
                            day={day}
                            mealType={mealType2}
                            onMealDropped={onMealDropped}
                            meals={meals}
                            updateMealGrams={updateMealGrams}
                            updateMealCalories={updateMealCalories}
                            saveDietData={saveDietData}
                            handleChanges={handleChanges}
                            setMeals={setMeals}
                            handleDeleteMeal={handleDeleteMeal}
                            mapTimeToMealType={mapTimeToMealType}
                        />
                    </div>
                );
            })}
        </div>
    );

}

export default DroppableDay;