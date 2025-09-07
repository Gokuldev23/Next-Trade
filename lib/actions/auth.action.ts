"use server";
import bcrypt from "bcrypt";
import { db } from "../db/postgres";
import z from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../auth/session";

const loginSchema = z.object({
	email: z.email("Please enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const login = async (prev: any, formData: FormData) => {
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const result = loginSchema.safeParse(data);

	if (!result.success) {
		const flattened = z.flattenError(result.error).fieldErrors;
		return {
			...prev,
			success: false,
			message: "Validation Error",
			errors: flattened,
			inputs: data,
		};
	}

	try {
		const user = await userInDb(data.email);
		if (!user) {
			return {
				...prev,
				success: false,
				message: "User not exists! Please Register.",
				errors: null,
				inputs: data,
			};
		}

		const isPassSame = await comparePassword(data.password, user.password_hash);
		if (!isPassSame) {
			return {
				...prev,
				success: false,
				message: "Unauthorized! Incorrect password.",
				errors: null,
				inputs: { email: data.email, password: "" }, // clear password
			};
		}
		delete user.password_hash;
		let session = await createSession(user);
		if (!session) {
			throw new Error("Session creation failed");
		}

		return {
			...prev,
			success: true,
			message: "Login successful",
			errors: null,
			inputs: null,
		};
	} catch (error) {
		console.log({ error });
		return {
			...prev,
			success: false,
			message: "Something went wrong",
			errors: null,
			inputs: data,
		};
	}
};

const registerSchema = z.object({
	name: z.string().min(2, "Too Small name or Invalid name").max(50),
	email: z.email().min(3, "Please give valid email address").max(30),
	password: z.string().min(8, "Password is not valid").max(20),
});

const register = async (prev: any, formData: FormData) => {
	const data = {
		name: formData.get("name") as string,
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const result = registerSchema.safeParse(data);

	if (!result.success) {
		const flattened = z.flattenError(result.error).fieldErrors;

		return {
			...prev,
			success: false,
			message: "Validation Error",
			errors: flattened,
			inputs: data,
		};
	}

	try {
		const userPresent = await userInDb(data.email);
		if (userPresent) {
			return {
				...prev,
				success: false,
				message: "User already exists! Please Login.",
				errors: null,
				inputs: data,
			};
		}
		const hashedPass = await hashPassword(data.password);
		if (!hashedPass) {
			return {
				...prev,
				success: false,
				message: "Something went wrong!",
				errors: null,
				inputs: data,
			};
		}
		const { user, message } = await createUserInDb({
			name: data.name,
			email: data.email,
			password: hashedPass,
		});
		if (!user) {
			throw new Error(message);
		} else {
			return {
				...prev,
				success: true,
				message: "Successfully created",
				errors: null,
				inputs: null,
			};
		}
	} catch (error) {
		return {
			...prev,
			success: false,
			message: error,
			errors: null,
			inputs: data,
		};
	}
};

async function userInDb(email: string) {
	const res = await db.query(
		`
            SELECT * FROM users 
            WHERE email = $1
    `,
		[email],
	);
	const user = res.rows[0];
	return user;
}

async function comparePassword(passFromUser: string, hashedPassFromDb: string) {
	const isPassSame = await bcrypt.compare(passFromUser, hashedPassFromDb);
	return isPassSame;
}

async function hashPassword(userPassword: string) {
	const SALT_ROUND = 10;
	const salt = await bcrypt.genSalt(SALT_ROUND);
	const hash = await bcrypt.hash(userPassword, salt);
	if (hash.length > 0) {
		return hash;
	}
	return null;
}

interface User {
	name: string;
	email: string;
	password: string;
}

async function createUserInDb({ name, email, password }: User) {
	try {
		const res = await db.query(
			`
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
      `,
			[name, email, password],
		);

		return { success: true, user: res.rows[0] };
	} catch (error: any) {
		if (error.code === "23505") {
			return { success: false, message: "Email already exists", user: null };
		}
		return { success: false, message: "Something went wrong", user: null };
	}
}

const logout = async () => {
	await deleteSession();
	redirect("/auth/login");
};

export { login, register, logout };
