import React, { createContext, useState, useEffect, useContext } from 'react';
import { initDatabase, storeToken, getToken, deleteToken } from '../utils/sqliteToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      await initDatabase(); // initialize db

      // await deleteToken(); // for testing purpose lang

      const storedToken = await getToken(); // retrieve stored token
      console.log('Debug: Retrieved Token from SQLite ->', storedToken);
      if (storedToken) {
        setToken(storedToken.token);
        setUser(storedToken.userId);
      }
      setLoading(false);
    };

    loadToken();
  }, []);

  const login = async (jwtToken, userData) => {
    console.log('Login userData:', JSON.stringify(userData, null, 2));

    // check which ID field exists
    const userId = userData._id || userData.id;
    console.log('Using userId:', userId);

    setToken(jwtToken);
    setUser(userData);
    await storeToken(jwtToken, userData._id, Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await deleteToken(); // remove token from SQLite
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);






