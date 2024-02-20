import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import './Confirm.css';
import ip from "../../config/Ip";

function Confirm() {
    const [statusMessage, setStatusMessage] = useState('');
    const {token} = useParams();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(ip + `/api/verify/${token}`);
                setStatusMessage(response.data.message);
            } catch (error) {
                setStatusMessage(
                    error.response
                        ? error.response.data.message
                        : 'Wystąpił błąd podczas weryfikacji e-maila.'
                );
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="confirm-container">
            <h2 className="confirm-title">Weryfikacja E-maila</h2>
            <p className="confirm-message">{statusMessage}</p>
        </div>
    );
}

export default Confirm;
