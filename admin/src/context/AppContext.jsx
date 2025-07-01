import { createContext } from 'react';

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const calculateAge = (dob) => {
        if (!dob) return null;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        if (!slotDate || typeof slotDate !== "string") return "Invalid Date";
        const dateArray = slotDate.split('_');
        if (dateArray.length !== 3) return "Invalid Date";
        const day = dateArray[0];
        const monthIndex = Number(dateArray[1]) - 1;
        const year = dateArray[2];
        return `${day} ${months[monthIndex]} ${year}`;
    };

    return (
        <AppContext.Provider value={{ calculateAge, slotDateFormat, backendUrl }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
