import React, { createContext, useState } from 'react';

export const OrderPlacedContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderPlaced, setOrderPlaced] = useState(false);

    function setOrder(orderPlaced)
    {
        console.log("[CONTEXT] Zmiana na ", !orderPlaced)
        setOrderPlaced(prevOrderPlaced => !prevOrderPlaced);
    }


    return (
        <OrderPlacedContext.Provider value={{ orderPlaced, setOrderPlaced, setOrder }}>
            {children}
        </OrderPlacedContext.Provider>
    );
};
