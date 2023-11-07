import {useDrag} from "react-dnd";
import React, {useEffect} from "react";

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


    return (
        <div
            ref={drag}
            className={`rounded border-2 ${isDragging ? 'opacity-50 bg-gray-300' : 'opacity-100 bg-gray-100'} mb-2 cursor-pointer`}
        >
            <div className="flex justify-between ">
                <h4 className="p-2">{meal.name}</h4>
                <h4 className=" border-l-2 border-gray-200 h-full p-2">{meal.calories_per_100g} kcal/100g</h4>
            </div>
        </div>
    );
}

export default DraggableMeal;