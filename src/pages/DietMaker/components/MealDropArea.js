import React, {useState} from "react";
import {useDrop} from "react-dnd";
import EditableField from "./EditableField";
import CloseIcon from "@mui/icons-material/Close";
import {FaDrumstickBite} from "react-icons/fa";
import {FaDroplet, FaWheatAwn} from "react-icons/fa6";

function MealDropArea({
                          day,
                          mealType,
                          onMealDropped,
                          meals,
                          updateMealGrams,
                          updateMealCalories,
                          saveDietData,
                          handleChanges,
                          setMeals,
                          handleDeleteMeal,
                          mapTimeToMealType
                      }) {


    const [isEditing, setIsEditing] = useState(false);
    const [editingMealId, setEditingMealId] = useState(false);


    const handleContainerClick = (mealId) => {
        if (mealId === editingMealId) {
            setEditingMealId(null);
            setIsEditing(false);
        } else {
            setEditingMealId(mealId);
            setIsEditing(true);
        }
    };


    const modifiedMeals = meals.map(meal => {
        if (!meal.time) {
            return {
                ...meal,
                meal: meal.name
            };
        }
        return meal;
    });

    const filteredMeals = modifiedMeals.filter(meal => {
        if (meal.time) {
            return mapTimeToMealType(meal.time) === mealType;
        } else {
            return meal.type === mealType;
        }
    });


    const [{canDrop, isOver}, drop] = useDrop(() => ({
        accept: 'MEAL',
        drop: (item, monitor) => {
            if (filteredMeals.length < 5) {
                onMealDropped(day, mealType, item.meal);
                handleChanges();
            }
        },
        canDrop: (item, monitor) => filteredMeals.length < 5,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    let backgroundColor = 'bg-gray-200';
    if (filteredMeals.length >= 5 && isOver) {
        backgroundColor = 'bg-red-500';
    } else if (isOver) {
        backgroundColor = 'bg-emerald-300';
    } else if (canDrop) {
        backgroundColor = 'bg-yellow-200';
    }

    const bgClasses = {
        default: "bg-gray-200",
        canDrop: "bg-yellow-200",
        isOver: "bg-emerald-300",
        full: "bg-red-500"
    };
    const currentBg = canDrop ? (isOver ? (filteredMeals.length >= 5 ? bgClasses.full : bgClasses.isOver) : bgClasses.canDrop) : bgClasses.default;
    return (
        <div
            ref={drop}
            key={mealType}
            className={`relative flex flex-col p-4 rounded-lg shadow-md mb-4 w-full max-w-xs ${currentBg} min-h-[120px] transition duration-150 ease-in-out space-y-2`}
        >
            {filteredMeals.length > 0 ? (
                filteredMeals.map((meal, index) => (
                    <div
                        key={meal.uuid}
                        className={`flex flex-col p-2 ${index === filteredMeals.length - 1 ? '' : 'border-b border-gray-300'} cursor-pointer`}
                        onClick={() => handleContainerClick(meal.uuid)}
                    >
                        <div className="flex justify-between items-center space-x-2">
          <span className="text-lg font-semibold truncate" style={{userSelect: 'none'}}>
            {meal.meal}
          </span>
                            <EditableField
                                uuid={meal.uuid}
                                id={meal.id}
                                isEditing={editingMealId === meal.uuid}
                                setEditingMealId={setEditingMealId}
                                value={meal.grams}
                                onValueChange={(newValue) => updateMealGrams(day.date, mealType, meal.uuid, newValue)}
                                updateCalories={(newValue) => updateMealCalories(day.date, mealType, meal.uuid, newValue, meal.calories_per_100g)}
                                default_grams={meal.default_grams}
                                saveDietData={saveDietData}
                                handleChanges={handleChanges}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Zatrzymuje propagację zdarzenia wyżej w hierarchii DOM
                                    handleDeleteMeal(day, meal.uuid);
                                    handleChanges();
                                }}
                                className="p-1 rounded-full text-stone-500 hover:text-gray-800"
                            >
                                <CloseIcon fontSize="small"/>
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm space-x-4">
          <span className="flex items-center py-1">
            <FaDrumstickBite className="mr-1"/>{meal.protein}g
          </span>
                            <span className="flex items-center py-1">
            <FaDroplet className="mr-1"/>{meal.fats}g
          </span>
                            <span className="flex items-center py-1">
            <FaWheatAwn className="mr-1"/>{meal.carbohydrates}g
          </span>
                            <span>
            {Math.round((meal.grams) / 100 * meal.calories_per_100g)} kcal
          </span>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center my-auto">Brak posiłku</p>
            )}
        </div>

    );
}

export default MealDropArea;