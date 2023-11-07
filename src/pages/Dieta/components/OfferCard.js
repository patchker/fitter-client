import React from 'react';

function OfferCard ({ offer, onSelect })
{
    return (
        <div
            className="bg-white overflow-hidden shadow rounded-lg transition transform hover:scale-105"
            onClick={() => onSelect(offer)}
        >
            <div className="px-4 py-5 sm:p-6 space-y-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-900">{offer.title}</h2>
                <p className="text-gray-600">{offer.description}</p>
                <button
                    className="mt-4 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                    Pokaż więcej
                </button>
            </div>
        </div>
    );
}
export default OfferCard;