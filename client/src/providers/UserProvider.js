// src/providers/UserProvider.js
import { useState, useEffect } from 'react';
import UserContext from '../context/UserContext';

const UserProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    function parseJwt(token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse(window.atob(base64));
        } catch (error) {
          return null;
        }
      }

      
        
    
    useEffect(() => {
        if (user && user.access_token){
            const tokenData = parseJwt(user.access_token);
            if (tokenData){
                const currentTime = Math.floor(Date.now()/ 1000)
                if (tokenData.exp && currentTime > tokenData.exp) {
                    console.log('Token expired. Logging out')
                    alert('Token expired. Logging out');
                    logout()
                    window.location.assign('http://localhost:3000/')
                }
            }
        }
        setIsLoading(false);
    }, [user])


    const getAuthHeaders = async () => {
        if (user && user.access_token) {
          return {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json',
          };
        } else {
          console.log('no token found');
          return {
            'Content-Type': 'application/json',
          };
        }
      };
      
      


    const login = (newUser) => {
        // setUser(() => JSON.stringify(newUser))
        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
    }

    const logout = () => {
        localStorage.removeItem('user')
    }
    
    return (
        <UserContext.Provider value={{ user, isLoading, login, getAuthHeaders, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;




    // useEffect(() => {
    //     const getTokenFromCookie = () => {
    //         console.log(document.cookie)
    //         const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('access_token='));
    //         return tokenCookie ? tokenCookie.split('=')[1] : '';
    //     };
    
    //     const fetchUserData = async () => {
    //         const token = getTokenFromCookie()
    //         console.log("TOKEN: ", token)
    
    //         // Check if token exists before fetching user data
    //         if (token) {
    //             const response = await fetch(`/whoami`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`,
    //                 },
    //                 credentials: 'include', // Include cookies in the request
    //             });
    
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setUser(data);
    //                 console.log(data);
    //             } else if (response.status === 401) {
    //                 console.error("User not authenticated");
    //             } else if (response.status === 422) {
    //                 const errorData = await response.json();
    //                 console.error("Error fetching user data:", errorData);
    //             } else {
    //                 console.error("Error fetching user data:", response.statusText);
    //             }
    //         } else {
    //             setUser(null);
    //         }
    //         setIsLoading(false);
    //     };
    
    //     fetchUserData();
    // }, []);