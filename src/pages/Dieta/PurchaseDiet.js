import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePayment } from '../../contexts/PaymentContext';
import axios from "axios";
import ip from "../../config/Ip";

function PurchaseDiet() {
    const { userData, setUserData } = useAuth(); // Używamy hooka useAuth, aby uzyskać dostęp do danych użytkownika
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [duration, setDuration] = useState("");
    const { planType } = useParams();
    const { setPaymentData } = usePayment();



    useEffect(() => {
        if (!userData) {
            const fetchData = async () => {
                try {
                    const accessToken = localStorage.getItem('access_token');
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    };
                    const response = await axios.get(ip+'/api/profile/', { headers });
                    if (response.status === 200) {
                        setUserData(response.data);

                    }

                } catch (err) {
                    console.error('An error occurred while fetching user data.', err);
                }
            };
            fetchData();
        }
    }, []);


    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });
    const [address, setAddress] = useState({
        street: "",
        city: "",
        zipCode: "",
        country: ""
    });

    const [paymentMethod, setPaymentMethod] = useState(""); // Dodano stan dla metody płatności


    useEffect(() => {
        // Upewnij się, że dane użytkownika są załadowane przed próbą ich wykorzystania
        if (userData) {
            console.log('User data loaded:', userData);
        }
    }, [userData]);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPersonalInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };
    function loadDietPlan(planType) {
        const dietPlans = [
            {
                id: 1,
                type: "Darmowy",
                title: "Darmowy Plan od AI",
                details: "Idealny dla osób rozpoczynających swoją przygodę z dietą. Oferuje podstawowe wskazówki i plany żywieniowe.",
                price: 0
            },
            {
                id: 2,
                type: "Standardowy",
                title: "Jednorazowy Plan",
                details: "Świetny wybór dla tych, którzy potrzebują spersonalizowanego planu, ale nie potrzebują długotrwałego wsparcia.",
                price: 39.99
            },
            {
                id: 3,
                type: "Premium",
                title: "Kompleksowa Opieka",
                details: "Oferuje kompleksowe wsparcie, dostęp do dietetyka online, personalizowane plany i analizy.",
                price: 99.99
            }
        ];
        console.log(planType)
        const planId = Number(planType);

        return dietPlans.find(plan => plan.id === planId);
    }
    function calculateTotalPrice() {
        if (!selectedPlan || !duration) return "0 PLN";

        const months = parseInt(duration); // Zakładam, że wartość duration jest liczbą reprezentującą liczbe miesięcy
        const totalPrice = selectedPlan.price * months;

        // Zwraca wartość zaokrągloną do dwóch miejsc po przecinku
        return `${totalPrice.toFixed(2)} PLN`;
    }


    useEffect(() => {
        const loadedPlan = loadDietPlan(planType);
        setSelectedPlan(loadedPlan);
    }, [planType]);

    const handlePurchase = () => {
        if (!selectedPlan || !duration || !userData.first_name ||
            !userData.last_name || !userData.email ||
            !address.street || !address.city || !address.zipCode ||
            !address.country || !paymentMethod) {
            console.log(selectedPlan)
            console.log(duration)
            console.log(userData.first_name)
            console.log(userData.last_name)
            console.log(userData.email)
            console.log(address.street)
            console.log(address.city)
            console.log(address.zipCode)
            console.log(address.country)
            console.log(paymentMethod)
            alert("Proszę wypełnić wszystkie pola.");
            return;
        }
        setPaymentData({
            address: address,
            selectedPlan: selectedPlan,
            duration: duration
        });

        //alert(`Zakupiłeś dietę: ${selectedPlan.title} na czas trwania: ${duration}`);
        navigate("/paymentPage");

    };


    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="max-w-lg mx-auto py-16 px-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Zakup Planu Diety</h2>

            {selectedPlan && (
                <div className="mb-6 p-4 border rounded bg-gray-50">
                    <h3 className="text-lg font-medium mb-2">{selectedPlan.title}</h3>
                    <p className="mb-2 text-gray-700">{selectedPlan.details}</p>
                    <p className="font-semibold">{`Cena: ${selectedPlan.price}`} PLN/msc</p>
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Czas trwania</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-2 border rounded">
                    <option value="">Wybierz czas trwania</option>
                    <option value="1">1 Miesiąc</option>
                    <option value="3">3 Miesiące</option>
                    <option value="6">6 Miesięcy</option>
                    <option value="12">12 Miesięcy</option>
                </select>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">Dane osobowe</h3>

                    {userData ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Imię i Nazwisko
                                </label>
                                <p className="text-gray-700">
                                    {userData.first_name} {userData.last_name}
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <p className="text-gray-700">
                                    {userData.email}
                                </p>
                            </div>



                        </>
                    ) : (
                        <p>Trwa ładowanie danych użytkownika...</p>
                    )}


                </div>

                <Link to="/UserProfile" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                    Profil Użytkownika
                </Link>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Adres</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                        placeholder="Ulica i numer domu/mieszkania"
                    />
                    <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                        placeholder="Miasto"
                    />
                    <input
                        type="text"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                        placeholder="Kod pocztowy"
                    />
                    <input
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded"
                        placeholder="Kraj"
                    />
                </div>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Sposób płatności</h3>
                <div className="space-y-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="creditCard"
                            checked={paymentMethod === "creditCard"}
                            onChange={handlePaymentMethodChange}
                        />
                        <span className="ml-2">Blik</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentMethod === "paypal"}
                            onChange={handlePaymentMethodChange}
                        />
                        <span className="ml-2">PayPal</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="bankTransfer"
                            checked={paymentMethod === "bankTransfer"}
                            onChange={handlePaymentMethodChange}
                        />
                        <span className="ml-2">Stripe</span>
                    </label>
                </div>
            </div>
            <p className=" text-right mt-10 text-gray-400">Całkowita cena: <span className=" font-semibold text-2xl text-gray-800">{`${calculateTotalPrice()}`}</span></p>

            <button onClick={handlePurchase} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Kup Teraz
            </button>
        </div>
    );
}

export default PurchaseDiet;
