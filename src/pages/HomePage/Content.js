import React from 'react';
import { Link } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';

function Content() {
    return (
        <div className="flex flex-col justify-center items-center h-full border-2 border-gray-200 p-6 space-y-6 pt-10 bg-white rounded-lg shadow-md">
            <div className=" glerspace-y-6 md:space-y-0 md:grid md:grid-cols-3 gap-6 w-full">
                <div className="flex flex-col space-y-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                    {/* Introductory Text */}
                    <h2 className="text-2xl font-semibold text-center text-gray-800">Twoja Droga do Zdrowszego Życia</h2>

                    {/* Feature Highlight */}
                    <p className="text-lg text-gray-700 text-center">Poznaj nasze narzędzia</p>
                    <p className="text-base text-gray-600">Śledź swoje postępy i osiągaj cele zdrowotne z naszymi spersonalizowanymi planami.</p>

                    {/* Action Button */}
                    <Link to="/dieta" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center transition-colors duration-200">
                        Przejdź do Diety
                    </Link>

                    {/* List of Benefits */}
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Zdrowe przepisy</li>
                        <li>Personalizowane plany żywieniowe</li>
                        <li>Wsparcie społeczności</li>
                        <li>Monitorowanie postępów</li>
                        <li>Porady ekspertów</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Content;
