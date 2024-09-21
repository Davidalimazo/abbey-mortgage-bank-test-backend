import { Document } from "mongoose";
import { IMediator } from "../../lib/interfaces";

// Define an interface that extends Document
export interface IUser extends Document {
	_id: string;
	username: string;
	password: string;
	email: string;
	profile_picture: string;
	followers: string[];
	posts: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IUserResponse {
	id: string;
	username: string;
	email: string;
	profile_picture: string;
	followers: string[];
	posts: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateUserDto {
	username: string;
	email: string;
	password: string;
	profilePicture: string;
}
export interface LoginDto {
	email: string;
	password: string;
}


export type IUpdateUserModel = Partial<CreateUserDto>;
export type ICreateUserResponse = IUserResponse | Error;

export abstract class IUserRepository {
	abstract createUser(
		createUserDto: CreateUserDto,
	): Promise<IMediator<IUserResponse | null>>;
	abstract getUser(
		userId: string,
	): Promise<IMediator<IUserResponse | null>>;
	abstract login(
		loginDto: LoginDto,
	): Promise<IMediator<IUserResponse | null>>;
	abstract updateUser(
		updateUserDto: IUpdateUserModel,
	): Promise<IMediator<IUserResponse | null>>;
	abstract followUser(
		userId: string,
		action: boolean,
	): Promise<IMediator<IUserResponse | null>>;
}
