import {useDrag} from "react-dnd";
import React, {useEffect} from "react";
import "./DraggableMeal.css"
import {Tooltip} from 'react-tooltip';
import {FaFish} from 'react-icons/fa'
import SetMealIcon from '@mui/icons-material/SetMeal';
function DraggableMeal({meal, mealType, onDragStart, onDragEnd, onDoubleClick}) {
    const [{isDragging}, drag] = useDrag(() => ({
        type: 'MEAL',
        item: {meal, mealType},
        end: () => {
            onDragEnd();
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    useEffect(() => {
        if (isDragging) {
            onDragStart(meal, mealType);
        }
    }, [isDragging, meal, mealType, onDragStart]);

    const getAllergenClass = (meal) => {
        if (meal.lactose_free && meal.nut_free && meal.soy_free && meal.gluten_free && meal.fish_free) {
            return 'no-allergens';
        } else {
            let classes = '';
            if (meal.lactose_free) classes += ' lactose-free';
            if (meal.nut_free) classes += ' nut-free';
            if (meal.soy_free) classes += ' soy-free';
            if (meal.gluten_free) classes += ' gluten-free';
            if (meal.fish_free) classes += ' fish-free';
            return classes.trim();
        }
    };

    const allergenClass = getAllergenClass(meal);
    const allergenIndicators = [];
    const tooltipVisibility = isDragging ? 'hidden' : 'visible';
    const tooltipStyle = isDragging ? {display: 'none'} : {};

    // Wewnątrz komponentu DraggableMeal
    if (meal.lactose_free && !isDragging) {
        allergenIndicators.push(
            <span>
            <span id="L" className="tooltip lactose-free-indicator">L</span>

        <Tooltip anchorSelect="#L">
<span>Laktoza</span>
            </Tooltip>
                </span>
        );

    }


        if (meal.nut_free && !isDragging) {
            allergenIndicators.push(
                <span>
                    <span id="O" className="tooltip nut-free-indicator">O</span>
                    <Tooltip anchorSelect="#O">
                        <span>Orzechy</span>
                    </Tooltip>
                 </span>
            );

        }

    if (meal.gluten_free && !isDragging) {
        allergenIndicators.push(
            <span>
                    <span id="G" className="tooltip gluten-free-indicator">G</span>
                    <Tooltip anchorSelect="#G">
                        <span>Gluten</span>
                    </Tooltip>
                 </span>
        );

    }

    if (meal.fish_free && !isDragging) {
        allergenIndicators.push(
            <span>
                    <span id="R" className="tooltip fish-free-indicator">R</span>
                    <Tooltip anchorSelect="#R">
                        <span>Ryby</span>
                    </Tooltip>
                 </span>
        );

    }

    if (meal.soy_free && !isDragging) {
        allergenIndicators.push(
            <span>
                    <span id="S" className="tooltip soy-free-indicator">S</span>
                    <Tooltip anchorSelect="#S">
                        <span>Soja</span>
                    </Tooltip>
                 </span>
        );

    }







    console.log("meal.lactose_free", meal.lactose_free)
    console.log("meal.nut_free", meal.nut_free)
    console.log("isDragging", isDragging)
    console.log("allergenIndicators", allergenIndicators)

    return (
        <div ref={drag}
             className={`rounded border-2 ${isDragging ? 'opacity-50 bg-gray-300' : 'opacity-100 bg-gray-100'} mb-2 cursor-pointer`}>
            <div className="flex justify-between items-center w-full min-h-[50px]">
                <div className="flex-1 flex justify-center items-center">
                    <h4 className="text-center">{meal.name}</h4>
                </div>
                <div className="flex-1 flex justify-center items-center border-l-2 border-r-2 border-gray-200">
                    <h4 className="text-center">{meal.calories_per_100g} kcal/100g</h4>
                </div>
                <div className="flex-1 flex justify-center items-center">
                    {allergenIndicators}
                </div>
            </div>
        </div>
    );
}

export default DraggableMeal;
