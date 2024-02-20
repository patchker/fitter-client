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

    const handleBlur = () => {
        const oldValue = value !== undefined ? value : default_grams;

        if (tempValue !== oldValue) {

            handleChanges();
        }
        onValueChange(tempValue);
        updateCalories(tempValue);
        setEditingMealId(null);


    };

    return isEditing ? (
        <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onFocus={() => setEditingMealId(uuid)}
            onClick={(e) => {
                e.stopPropagation();
            }}
            autoFocus
            className="w-12 focus:outline-none focus:ring-0 focus:border-transparent border-transparent bg-transparent hide-number-input-spinners bg-emerald-500"
        />

    ) : (
        <span className="inline-block text-black" onClick={() => setEditingMealId(uuid)}>
        {tempValue}g

    </span>
    );

}

export default EditableField;