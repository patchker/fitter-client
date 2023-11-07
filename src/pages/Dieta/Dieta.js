import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import OfferCard from "./components/OfferCard"
import FAQItem from "./components/FAQItem"


function Dieta() {
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [openQuestion, setOpenQuestion] = useState(null);


    const offers = [
        {
            id: 1,
            title: "Darmowa Dieta od AI",
            description: "Plan diety stworzony automatycznie przez sztuczną inteligencję.",
            details: "Ta dieta jest całkowicie darmowa. Otrzymasz spersonalizowany plan żywieniowy wygenerowany przez naszą sztuczną inteligencję.",
            link: "freediet",
            price: ""

        },
        {
            id: 2,
            title: "Jednorazowy Plan",
            description: "Jednorazowy, spersonalizowany plan diety przygotowany dla Ciebie.",
            details: "Otrzymasz jednorazowy, spersonalizowany plan diety, który pomoże Ci osiągnąć Twoje cele zdrowotne.",
            link: "onediet",
            price: "39,99 PLN"

        },
        {
            id: 3,
            title: "Kompleksowa Opieka",
            description: "Kompleksowa opieka i indywidualne konsultacje z profesjonalnym trenerem.",
            details: "Otrzymasz pełne wsparcie od profesjonalnego trenera, który będzie dostępny dla Ciebie przez cały czas trwania Twojego planu.",
            link: "complexdiet",
            price: "149,99 PLN"
        }
    ];

    const faqs = [
        {
            question: "Jak długo trwa każdy plan dietetyczny?",
            answer: "Każdy plan dietetyczny jest różny i dostosowany do indywidualnych potrzeb. Możesz wybrać plan miesięczny, kwartalny lub roczny."
        },
        {
            question: "Czy mogę zmienić plan w trakcie trwania?",
            answer: "Tak, masz możliwość zmiany planu w trakcie jego trwania, skontaktuj się z nami, a dostosujemy ofertę do Twoich aktualnych potrzeb."
        },
        {
            question: "Czy plany są dostosowane do wegetarian i wegan?",
            answer: "Tak, oferujemy różnorodne plany, które można dostosować do różnych preferencji i potrzeb dietetycznych, w tym diet wegetariańskich i wegańskich."
        },
        {
            question: "Czy otrzymam wsparcie od dietetyka?",
            answer: "Tak, w ramach niektórych planów oferujemy bezpośrednie wsparcie od kwalifikowanych dietetyków, którzy pomogą Ci w osiągnięciu Twoich celów."
        }
    ];
    const handleSelectOffer = (offer) => {
        setSelectedOffer(offer);
    };


    const handleFAQClick = (index) => {
        if (openQuestion === index) {
            setOpenQuestion(null);
        } else {
            if (openQuestion !== null) {
                setOpenQuestion(null);
                setTimeout(() => {
                    setOpenQuestion(index);
                }, 300);
            } else {
                setOpenQuestion(index);
            }
        }
    };
    const closeModal = () => {
        setSelectedOffer(null);
    }

    return (
        <div className="w-full h-full py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {offers.map(offer => (
                        <OfferCard key={offer.id} offer={offer} onSelect={handleSelectOffer}/>
                    ))}
                </div>
            </div>

            {selectedOffer && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div
                        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedOffer.title}</h3>
                                        <div className="mt-2">
                                            <p className="text-sm leading-5 text-gray-500">{selectedOffer.details}</p>
                                        </div>

                                        <div className="my-6 text-right">
                                            <p className="text-3xl leading-5 text-gray-500">{selectedOffer.price}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">

                                <Link to={`/PurchaseDiet/${selectedOffer.id}`}
                                      className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-500 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5 ml-6">
                                    Kup Teraz
                                </Link>

                                <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                                    <button onClick={closeModal}
                                            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                        Zamknij
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">Dlaczego wybrać nasze diety?</h2>
                <p className="mt-4 text-center text-gray-600">Doświadczony zespół, indywidualne podejście, naukowo
                    opracowane diety.</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">Najczęściej zadawane pytania</h2>
                <dl className="mt-6 space-y-6">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            isOpen={openQuestion === index}
                            onClick={() => handleFAQClick(index)}
                        />
                    ))}
                </dl>
            </div>

        </div>
    );
}

export default Dieta;