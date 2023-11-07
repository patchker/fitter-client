import React from 'react';

function CalendarNavigation({isPrevWeekDisabled, isNextWeekDisabled, isLoading, setIsLoading, setAnimationClass, setCurrentWeekStart}) {
    return (
        <div className={`flex items-center space-x-4 mb-4`}>
            <button
                className={`${(isPrevWeekDisabled() || isLoading) && 'text-gray-500'}`}
                disabled={isPrevWeekDisabled() || isLoading} onClick={() => {
                setIsLoading(true);
                setAnimationClass('animate-out');
                setTimeout(() => {
                    setCurrentWeekStart(prevDate => new Date(new Date(prevDate).setDate(prevDate.getDate() - 7)));
                    setAnimationClass('animate-in');
                    setIsLoading(false);
                }, 300);
            }}>
                &lt; Poprzedni tydzień
            </button>
            <button
                className={`${(isNextWeekDisabled() || isLoading) && 'text-gray-500'}`}
                disabled={isNextWeekDisabled() || isLoading} onClick={() => {
                setIsLoading(true);
                setAnimationClass('animate-out');
                setTimeout(() => {
                    setCurrentWeekStart(prevDate => new Date(new Date(prevDate).setDate(prevDate.getDate() + 7)));
                    setAnimationClass('animate-in');
                    setIsLoading(false);
                }, 300);
            }}>
                Następny tydzień &gt;
            </button>
        </div>

    );
}

export default CalendarNavigation;
