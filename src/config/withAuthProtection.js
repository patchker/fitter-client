import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../contexts/AuthContext';

const withAuthProtection = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        const [isVerified, setIsVerified] = useState(false); // stan, który będzie trzymał informację, czy token został zweryfikowany

        useEffect(() => {
            const checkTokenValidity = async () => {
                const isValid = await verifyToken();
                if (!isValid) {
                    navigate("/login");
                } else {
                    setIsVerified(true); // jeśli token jest ważny, ustaw isVerified na true
                }
            };

            checkTokenValidity();
        }, [navigate]);

        // Renderuj WrappedComponent tylko, jeśli token jest zweryfikowany
        return isVerified ? <WrappedComponent {...props} /> : null;
    };
};

export default withAuthProtection;
