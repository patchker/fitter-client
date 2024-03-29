import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import './DietCalendar.css';
import DayCard from './components/DayCard';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import ip from "../../config/Ip";
import CalendarNavigation from "./components/CalendarNavigation";
import { OrderPlacedContext } from '../../contexts/orderPlacedContext';

function DietSchedule() {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const [animationClass, setAnimationClass] = useState('');
    const [orderInfo, setOrderInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [preferences, setPreferences] = useState('');
    const [dietData, setDietData] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
    const [isLoading2, setIsLoading2] = useState(true);
    const { orderPlaced, setOrderPlaced, setOrder } = useContext(OrderPlacedContext);


    useEffect(() => {
        if (preferences === null) {
            setIsLoading2(false);
        } else if (preferences === false) {
            navigate('/dietconfig', { state: { orderInfo: orderInfo } });
        }

    }, [preferences]);


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

    const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

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

        axios.get(ip + '/api/diet-plans/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {startDate, endDate}
        }).then(response => {
            setIsLoading2(false);

            const rawData = response.data;
            const preferences_set2 = rawData.preferences_set;
            setPreferences(preferences_set2);
            const formattedData = formatDietData(rawData);
            const completeData = days.map((day, index) => {
                const currentDate = new Date(currentWeekStart);
                currentDate.setDate(currentDate.getDate() + index);
                const dateString = formatDate(currentDate);
                return {[dateString]: formattedData[dateString] || []};
            });

            setDietData(Object.assign({}, ...completeData));
        })
            .catch(error => {
                setIsLoading2(false);
                setOrderPlaced(false)
                if (error.response && error.response.status === 401) {
                    logout();
                    navigate("/login")
                }
            });
    }, [currentWeekStart, logout, navigate]);





    const [displayedDaysCount, setDisplayedDaysCount] = useState(0);

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
        return null;
    });

    useEffect(() => {
        setDisplayedDaysCount(tempDisplayedDays);
    }, [tempDisplayedDays]);

    const getGridTemplateColumns = () => {
        let classes = 'grid-cols-1 max-w-[400px] gap-4';

        if (displayedDaysCount > 1) {
            classes += ` sm:grid-cols-2 sm:max-w-[700px] sm:gap-20`;
        }
        if (displayedDaysCount > 2) {
            classes += ` md:grid-cols-3 md:max-w-full md:gap-4`;
        }
        if (displayedDaysCount > 3) {
            classes += ` lg:grid-cols-4`;
        }
        if (displayedDaysCount > 4) {
            classes += ` xl:grid-cols-5`;
        }
        if (displayedDaysCount > 5) {
            classes += ` 2xl:grid-cols-7`;
        }
        if (displayedDaysCount > 6) {
            classes += ` 3xl:grid-cols-7`;
        }

        return classes;
    };



    if (orderInfo && (orderInfo.status === "pending" || orderInfo.status === "Pending" || orderInfo.status === "new" || orderInfo.status === "New")) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 pt-0">
                <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm w-full">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Dieta w trakcie tworzenia</h2>
                    <p className="text-center text-gray-600 mb-6">Twoja indywidualna dieta jest obecnie przygotowywana. Oto szczegóły:</p>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Identyfikator zamówienia:</h3>
                        <p className="text-gray-500">{orderInfo.id}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Data rozpoczęcia:</h3>
                        <p className="text-gray-500">{formatDate(orderInfo.start_date)}</p>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700">Data zakończenia:</h3>
                        <p className="text-gray-500">{formatDate(orderInfo.end_date)}</p>
                    </div>

                </div>
            </div>
        );
    }

    if (orderInfo && (orderInfo.status === "Cancelled" || orderInfo.status === "cancelled") ){
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 pt-0">
                <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm w-full">
                    <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Zamówienie zostało anulowane.</h2>
                    <p className="text-center text-gray-600 mb-6"><p>Skontaktuj się z administracją.</p> Oto szczegóły:</p>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Identyfikator zamówienia:</h3>
                        <p className="text-gray-500">{orderInfo.id}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Data rozpoczęcia:</h3>
                        <p className="text-gray-500">{formatDate(orderInfo.start_date)}</p>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700">Data zakończenia:</h3>
                        <p className="text-gray-500">{formatDate(orderInfo.end_date)}</p>
                    </div>

                </div>
            </div>
        );
    }

    if (isLoading2) {
        return <div>Loading...</div>;
    }

    const handleNavigate = () => {
        navigate('/ingredients', { state: { currentWeekStart } });
    }

    return (
        <div className="flex flex-col items-center p-4 mt-8">
            <div className="flex flex-col md:flex-row w-full  justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-center mb-4 md:mb-0 md:mr-4">Twój plan diety na ten tydzień</h1>

                <button onClick={handleNavigate}
                        className="bg-emerald-500 text-white px-4 py-2 rounded md:self-start"
                >

                    Lista składników
                </button>
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


            <div className={`grid ${getGridTemplateColumns()} gap-4 w-full h-auto mt-8 ${animationClass}`}>                {days.map((day, index) => {
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