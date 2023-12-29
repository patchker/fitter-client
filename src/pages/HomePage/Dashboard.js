import React, {useEffect, useState} from 'react';
import Banner from "./Banner";
import Content from "./Content";
import {useLocation, Link} from "react-router-dom";

function Dashboard() {

    const [showTooltip, setShowTooltip] = useState(false);
    const location = useLocation();


    useEffect(() => {
        if (new URLSearchParams(location.search).get('logged') === 'true') {
            setShowTooltip(true); // Pokaż dymek
            const timer = setTimeout(() => {
                setShowTooltip(false);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [location]);


    return (
        <div>
            <Banner />
            <Content />

            {showTooltip && (
                <div className="fixed top-10 right-0 p-4">
                    <div className="bg-green-500 text-white p-4 rounded shadow-lg flex items-center">
                        <p>Pomyślnie zalogowano!</p>
                        <button onClick={() => setShowTooltip(false)} className="ml-4 text-xl">×</button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default Dashboard;
