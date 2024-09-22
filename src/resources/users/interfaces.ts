import { GENDER_ENUM, USER_ENUM } from "../../lib/enums/auth.enum";
import { IMediator } from "../../lib/interfaces";

// Define an interface that extends Document
export interface IUser {
	id: number;
	userId: string;
	firstName: string;
	middleName: string;
	userType: USER_ENUM;
	city: string;
	state: string;
	gender: GENDER_ENUM;
	phoneNumber: string;
	username: string;
	dateOfBirth: string;
	avatarUrl?: string;
	timestamps: string;
	isEmailVerified: boolean;
	isActivated: boolean;
	password: string;
	email: string;
	created_at: string;
	updated_at: string;
}

export interface IUserResponse {
	id: number;
	userId: string;
	firstName: string;
	middleName: string;
	username: string;
	userType: USER_ENUM;
	city: string;
	state: string;
	gender: GENDER_ENUM;
	phoneNumber: string;
	dateOfBirth: string;
	avatarUrl?: string;
	timestamps: string;
	isEmailVerified: boolean;
	isActivated: boolean;
	email: string;
	created_at: string;
	updated_at: string;
}

export interface CreateUserDto {
	firstName: string;
	middleName: string;
	userId: string;
	userType: USER_ENUM;
	username: string;
	city: string;
	state: string;
	gender: GENDER_ENUM;
	phoneNumber: string;
	dateOfBirth: string;
	password: string;
	avatarUrl?: string;
	email: string;
}
export interface LoginDto {
	email: string;
	password: string;
}
export interface ChangePasswordDto {
	oldPassword: string;
	newPassword: string;
	email: string;
}

export type IUpdateUserModel = Partial<CreateUserDto>;
export type ICreateUserResponse = IUserResponse | Error;

export abstract class IUserRepository {
	abstract createUser(
		createUserDto: CreateUserDto,
	): Promise<IMediator<IUserResponse | null>>;
	abstract getUser(userId: string): Promise<IMediator<IUserResponse | null>>;
	abstract login(
		loginDto: LoginDto,
	): Promise<IMediator<IUserResponse | null>>;
	abstract changeUserPassword(
		changePasswordDto: ChangePasswordDto,
	): Promise<IMediator<boolean | null>>;
	abstract updateUser(
		updateUserDto: IUpdateUserModel,
	): Promise<IMediator<IUserResponse | null>>;
	abstract followUser(
		userId: string,
		action: boolean,
	): Promise<IMediator<IUserResponse | null>>;
}
