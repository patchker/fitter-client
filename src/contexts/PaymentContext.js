import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const usePayment = () => {
    return useContext(PaymentContext);
};

export const PaymentProvider = ({ children }) => {

    const [paymentData, setPaymentData] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);

    //console.log("Payment",{ orderPlaced, setOrderPlaced });

    return (
        <PaymentContext.Provider value={{ paymentData, setPaymentData, orderPlaced, setOrderPlaced }}>
            {children}
        </PaymentContext.Provider>
    );
};
