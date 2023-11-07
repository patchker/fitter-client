import React, { useState } from 'react';
import axios from 'axios';
import ip from '../../config/Ip'

function PurchaseComponent() {
    const [selectedDiet, setSelectedDiet] = useState(null);

    const handlePurchase = () => {
        const token = localStorage.getItem('access_token');

        axios({
            method: 'post',
            url: ip+'/api/zamowienia/',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                dieta_id: selectedDiet
            }
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <button onClick={handlePurchase}>Zakup</button>
        </div>
    );
}

export default PurchaseComponent;
