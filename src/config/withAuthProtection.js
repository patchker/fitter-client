import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../contexts/AuthContext';

const withAuthProtection = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        const [isVerified, setIsVerified] = useState(false);

        useEffect(() => {
            const checkTokenValidity = async () => {
                const isValid = await verifyToken();
                if (!isValid) {
                    navigate("/login");
                } else {
                    setIsVerified(true);
                }
            };

            checkTokenValidity();
        }, [navigate]);

        return isVerified ? <WrappedComponent {...props} /> : null;
    };
};

export default withAuthProtection;
