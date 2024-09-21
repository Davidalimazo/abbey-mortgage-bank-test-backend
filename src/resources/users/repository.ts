import bcrypt from "bcryptjs";
import User from "./models";
import { IMediator } from "../../lib/interfaces";
import { HttpStatus } from "../../lib/constants/http_status";
import {
	CreateUserDto,
	IUserRepository,
	IUser,
	LoginDto,
	IUserResponse,
	IUpdateUserModel,
} from "./interfaces";

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
	async createUser({
		email,
		password,
		profilePicture,
		username,
	}: CreateUserDto): Promise<IMediator<IUserResponse | null>> {
		try {
			// Check if the user already exists
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return {
					data: null,
					message: `User with this ${email} already exists`,
					status: HttpStatus.NOT_ACCEPTABLE,
				};
			}

			// Hash the password before saving
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create a new user
			const newUser = new User({
				username,
				email,
				password: hashedPassword, // Store the hashed password
				profile_picture: profilePicture,
				followers: [], // Initialize as empty array
				posts: [], // Initialize as empty array
			});

			// Save the new user to the database
			const savedUser = await newUser.save();

			const { password: userPassword, ...rest } = savedUser.toObject();

			return {
				data: { id: rest._id, ...rest },
				message: "Success",
				status: HttpStatus.OK,
			};
		} catch (error) {
			throw error;
		}
	}

	async login({
		email,
		password,
	}: LoginDto): Promise<IMediator<IUserResponse | null>> {
		try {
			// Check if the user already exists
			const existingUser = await User.findOne({ email });
			if (!existingUser) {
				return {
					data: null,
					message: `User with this ${email} does not exists`,
					status: HttpStatus.BAD_REQUEST,
				};
			}

			const user = existingUser.toObject({ flattenObjectIds: true });

			const comparePassword = await bcrypt.compare(
				password,
				user.password,
			);
			const { password: userPassword, ...rest } = user;

			if (comparePassword) {
				return {
					data: { id: rest._id, ...rest },
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
