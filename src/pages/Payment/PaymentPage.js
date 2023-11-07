import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePayment } from '../../contexts/PaymentContext';
import ip from '../../config/Ip'

function PaymentPage() {
    const navigate = useNavigate();
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [duration, setDuration] = useState(null);
    const [street, setStreet] = useState("test1");
    const [city, setCity] = useState("test2");
    const [zipCode, setZipCode] = useState("test3");
    const [country, setCountry] = useState("test4");
    const { paymentData } = usePayment();


    React.useEffect(() => {
        if (paymentData) {
            setStreet(paymentData.address.street)
            setCity(paymentData.address.city)
            setZipCode(paymentData.address.zipCode)
            setCountry(paymentData.address.country)
            setSelectedDiet(paymentData.selectedPlan)
            setDuration(paymentData.duration)
        }
    }, [paymentData]);
    const handlePayment = () => {
        const token = localStorage.getItem('access_token');

        axios({
            method: 'patch',
            url: ip+'/api/profile/',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                street: street,
                city: city,
                zipCode: zipCode,
                country: country,
            }
        })
            .then((response) => {

            })
            .catch((error) => {
                console.log("Data",street,city,zipCode,country)
                console.log(error);
            });

        console.log("selectedDiet", selectedDiet)
        axios({
            method: 'post',
            url: ip+'/api/zamowienia/',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                dieta_id: selectedDiet.id,
                duration: duration
            }
        })
            .then((response) => {
                console.log(response);
                navigate("/successPage");
            })
            .catch((error) => {

                console.log(error);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-semibold mb-4">Strona Płatności</h2>
            <p className="text-lg mb-6">Proszę kliknąć poniżej, aby dokonać płatności.</p>
            <button
                onClick={handlePayment}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                Zapłać
            </button>
        </div>
    );
}

export default PaymentPage;
