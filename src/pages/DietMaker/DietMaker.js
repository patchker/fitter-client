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
    const [userNick, setUserNick] = useState(null);
    const {nick} = useParams(); // Pobieranie 'nick' z URL
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

    function handleChanges() {
        setChangesMade(true);
    }

    const updateSearch = debounce((value) => {
        setDebouncedSearchTerm(value);
    }, 300);


    useEffect(() => {
        updateSearch(searchTerm);
    }, [searchTerm]);

    const saveDietData = (allDietData) => {
        const accessToken = localStorage.getItem('access_token');
        console.log("allDietData", allDietData)
        axios.post(ip + "/save_diet_data/", {
            userNick: nick,
            diet_data: allDietData
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        })
            .then(response => {
                console.log("Dane zostały zaktualizowane:", response.data);
                console.log(allDietData)

            })
            .catch(error => {
                console.error("Wystąpił błąd podczas aktualizacji danych:", error);
                console.log(allDietData)
                console.log(nick)
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
            axios.get(ip + `/search_meals/`, {
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
        console.log("OD", startDate)
        console.log("DO", endDate)
        axios.get(ip + '/dietix/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {startDate, endDate, userNick: nick}
        }).then(response => {

            const rawData = response.data;
            const formattedData = formatDietData(rawData.days);
            setDietPlanInfo(rawData.diet_plan)
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

    return (
        <div className="flex flex-col p-4 ">
            <div className="flex flex-col md:flex-row w-full items-center mb-2">
                <h1 className="text-2xl font-bold text-center mb-4 md:mb-0 md:text-left whitespace-nowrap">Plan diety
                    użytkownika {nick}</h1>

                <div className="w-full flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-auto md:mx-auto">
                        <button
                            onClick={handleSaveAllDays}
                            className={`text-white px-16 py-3 rounded mr-36 mx-auto block
              ${changesMade ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}
                            disabled={!changesMade}
                        >
                            {changesMade ? 'Zapisz dane' : 'Brak zmian'}
                        </button>

                    </div>

                    <a href="/src/pages/Dieta/Dieta"
                       className="hidden md:block bg-emerald-500 text-white px-4 py-2 rounded text-center">
                        Sprawdź dostępne plany
                    </a>
                </div>
            </div>


            <div className="flex flex-col md:flex-row md:justify-start mb-4 text-gray-400">
                <span className="mr-2">DIET_ID: {dietPlanInfo.diet_id}</span>
                <span className="mr-2">OD: {formatDate(dietPlanInfo.diet_start_date)}</span>
                <span>DO: {formatDate(dietPlanInfo.diet_end_date)}</span>
            </div>


            <div className="flex items-center justify-center space-x-4 mr-[334px] xl:mr-[360px]">


                <button
                    className={`${(!isPreviousPeriodAvailable() || isLoading) && 'text-gray-500'}`}
                    disabled={!isPreviousPeriodAvailable()}
                    onClick={() => changeDateWithAnimation(-3)}
                >
                    &lt; Poprzednie 3 dni
                </button>
                <button
                    className={`${(!isNextPeriodAvailable() || isLoading) && 'text-gray-500'}`}
                    disabled={!isNextPeriodAvailable()}
                    onClick={() => changeDateWithAnimation(3)}
                >
                    Następne 3 dni &gt;
                </button>
            </div>


            <DndProvider backend={HTML5Backend}>
                <div className="flex flex-col md:flex-row justify-center items-start pb-4">
                    <div
                        className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-2 ${animationClass}`}>
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

                    {/* Sekcja wyszukiwania */}
                    <div className="search-section ml-10 md:w-72 lg:w-80 mt-2">
                        <input
                            type="text"
                            placeholder="Szukaj posiłków..."
                            className="p-2 w-full bg-gray-100 rounded h-12"
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