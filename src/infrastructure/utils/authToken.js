/**
 * Service to handle authentication tokens in localStorage
 */

const USER_DATA = 'user_data';
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Get the authentication token
 * @returns {string|null} The authentication token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(ACCESS_TOKEN) || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Set the authentication token
 * @param {string} token - The authentication token
 */
export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
    }
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

/**
 * Get the refresh token
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Set the refresh token
 * @param {string} refreshToken - The refresh token
 */
export const setRefreshToken = (refreshToken) => {
  try {
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error('Error setting refresh token:', error);
  }
};

// /**
//  * Get the current user data
//  * @returns {Object|null} The user data or null if not found
//  */
// export const getUser = () => {
//   try {
//     const user = localStorage.getItem(USER_DATA);
//     return user ? JSON.parse(user) : null;
//   } catch (error) {
//     console.error('Error getting user data:', error);
//     return null;
//   }
// };

// /**
//  * Set the current user data
//  * @param {Object} user - The user data
//  */
// export const setUser = (user) => {
//   try {
//     if (user) {
//       localStorage.setItem(USER_DATA, JSON.stringify(user));
//     } else {
//       localStorage.removeItem(USER_DATA);
//     }
//   } catch (error) {
//     console.error('Error setting user data:', error);
//   }
// };

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  try {
    // localStorage.removeItem(USER_DATA);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getToken();
};
