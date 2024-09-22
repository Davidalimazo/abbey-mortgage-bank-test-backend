import bcrypt from "bcryptjs";
import { IMediator } from "../../lib/interfaces";
import { HttpStatus } from "../../lib/constants/http_status";
import {
	CreateUserDto,
	IUserRepository,
	IUser,
	LoginDto,
	IUserResponse,
	IUpdateUserModel,
	ChangePasswordDto,
} from "./interfaces";

import UserDAO from "./dao";
import { v4 } from "uuid";

class UserRepository extends IUserRepository {
	getUser(userId: string): Promise<IMediator<IUserResponse | null>> {
		throw new Error("Method not implemented.");
	}
	updateUser(
		updateUserDto: IUpdateUserModel,
	): Promise<IMediator<IUserResponse | null>> {
		throw new Error("Method not implemented.");
	}
	followUser(
		userId: string,
		action: boolean,
	): Promise<IMediator<IUserResponse | null>> {
		throw new Error("Method not implemented.");
	}
	async createUser(
		userDTO: CreateUserDto,
	): Promise<IMediator<IUserResponse | null>> {
		try {
			// Check if the user already exists
			const existingUser = await UserDAO.findUserByEmail({
				email: userDTO.email,
			});

			if (existingUser) {
				return {
					data: null,
					message: `User with this ${userDTO.email} already exists`,
					status: HttpStatus.NOT_ACCEPTABLE,
				};
			} else {
				// Hash the password before saving
				const hashedPassword = await bcrypt.hash(userDTO.password, 12);

				// Create a new user
				const newUser = await UserDAO.createUser({
					...userDTO,
					userId: v4(),
					password: hashedPassword,
				});

				return {
					data: newUser,
					message: "Success",
					status: HttpStatus.OK,
				};
			}
		} catch (error) {
			throw error;
		}
	}

	async changeUserPassword(
		changePasswordDto: ChangePasswordDto,
	): Promise<IMediator<boolean | null>> {
		const { oldPassword, newPassword, email } = changePasswordDto;
		try {
			let user: IUser = await UserDAO.findUserByEmail({ email });

			if (user?.email) {
				const salt = await bcrypt.genSalt(12);

				const compare = await bcrypt.compare(
					oldPassword,
					user.password,
				);

				if (compare) {
					const hash = await bcrypt.hash(newPassword, salt);
					const detailsToUpdate = { password: hash };

					const result: any = await UserDAO.updateUser({
						user: detailsToUpdate,
						userId: user.userId,
					});

					return {
						data: true,
						message: "Password changed successfully",
						status: HttpStatus.OK,
					};
				}

				return {
					data: false,
					message: "Password do not match",
					status: HttpStatus.BAD_REQUEST,
				};
			} else {
				return {
					data: false,
					message: "Account Not Found",
					status: HttpStatus.BAD_REQUEST,
				};
			}
		} catch (error: any) {
			throw error;
		}
	}

	async login({
		email,
		password,
	}: LoginDto): Promise<IMediator<IUserResponse | null>> {
		try {
			// Check if the user already exists
			const existingUser = await UserDAO.findUserByEmail({
				email: email,
			});
			if (!existingUser) {
				return {
					data: null,
					message: `User with this ${email} does not exists`,
					status: HttpStatus.BAD_REQUEST,
				};
			}

			const comparePassword = await bcrypt.compare(
				password,
				existingUser.password,
			);

			const { password: userpwd, ...rest } = existingUser;

			if (comparePassword) {
				return {
					data: rest,
					message: "Success",
					status: HttpStatus.OK,
				};
			} else {
				return {
					data: null,
					message: `Password do not match`,
					status: HttpStatus.NOT_ACCEPTABLE,
				};
			}
		} catch (error) {
			throw error;
		}
	}
}

export default new UserRepository();
