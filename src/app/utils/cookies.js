/**
 * Utility functions for managing cookies
 */

// Set a cookie with options
export const setCookie = (name, value, options = {}) => {
  const { expires, path = '/', domain, secure, sameSite = 'strict' } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    if (typeof expires === 'number') {
      const days = expires;
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else if (expires instanceof Date) {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
  }

  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += '; secure';
  if (sameSite) cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

// Get a cookie by name
export const getCookie = (name) => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];

    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

// Remove a cookie by name
export const removeCookie = (name, options = {}) => {
  const { path = '/', domain } = options;

  // To delete a cookie, set its expiration date to a past date
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${path ? `; path=${path}` : ''}${domain ? `; domain=${domain}` : ''}`;
};
