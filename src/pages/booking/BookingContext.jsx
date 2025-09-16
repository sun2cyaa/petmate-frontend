import React, { createContext, useContext, useReducer } from "react";

const BookingContext = createContext();

const initialState = {
  step: 1,
  selectedProduct: null,
  selectedDate: null,
  selectedTime: null,
  selectedPets: [],
  request: "",
  totalPrice: 0,
};

const bookingReducer = (state, action) => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SELECT_PRODUCT":
      return { ...state, selectedProduct: action.payload };
    case "SELECT_DATE":
      return { ...state, selectedDate: action.payload };
    case "SELECT_TIME":
      return { ...state, selectedTime: action.payload };
    case "SELECT_PETS":
      return { ...state, selectedPets: action.payload };
    case "SET_REQUEST":
      return { ...state, request: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const nextStep = () =>
    dispatch({ type: "SET_STEP", payload: state.step + 1 });
  const prevStep = () =>
    dispatch({ type: "SET_STEP", payload: state.step - 1 });

  return (
    <BookingContext.Provider value={{ state, dispatch, nextStep, prevStep }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
};
