// Cesta: frontend/src/lib/api.ts

import axios from 'axios';

// Vytvoříme axios instanci s výchozím nastavením
export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true, // Pro cookies (refresh token)
});

// Request interceptor - přidá access token do každého requestu
api.interceptors.request.use(
	(config) => {
		// Získáme token z localStorage
		const token = localStorage.getItem('accessToken');

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor - automaticky obnoví token při expiraci
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Pokud token vypršel a ještě jsme nezkoušeli refresh
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Zkusíme obnovit token
				const { data } = await axios.post(
					`${
						process.env.NEXT_PUBLIC_API_URL ||
						'http://localhost:4000'
					}/auth/refresh`,
					{},
					{ withCredentials: true }
				);

				// Uložíme nový token
				localStorage.setItem('accessToken', data.data.accessToken);

				// Zopakujeme původní request s novým tokenem
				originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				// Refresh selhal → odhlásíme uživatele
				localStorage.removeItem('accessToken');
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);
