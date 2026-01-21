// let refreshTokenPromise = null;
//
// const axios = require( "axios");
// const { toast } = require( "react-toastify");
// const { handleLogoutAPI, refreshTokenAPI } = require( "../apis/auth.api");
//
// let authorizedAxiosInstance = axios. create({
//     baseURL: process.env. REACT_APP_API_URL || "http://localhost:5000/api"
// });
//
// authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;
// authorizedAxiosInstance.defaults.withCredentials = true;
// authorizedAxiosInstance.interceptors. response.use(
//     (response) => response,
//     (error) => {
//         const originalRequest = error.config;
//
//         // 410: Token hết hạn
//         if (error.response?.status === 410 && !originalRequest._retry) {
//             originalRequest._retry = true;
//
//             if (!refreshTokenPromise) {
//                 // KHÔNG cần lấy refresh token (nằm trong cookie)
//                 // Cookie sẽ tự động gửi kèm request (withCredentials: true)
//
//                 refreshTokenPromise = refreshTokenAPI()  // Không truyền parameter
//                     .then((res) => {
//                         const { accessToken } = res.data;
//                         localStorage.setItem("accessToken", accessToken);
//                         authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
//                         return accessToken;
//                     })
//                     .catch((_err) => {
//                         handleLogoutAPI().then(() => {
//                             location.href = "/login";
//                         });
//                         return Promise.reject(_err);
//                     })
//                     .finally(() => {
//                         refreshTokenPromise = null;
//                     });
//             }
//
//             return refreshTokenPromise. then((accessToken) => {
//                 originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//                 return authorizedAxiosInstance(originalRequest);
//             });
//         }
//
//         if (error.response?.status !== 410) {
//             toast.error(error.response?.data?.message || error?. message);
//         }
//
//         return Promise.reject(error);
//     }
// );