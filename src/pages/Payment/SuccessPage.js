import React from 'react';
import {Link} from 'react-router-dom';

function SuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-3xl font-semibold text-green-500 mb-4">Płatność zakończona pomyślnie!</h2>
            <p className="text-lg mb-6 text-center">Dziękujemy za zakup. Twoja płatność została pomyślnie
                przetworzona.</p>
            <Link
                to="/dietcalendar?hello"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                Wróć na stronę główną
            </Link>
        </div>
    );
}

export default SuccessPage;
