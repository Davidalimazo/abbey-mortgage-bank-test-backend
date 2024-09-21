import { Document, ObjectId } from "mongoose";
import { IMediator } from "../../lib/interfaces";
import { IUser } from "../users/interfaces";

export interface IPost extends Document {
	_id: string;
	title: string;
	description: string;
	image_url: string;
	createdAt: string;
	updatedAt: string;
	comments: Comments[]; // Array of comments
	likes: number;
	status: "In Progress" | "Completed" | "Overdue";
	assigned_to: ObjectId;
}

export interface IPostResonse {
	id?: string;
	title: string;
	description: string;
	image_url: string;
	createdAt: string;
	updatedAt: string;
	comments: Comments[]; // Array of comments
	likes: number;
	status: "In Progress" | "Completed" | "Overdue";
	assigned_to: ObjectId;
}

export enum Status {
	InProgress = "In Progress",
	Completed = "Completed",
	Overdue = "Overdue",
}

export interface Comments {
	user: IUser;
	comment: string;
	timestamp: string;
}

export interface CreatePostDto {
	title: string;
	description: string;
	image_url: string;
	createdAt: string;
	updatedAt: string;
	comments: Comments[]; // Array of comments
	likes: number;
	status: "In Progress" | "Completed" | "Overdue";
	assigned_to: ObjectId;
}

export type IUpdatePostModel = Partial<IPost>;

export abstract class IPostRepository {
	abstract createPost(
		createPostDto: CreatePostDto,
	): Promise<IMediator<IPostResonse> | null>;
	abstract getAllPost(): Promise<IMediator<IPostResonse[]> | null>;
	abstract editPost(
		userId: string,
		editPostDto: IUpdatePostModel,
	): Promise<IMediator<IPostResonse | null>>;
	abstract deletePost(
		postId: string,
	): Promise<IMediator<IPostResonse | null>>;
	abstract getAllUserPosts(
		userId: string,
		limit: number,
	): Promise<IMediator<IPostResonse[] | null>>;
	abstract getAPost(postId: string): Promise<IMediator<IPostResonse | null>>;
	abstract commentOnAPost(
		postId: string,
		userId: string,
	): Promise<IMediator<Comments[] | null>>;
	abstract likeAPost(
		userId: string,
		postId: string,
		action: boolean,
	): Promise<IMediator<IPostResonse | null>>;
}
