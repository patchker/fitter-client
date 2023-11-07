import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './DietCalendar.css';
import DayCard from './components/DayCard';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import ip from "../../config/Ip";
import CalendarNavigation from "./components/CalendarNavigation";

function DietSchedule() {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const [animationClass, setAnimationClass] = useState('');
    const [orderInfo, setOrderInfo] = useState(null); // Nowy stan dla przechowywania informacji o zamówieniu
    const [isLoading, setIsLoading] = useState(false); // Nowy stan
    const [dietData, setDietData] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
    const [numberOfDaysToShow, setNumberOfDaysToShow] = useState(0);


    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    function formatDietData(rawData) {
        const formattedData = {};
        const mealTimes = {
            breakfast: "08:00",
            lunch: "13:00",
            dinner: "15:00",
            afternoon_snack: "19:00",
            evening_snack: "21:00"
        };

        rawData.days.forEach(dayData => {
            const date = new Date(dayData.date);
            const dateString = formatDate(date);

            if (!formattedData[dateString]) {
                formattedData[dateString] = [];
            }

            Object.keys(mealTimes).forEach(mealType => {
                const meals = dayData.meals[mealType];
                if (meals && meals.length > 0) {
                    meals.forEach(meal => {
                        const mealData = {
                            id: meal.id,
                            time: mealTimes[mealType],
                            meal: `${meal.name}`,
                            quantity: `${meal.quantity}`,
                            uuid: `${meal.uuid}`,
                            short_description: `${meal.short_description}`,
                            calories: `${meal.calories}`,
                            calories_per_100g: `${meal.calories_per_100g}`,
                            default_grams: `${meal.default_grams}`,
                            carbohydrates: `${meal.carbohydrates}`,
                            fats: `${meal.fats}`,
                            protein: `${meal.protein}`,
                            preparation_time: `${meal.preparation_time}`,
                            image_url: `${meal.image_url}`
                        };
                        formattedData[dateString].push(mealData);
                    });
                }
            });
        });

        const orderInfo = rawData.order_info;
        setOrderInfo(orderInfo);
        return formattedData;
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    function getDayDate(index) {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + index);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        return `${day}/${month}`;
    }

    function getMonday(d) {
        d = new Date(d);
        let day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    function isPrevWeekDisabled() {
        const prevWeekStartDate = new Date(new Date(currentWeekStart).setDate(currentWeekStart.getDate() - 7));
        return !isAnyDayWithinOrderDate(prevWeekStartDate, 7);
    }

    function isNextWeekDisabled() {
        const nextWeekStartDate = new Date(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 7));
        return !isAnyDayWithinOrderDate(nextWeekStartDate, 7);
    }

    function isAnyDayWithinOrderDate(startDate, daysToAdd) {
        for (let i = 0; i < daysToAdd; i++) {
            const currentDate = new Date(new Date(startDate).setDate(startDate.getDate() + i));
            if (isWithinOrderDate(currentDate)) {
                return true;
            }
        }
        return false;
    }


    function isWithinOrderDate(date) {
        if (!orderInfo) return false;

        const orderStartDate = new Date(orderInfo.start_date);
        orderStartDate.setHours(0, 0, 0, 0);

        const orderEndDate = new Date(orderInfo.end_date);
        orderEndDate.setHours(23, 59, 59, 999);

        const comparingDate = new Date(date);
        comparingDate.setHours(0, 0, 0, 0);

        return comparingDate >= orderStartDate && comparingDate <= orderEndDate;
    }


    useEffect(() => {
        const startDate = formatDate(currentWeekStart);
        const endDate = formatDate(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6));
        const accessToken = localStorage.getItem('access_token');

        axios.get(ip + '/diet-plans/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {startDate, endDate}
        }).then(response => {
            const rawData = response.data;
            const formattedData = formatDietData(rawData);
            const completeData = days.map((day, index) => {
                const currentDate = new Date(currentWeekStart);
                currentDate.setDate(currentDate.getDate() + index);
                const dateString = formatDate(currentDate);
                return {[dateString]: formattedData[dateString] || []};
            });
            console.log("completeData",completeData)

            setDietData(Object.assign({}, ...completeData));
        })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    logout();
                    navigate("/login")
                }
            });
    }, [currentWeekStart]);


    const [displayedDaysCount, setDisplayedDaysCount] = useState(0);

    // Tymczasowa zmienna do zliczania wyświetlanych dni
    let tempDisplayedDays = 0;

    const daysComponents = days.map((day, index) => {
        const dayDate = new Date(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + index));
        if (isWithinOrderDate(dayDate)) {
            tempDisplayedDays++;
            return (
                <DayCard
                    key={index}
                    day={day}
                    date={getDayDate(index)}
                    meals={dietData[formatDate(dayDate)] || []}
                    isToday={isToday(dayDate)}
                />
            );
        }
        return null; // Zwróć null, jeśli dzień nie jest w zakresie, aby React wiedział, że nic nie ma renderować
    });

    useEffect(() => {
        // Uaktualnij stan tylko po obliczeniu liczby wyświetlanych dni
        setDisplayedDaysCount(tempDisplayedDays);
    }, [tempDisplayedDays]); // Zależność od tempDisplayedDays, aby zapewnić aktualizację stanu

    const getGridTemplateColumns = () => {
        console.log("displayedDaysCount",displayedDaysCount)
        // Tutaj możesz dostosować wartości 'sm:', 'md:', 'lg:', 'xl:' w zależności od potrzeb
        // Przykład może zakładać Tailwind CSS
        let classes = 'grid-cols-1';
        if (displayedDaysCount > 1) {
            classes += ` sm:grid-cols-${Math.min(displayedDaysCount, 2)}`;
        }
        if (displayedDaysCount > 2) {
            classes += ` md:grid-cols-${Math.min(displayedDaysCount, 3)}`;
        }
        if (displayedDaysCount > 3) {
            classes += ` lg:grid-cols-${Math.min(displayedDaysCount, 4)}`;
        }
        if (displayedDaysCount > 4) {
            console.log("AAAdisplayedDaysCount",displayedDaysCount)
            classes += ` xl:grid-cols-${displayedDaysCount}`;
        }
        if (displayedDaysCount === 5) {
            console.log("AAAdisplayedDaysCount",displayedDaysCount)
            classes += ` lg:grid-cols-5`;
        } if (displayedDaysCount === 6) {
            console.log("AAAdisplayedDaysCount",displayedDaysCount)
            classes += ` lg:grid-cols-6`;
        }if (displayedDaysCount === 7) {
            console.log("AAAdisplayedDaysCount",displayedDaysCount)
            classes += ` lg:grid-cols-7`;
        }
        return classes;
    };

    return (
        <div className="flex flex-col items-center p-4 mt-8">
            <div className="flex flex-col md:flex-row w-full justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-center mb-4 md:mb-0 md:mr-4">Twój plan diety na ten tydzień</h1>
                <a href="/Dieta/Dieta" className="bg-emerald-500 text-white px-4 py-2 rounded md:self-start">
                    Sprawdź dostępne plany
                </a>
            </div>

            <CalendarNavigation
                currentWeekStart={currentWeekStart}
                orderInfo={orderInfo}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setAnimationClass={setAnimationClass}
                setCurrentWeekStart={setCurrentWeekStart}
                isPrevWeekDisabled={isPrevWeekDisabled}
                isNextWeekDisabled={isNextWeekDisabled}
            />


            <div className={`grid ${getGridTemplateColumns()} gap-4 w-full mt-8 ${animationClass}`}>                {days.map((day, index) => {
                    const dayDate = new Date(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + index));
                    if (isWithinOrderDate(dayDate)) {
                        return (
                            <DayCard
                                key={index}
                                day={day}
                                date={getDayDate(index)}
                                meals={dietData[formatDate(dayDate)] || []}
                                isToday={isToday(dayDate)}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default DietSchedule;