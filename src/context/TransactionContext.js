// /context/TransactionContext.js
import React, { createContext, useState } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [selectedServices, setSelectedServices] = useState({
    software: null,
    custodia: null,
    digitalizacion: null,
  });
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const updateTransaction = (newServices, newTotal, newDiscount) => {
    setSelectedServices(newServices);
    setTotal(newTotal);
    setDiscount(newDiscount);
  };

  return (
    <TransactionContext.Provider
      value={{
        selectedServices,
        total,
        discount,
        updateTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
