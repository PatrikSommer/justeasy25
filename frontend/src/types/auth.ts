// Cesta: frontend/src/types/auth.ts

export type User = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	role: 'ADMIN' | 'EDITOR' | 'USER';
};

export type AuthResponse = {
	user: User;
};

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
	user: User;
};
