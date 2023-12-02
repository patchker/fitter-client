import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
import ip from '../config/Ip'
export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};
export const verifyToken = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            const response = await axios.post(ip+'/api/verify-token/', { token });
            if (response.status === 200) {
                // Token jest ważny
                return true;
            }
        } catch (error) {
            console.error('Token is invalid or expired!', error);
            // Token jest nieprawidłowy lub wygasł
            return false;
        }
    }
    // Brak tokena
    return false;
};
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [userData, setUserData] = useState(null); // nowy stan dla dodatkowych danych użytkownika

        console.log("currentRole",currentRole)
    const logout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        localStorage.removeItem('userData');
        localStorage.removeItem('currentRole');
        setCurrentUser(null);
    };

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const roleFromStorage = localStorage.getItem('roles');

        if (user) {
            setCurrentUser(JSON.parse(user));


        }
       if (roleFromStorage) {
            setCurrentRole(JSON.parse(roleFromStorage));
        }

        const userDataFromStorage = localStorage.getItem('userData');
        if (userDataFromStorage) {
            setUserData(JSON.parse(userDataFromStorage)); // ustaw userData z localStorage
        }


    }, []);

    const value = {
        currentUser,
        setCurrentUser: (user) => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            setCurrentUser(user);
        },
        userData, // udostępnij userData jako część wartości kontekstu
        setUserData: (data) => {
            localStorage.setItem('userData', JSON.stringify(data)); // zapisz userData w localStorage
            setUserData(data);
        },
        logout: () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userData');
            localStorage.removeItem('access_token');
            localStorage.removeItem('currentRole');
            setCurrentUser(null);
            setUserData(null); // zresetuj także userData
            setCurrentRole(null); // zresetuj także userData
        },
        currentRole, // udostępnij userData jako część wartości kontekstu
        setCurrentRole: (role) => {
            localStorage.setItem('currentRole', JSON.stringify(role)); // zapisz userData w localStorage
            setCurrentRole(role);
        },
    };


    useEffect(() => {
        const checkToken = async () => {
            const isValid = await verifyToken();
            if (!isValid) {
                logout();
            }
        };

        checkToken();
    }, []);




    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
