import { jwtDecode } from 'jwt-decode';

export const saveToken = (token) => {
    sessionStorage.setItem('token', token);
};

export const getToken = () => {
    return sessionStorage.getItem('token');
};

export const removeToken = () => {
    sessionStorage.removeItem('token');
};
export function getRole() {
    const token = getToken();
    if (token) {
        const decoded = jwtDecode(token);
        return decoded.role;
    }
    return null;
}
export function getEventId(token) {
    if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded)
        return decoded.eventId;
    }
    return null;
}
export const decodeToken = (token) => {
    const decodedToken = jwtDecode(token);
    return {
      userId: decodedToken.userId,
      role: decodedToken.role,
      eventId: decodedToken.eventId,
    };
  };
  