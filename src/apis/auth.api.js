// const authorizedAxiosInstance =  require( "../services/api");
//
// const API_ROOT = process.env. REACT_APP_API_URL || "http://localhost:5000/api";
//
// export const refreshTokenAPI = (refreshToken) => {
//     return authorizedAxiosInstance.post(
//         `${API_ROOT}/auth/refresh-token`,
//         { refreshToken }  // Gửi refresh token trong body
//     );
// };
//
// export const handleLogoutAPI = () => {
//     return authorizedAxiosInstance. post(
//         `${API_ROOT}/auth/logout`
//     );
// };
//
// export const loginAPI = (userData) => {
//     return authorizedAxiosInstance.post(
//         `${API_ROOT}/auth/login`,
//         userData
//     );
// };