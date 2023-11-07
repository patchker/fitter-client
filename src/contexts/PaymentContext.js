import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const usePayment = () => {
    return useContext(PaymentContext);
};

export const PaymentProvider = ({ children }) => {
    const [paymentData, setPaymentData] = useState(null);

    return (
        <PaymentContext.Provider value={{ paymentData, setPaymentData }}>
            {children}
        </PaymentContext.Provider>
    );
};
