export type RegisterState = {
	success: boolean;
	message: string;
	errors: {
		name?: string[];
		email?: string[];
		password?: string[];
	} | null;
	inputs: {
		name: string;
		email: string;
		password: string;
	};
};

export type LoginState = {
	success: boolean;
	message: string;
	errors: {
		email?: string[];
		password?: string[];
	} | null;
	inputs: {
		email: string;
		password: string;
	};
};
