import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {useNavigate, useParams} from 'react-router-dom';
import debounce from 'lodash/debounce';
import {useAuth} from "../../contexts/AuthContext";
import ip from "../../config/Ip";
import {v4 as uuidv4} from 'uuid';
import "./DietMaker.css"
import DraggableMeal from "./components/DraggableMeal"
import DroppableDay from "./components/DroppableDay"
import MealDropArea from "./components/MealDropArea"


const DietInfo = ({foodPreferences,dietInfo, showSummary, onTextLength}) => {
    const infoText = () => {
        let text = "";
        if (dietInfo.diet_type==="lowIG") text += "Dieta z niskim IG\n";
        if (dietInfo.diet_type==="vegetarian") text += "Dieta wegetariańska\n";
        if (dietInfo.diet_type==="vegan") text += "Dieta wegańska\n";
        if (dietInfo.diet_type==="standard") text += "Dieta standardowa\n";
        if (dietInfo.calories) text += dietInfo.calories+" kcal \n";
        if (foodPreferences.lactoseFree) text += "Bez laktozy\n";
        if (foodPreferences.glutenFree) text += "Bez glutenu\n";
        if (foodPreferences.nutFree) text += "Borzechów\n";
        if (foodPreferences.fishFree) text += "Bez ryb\n";
        if (foodPreferences.soyFree) text += "Bez soi\n";

        return text;
    };

    const summaryLength = 50;
    const fullText = infoText();

    const isLongText = fullText.length > summaryLength;
    let displayText;
    useEffect(() => {
        if (onTextLength) {
            onTextLength(fullText.length);
        }
    }, [fullText, onTextLength]);

    if (showSummary) {
        displayText = isLongText ? fullText.substring(0, summaryLength) + '...' : fullText;
    } else {
        displayText = fullText;
    }

    return (
        <div style={{whiteSpace: 'pre-wrap'}}>
            {displayText || "Brak"}
        </div>
    );
};

const DietInfo2 = ({foodIngredients_1, showSummary, onTextLength}) => {
    const fullText = foodIngredients_1.join(", ");
    const summaryLength = 150;
    const isLongText = fullText.length > summaryLength;

    useEffect(() => {
        if (onTextLength) {
            onTextLength(fullText.length);
        }
    }, [fullText, onTextLength]);

    const displayText = showSummary
        ? (isLongText ? fullText.substring(0, summaryLength) + '...' : fullText)
        : fullText;

    const textStyle = displayText ? {} : {color: 'rgb(55 65 81)'};

    return (
        <div style={{whiteSpace: 'pre-wrap'}}>
            <span style={textStyle}>{displayText || "Brak"}</span>
        </div>
    );
};


function getDisplayedDays(currentDate) {
    const yesterday = new Date(currentDate);
    const today = new Date(currentDate);
    const tomorrow = new Date(currentDate);

    yesterday.setDate(currentDate.getDate() - 1);
    tomorrow.setDate(currentDate.getDate() + 1);

    [yesterday, today, tomorrow].forEach(date => {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    });

    return [yesterday, today, tomorrow];
}

function mapTimeToMealType(time) {
    if (time == null || typeof time !== 'string') {
        return;
    }
    const hour = parseInt(time.split(':')[0], 10);
    if (hour === 8) return 'BREAKFAST';
    if (hour === 13) return 'LUNCH';
    if (hour === 15) return 'DINNER';
    if (hour === 19) return 'AFTERNOON_SNACK';
    if (hour === 21) return 'EVENING_SNACK';

    return null;
}

function DietMaker() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDragging, setIsDragging] = useState(false);
    const displayedDays = getDisplayedDays(new Date(currentDate));
    const [meals, setMeals] = useState([]);
    const {nick} = useParams();
    const [dietPlanInfo, setDietPlanInfo] = useState('');
    const [changesMade, setChangesMade] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();
    const {logout} = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [animationClass, setAnimationClass] = useState('');
    const [dietData, setDietData] = useState([]);
    const [showFullText, setShowFullText] = useState(false);
    const [foodIngredients_1, setFoodIngredients_1] = useState([]);
    const [foodIngredients_2, setFoodIngredients_2] = useState([]);
    const [isLongText, setIsLongText] = useState(false);

    const [foodPreferences, setFoodPreferences] = useState({
        glutenFree: false,
        lactoseFree: false,
        nutFree: false,
        fishFree: false,
        soyFree: false
    });


    const handleTextLength = (length) => {
        setIsLongText(prevState => prevState || length > 36);
    };

    const dietText = (
        <DietInfo
            foodPreferences={foodPreferences}
            dietInfo={dietPlanInfo}
            showSummary={!showFullText}
            onTextLength={handleTextLength}
        />
    );

    const dietText2 = (
        <DietInfo2
            foodIngredients_1={foodIngredients_1}
            showSummary={!showFullText}
            onTextLength={handleTextLength}
        />
    );

    const dietText3 = (
        <DietInfo2
            foodIngredients_1={foodIngredients_2}
            showSummary={!showFullText}
            onTextLength={handleTextLength}
        />
    );


    function handleChanges() {
        setChangesMade(true);
    }

    const handleSelectChanges = (event) => {

        handleChanges()
        setDietPlanInfo({...dietPlanInfo, status: event.target.value});
    };


    const updateSearch = debounce((value) => {
        setDebouncedSearchTerm(value);
    }, 300);


    useEffect(() => {
        updateSearch(searchTerm);
    }, [searchTerm]);

    const saveDietData = (allDietData) => {
        const accessToken = localStorage.getItem('access_token');
        axios.post(ip + "/api/save_diet_data/", {
            orderID: nick,
            diet_data: allDietData,
            status: dietPlanInfo.status
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        })
            .then(response => {
                console.log("Dane zostały zaktualizowane:", response.data);


            })
            .catch(error => {
                console.error("Wystąpił błąd podczas aktualizacji danych:", error);

                if (error.response && error.response.status === 401) {
                    logout();
                    navigate("/login")
                }
            });
    };

    const delayedQuery = debounce((value) => {
        setIsLoading(true); // Rozpoczęcie ładowania
        setSearchTerm(value);
        setTimeout(() => setIsLoading(false), 300);
    }, 600);


    useEffect(() => {
        if (searchTerm) {
            axios.get(ip + `/api/search_meals/`, {
                params: {
                    query: searchTerm
                }
            })
                .then(response => {
                    setMeals(response.data);
                })
                .catch(error => {
                    console.error(error);
                    if (error.response && error.response.status === 401) {
                        logout();
                        navigate("/login")
                    }
                });
        }
    }, [searchTerm]);

    const handleMealDropped = (day, mealType, droppedMeal) => {
        setDietData((prevDietData) => {
            const newDietData = {...prevDietData};

            if (!newDietData[day.date]) {
                newDietData[day.date] = [];
            }

            const mealsForType = newDietData[day.date].filter(meal => {
                if (meal.time) {
                    return mapTimeToMealType(meal.time) === mealType;
                }
                return meal.type === mealType;
            });

            if (mealsForType.length >= 5) {
                alert("Nie można dodać więcej niż 5 posiłków dla jednego typu.");
                return prevDietData;
            }

            const newMeal = {
                ...droppedMeal,
                uuid: uuidv4()
            };

            if (newMeal.time) {
                newMeal.type = mapTimeToMealType(newMeal.time);
            } else {
                newMeal.type = mealType;
            }
            newDietData[day.date].push(newMeal);

            return newDietData;
        });
    };

    const handleDeleteMeal = (day, mealId) => {
        setDietData((prevDietData) => {
            const newDietData = {...prevDietData};

            if (newDietData[day.date]) {
                newDietData[day.date] = newDietData[day.date].filter(meal => meal.uuid !== mealId);
            }
            return newDietData;
        });
    };


    function formatDate(date, daysOffset = 0) {
        const d = new Date(date);
        d.setDate(d.getDate() + daysOffset);

        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);

        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }


    function formatDietData(rawData) {
        const formattedData = {};

        rawData.forEach(dayData => {
            const date = new Date(dayData.date);
            const dateString = formatDate(date);

            if (!formattedData[dateString]) {
                formattedData[dateString] = [];
            }

            dayData.meals.forEach(mealData => {
                const mealType = mealData.meal_type;
                if (mealType) {
                    formattedData[dateString].push({
                        id: mealData.id,
                        time: getMealTime(mealType),
                        meal: `${mealData.name}`,
                        short_description: `${mealData.short_description}`,
                        calories: `${mealData.calories}`,
                        calories_per_100g: `${mealData.calories_per_100g}`,
                        default_grams: `${mealData.default_grams}`,
                        grams: `${mealData.quantity}`,
                        carbohydrates: `${mealData.carbohydrates}`,
                        fats: `${mealData.fats}`,
                        protein: `${mealData.protein}`,
                        preparation_time: `${mealData.preparation_time}`,
                        image_url: `${mealData.image_url}`,
                        uuid: `${mealData.uuid}`
                    });
                }
            });

        });

        return formattedData;
    }

    function getMealTime(mealType) {
        const mealTimes = {
            breakfast: "08:00",
            lunch: "13:00",
            dinner: "15:00",
            afternoon_snack: "19:00",
            evening_snack: "21:00"
        };
        return mealTimes[mealType] || "00:00";
    }


    function updateMealGrams(dayDate, mealType, mealId, newGrams) {
        setDietData(prevDietData => {
            const newDietData = {...prevDietData};

            const dayMeals = newDietData[dayDate];
            if (dayMeals) {
                const mealToUpdate = dayMeals.find(meal => meal.uuid === mealId && meal.type === mealType);
                if (mealToUpdate) {
                    mealToUpdate.grams = newGrams;
                }
            }

            return newDietData;
        });
    }


    function updateMealCalories(dayDate, mealType, mealId, newGrams, baseCaloriesPer100g) {

        setDietData(prevDietData => {
            const newDietData = {...prevDietData};
            const dayMeals = newDietData[dayDate];

            if (dayMeals) {
                let mealToUpdate;
                if ('time' in dayMeals[0]) {
                    mealToUpdate = dayMeals.find(meal => meal.uuid === mealId && mapTimeToMealType(meal.time) === mealType);
                } else {
                    mealToUpdate = dayMeals.find(meal => meal.uuid === mealId && meal.type === mealType);
                }
                if (mealToUpdate) {
                    mealToUpdate.grams = newGrams;
                    mealToUpdate.calories = (baseCaloriesPer100g * newGrams) / 100;
                }
            }
            return newDietData;
        });
    }


    useEffect(() => {
        if (!nick) return;
        const startDate = formatDate(currentDate, -1);
        const endDate = formatDate(currentDate, 1);
        const accessToken = localStorage.getItem('access_token');

        axios.get(ip + '/api/dieteditor/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {startDate, endDate, orderID: nick}
        }).then(response => {

            const rawData = response.data;
            const formattedData = formatDietData(rawData.days);
            setDietPlanInfo(rawData.diet_plan)


            setFoodPreferences({
                glutenFree: rawData.diet_plan.gluten_free,
                lactoseFree: rawData.diet_plan.lactose_free,
                nutFree: rawData.diet_plan.nut_free,
                fishFree: rawData.diet_plan.fish_free,
                soyFree: rawData.diet_plan.soy_free
            });
            setFoodIngredients_1(rawData.diet_plan.food_preferences_1)
            setFoodIngredients_2(rawData.diet_plan.food_preferences_2)

            const completeData = [...Array(3)].map((_, index) => {
                const dateForDay = new Date(currentDate.getTime());
                dateForDay.setDate(dateForDay.getDate() - (1 - index));
                const dateString = formatDate(dateForDay);
                return {[dateString]: formattedData[dateString] || []};
            });


            setDietData(Object.assign({}, ...completeData));

        })
            .catch(error => {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    logout();
                    navigate("/login")
                }
            });
    }, [nick, currentDate]);

    function convertMealType(type) {
        const mapping = {
            'BREAKFAST': 'breakfast',
            'LUNCH': 'lunch',
            'DINNER': 'dinner',
            'AFTERNOON_SNACK': 'afternoon_snack',
            'EVENING_SNACK': 'evening_snack',
        };
        return mapping[type.toUpperCase()] || null;
    }

    function handleSaveAllDays() {
        const allDietData = [];
        Object.keys(dietData).forEach(dayDate => {
            const dailyMeals = dietData[dayDate].map(mealData => {
                if (mealData.time) {
                    mealData.type = mapTimeToMealType(mealData.time);
                }

                return {
                    ...mealData,
                    meal_type: convertMealType(mealData.type),
                };
            });

            const filteredMeals = dailyMeals.filter(mealData => mealData.type !== undefined);

            allDietData.push({
                date: dayDate,
                meals: filteredMeals
            });
        });
        saveDietData(allDietData);
        setChangesMade(false);


        setShowTooltip(true);
        const timer = setTimeout(() => {
            setShowTooltip(false);
        }, 3000);

        return () => clearTimeout(timer);

    }

    function isAllDaysOutOfOrderDate(startDate, daysToAdd) {
        for (let i = 0; i < daysToAdd; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            if (isWithinOrderDate(currentDate)) {
                return false;
            }
        }
        return true;
    }

    function isPreviousPeriodAvailable() {
        const prevPeriodStartDate = new Date(currentDate);
        prevPeriodStartDate.setDate(prevPeriodStartDate.getDate() - 4);

        return !isAllDaysOutOfOrderDate(prevPeriodStartDate, 3);
    }

    function isNextPeriodAvailable() {
        const nextPeriodStartDate = new Date(currentDate);
        nextPeriodStartDate.setDate(nextPeriodStartDate.getDate() + 2);

        return !isAllDaysOutOfOrderDate(nextPeriodStartDate, 3);
    }


    function isWithinOrderDate(date) {
        if (!dietPlanInfo) return false;

        const orderStartDate = new Date(dietPlanInfo.diet_start_date);
        orderStartDate.setHours(0, 0, 0, 0);

        const orderEndDate = new Date(dietPlanInfo.diet_end_date);
        orderEndDate.setHours(0, 0, 0, 0);

        const comparingDate = new Date(date);
        comparingDate.setHours(0, 0, 0, 0);

        return comparingDate >= orderStartDate && comparingDate <= orderEndDate;
    }

    const changeDateWithAnimation = (daysToAdd) => {
        if (!changesMade || window.confirm('Masz niezapisane zmiany. Czy na pewno chcesz przewinąć i stracić te zmiany?')) {
            setAnimationClass('animate-out');
            setTimeout(() => {
                let newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + daysToAdd);
                setCurrentDate(newDate);
                setChangesMade(false);

                setAnimationClass('animate-in');
            }, 300);
        }
    };


    function calculateMacros(meals) {
        let totalProteins = 0;
        let totalFats = 0;
        let totalCarbs = 0;
        let totalKcal = 0;

        meals.forEach(meal => {
            totalProteins += parseInt(meal.protein * (meal.grams / 100)) || 0;
            totalFats += parseInt(meal.fats * (meal.grams / 100)) || 0;
            totalCarbs += parseInt(meal.carbohydrates * (meal.grams / 100)) || 0;
            totalKcal += parseInt((meal.grams / 100) * (meal.calories_per_100g)) || 0;
        });

        return {
            totalProteins,
            totalFats,
            totalCarbs,
            totalKcal
        };
    }

    const isDayInRange = (day) => {
        const dayDate = new Date(day);
        const startDate = new Date(dietPlanInfo.diet_start_date);
        const endDate = new Date(dietPlanInfo.diet_end_date);

        dayDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        return dayDate >= startDate && dayDate <= endDate;
    };

    const daysInRange = displayedDays.filter(isDayInRange).length;

    let gridClass = "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 ";
    if (daysInRange === 3) {
        gridClass += "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 ";
    } else if (daysInRange === 2) {
        gridClass += "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 ";
    } else if (daysInRange === 1) {
        gridClass += "lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 m-auto max-w-[600px]";
    }

    return (
        <div className="flex flex-col p-4 ">
            <div className="flex flex-col md:flex-row w-full mb-2">
                <h1 className=" sm:text-lg lg:text-2xl font-bold text-center mb-4 md:mb-0 md:text-left whitespace-nowrap">Plan
                    diety
                    użytkownika {dietPlanInfo && dietPlanInfo.username}</h1>

                <div className="w-full flex flex-col md:flex-row justify-between">
                    <div className="flex flex-col md:flex-row  mb-4 md:mb-0 md:ml-10">
                        <button
                            onClick={handleSaveAllDays}
                            className={`text-white px-4  h-10 rounded md:w-auto w-full mb-5 sm:mb-5 md:mb-0 md:mr-10 whitespace-nowrap
                        ${changesMade ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}
                            disabled={!changesMade}
                        >
                            {changesMade ? 'Zapisz dane' : 'Brak zmian'}
                        </button>

                        <div className="w-full md:w-36">
                            <select value={dietPlanInfo.status} onChange={handleSelectChanges}
                                    className="form-select block w-full px-3 py-2 text-base font-normal text-gray-700 bg-gray-300 bg-clip-padding bg-no-repeat border border-solid border-gray-400 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
                                <option value="new">Nowe</option>
                                <option value="pending">Oczekujące</option>
                                <option value="completed">Zakończone</option>
                                <option value="cancelled">Anulowane</option>
                            </select>
                        </div>


                    </div>
                </div>
            </div>

            <div className="m-auto text-center w-full ">
                <div className="w-full bg-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-3 p-2 px-4">

                        {/* Sekcja preferencji diety */}
                        <div className="border-r-2 border-gray-300">
                            <h3 className="font-bold text-lg mb-2">Preferencje diety:</h3>
                            <div className="text-gray-700 text-sm md:text-base">
                                {dietText}

                            </div>
                        </div>

                        {/* Sekcja preferowanych składników */}
                        <div className="border-r-2 border-gray-300 px-2">
                            <h3 className="font-bold text-lg mb-2">Preferowane dania:</h3>
                            <span className="text-green-500">{dietText2}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2 px-2">Unikaj dań:</h3>
                            <span className="text-red-500">{dietText3}</span>
                        </div>
                    </div>
                    {isLongText && (
                        <button
                            onClick={() => setShowFullText(!showFullText)}
                            className="bg-emerald-500 text-white py-1 px-4 rounded hover:bg-emerald-600 transition duration-300 mb-4"
                        >
                            {showFullText ? 'Zwiń' : 'Rozwiń'}
                        </button>
                    )}
                </div>
            </div>


            <div
                className="flex items-center mt-4 justify-center space-x-4 sm:mr-0  md:mr-[33px] lg:mr-[400px] xl:mr-[390px] 2xl:mr-[500px] ">


                <button
                    className={` whitespace-nowrap ${(!isPreviousPeriodAvailable() || isLoading) && 'text-gray-500'}`}
                    disabled={!isPreviousPeriodAvailable()}
                    onClick={() => changeDateWithAnimation(-3)}
                >
                    &lt; Poprzednie 3 dni
                </button>
                <button
                    className={`whitespace-nowrap ${(!isNextPeriodAvailable() || isLoading) && 'text-gray-500'}`}
                    disabled={!isNextPeriodAvailable()}
                    onClick={() => changeDateWithAnimation(3)}
                >
                    Następne 3 dni &gt;
                </button>
            </div>


            <DndProvider backend={HTML5Backend}>
                <div
                    className="flex flex-col md:flex-row justify-center md:justify-start sm:items-center md:items-start pb-4 w-full ">
                    {/* Sekcja dni */}
                    <div className="flex-grow md:w-3/4 ">
                        <div className={`${gridClass} gap-5 mt-2 ${animationClass}`}>
                            {displayedDays.map((dayDate, index) => {
                                return (
                                    <DroppableDay
                                        key={index}
                                        day={{date: formatDate(dayDate)}}
                                        meals={dietData[formatDate(dayDate)] || []}
                                        onMealDropped={handleMealDropped}
                                        isDragging={isDragging}
                                        updateMealGrams={updateMealGrams}
                                        updateMealCalories={updateMealCalories}
                                        saveDietData={saveDietData}
                                        handleChanges={handleChanges}
                                        setMeals={setMeals}
                                        handleDeleteMeal={handleDeleteMeal}
                                        dietPlanInfo={dietPlanInfo}
                                        calculateMacros={calculateMacros}
                                        MealDropArea={MealDropArea}
                                        mapTimeToMealType={mapTimeToMealType}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* Sekcja wyszukiwania */}
                    <div className="ml-10 md:w-1/3 lg:w-1/4 mt-2">
                        <input
                            type="text"
                            placeholder="Szukaj posiłków..."
                            className="p-2 w-full bg-gray-100 rounded h-12 mb-2"
                            onChange={(e) => delayedQuery(e.target.value)}
                        />
                        {isLoading ? (
                            <div className="flex justify-center items-center mt-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            </div>
                        ) : (
                            meals.filter((meal) => meal.name.toLowerCase().includes(searchTerm.toLowerCase())).map((meal) => (
                                <DraggableMeal key={meal.id} meal={meal} mealType="BREAKFAST"
                                               onDragStart={() => setIsDragging(true)}
                                               onDragEnd={() => setIsDragging(false)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </DndProvider>

            {showTooltip && (
                <div className="fixed top-10 right-0 p-4">
                    <div className="bg-green-500 text-white p-4 rounded shadow-lg flex items-center">
                        <p>Pomyślnie zapisano!</p>
                        <button onClick={() => setShowTooltip(false)} className="ml-4 text-xl">×</button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default DietMaker;