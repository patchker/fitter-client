import React, {useState} from "react";

function EditableField({
                           uuid,
                           id,
                           isEditing,
                           setEditingMealId,
                           value,
                           onValueChange,
                           updateCalories,
                           default_grams,
                           saveDietData,
                           handleChanges
                       }) {
    const [tempValue, setTempValue] = useState(value || default_grams);
    console.log("isEditing", isEditing)
    console.log("uuid", uuid)
    const handleBlur = () => {
        const oldValue = value !== undefined ? value : default_grams;

        if (tempValue !== oldValue) { // Sprawdzenie, czy wartość została zmieniona

            handleChanges(); // Wywołanie funkcji handleChanges, jeśli wartość została zmieniona
        }
        onValueChange(tempValue);
        updateCalories(tempValue); // Aktualizuje kalorie po zmianie wartości
        setEditingMealId(null); // resetowanie editingMealId po zakończeniu edycji


    };
    if (isEditing)
        console.log("EDITING: ", uuid)
    return isEditing ? (
        <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onFocus={() => setEditingMealId(uuid)}
            onClick={(e) => {
                e.stopPropagation();
                // Reszta obsługi zdarzenia
            }}
            autoFocus
            className="w-12 focus:outline-none focus:ring-0 focus:border-transparent border-transparent bg-transparent hide-number-input-spinners"
        />

    ) : (
        <span className="inline-block" onClick={() => setEditingMealId(uuid)}>
        {tempValue}g
    </span>
    );

}
export default EditableField;