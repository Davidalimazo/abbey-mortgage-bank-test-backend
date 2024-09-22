import db from "../../database";
import { CreateUserDto, IUser } from "./interfaces";

class UserDAO {
	async createUser(userDto: CreateUserDto) {
		const data = await db<IUser>("users")
			.insert({
				...userDto,
			})
			.returning("*");
		return data[0];
	}

	async findUserByEmail({ email }: { email: string }) {
		const user = await db<IUser>("users").where(
			"email",
			email.toLowerCase(),
		);
		return user[0];
	}

	async findUserById({ userId }: { userId: string }) {
		const user = await db<IUser>("users").where("userId", userId);
		return user[0];
	}

    async updateUser({ user, userId }: { user: Partial<IUser>; userId: string }) {
        const updatedUser = await db<IUser>('users').where({ userId }).update(user).returning('*');
        return updatedUser[0];
    };
}

export default new UserDAO();
