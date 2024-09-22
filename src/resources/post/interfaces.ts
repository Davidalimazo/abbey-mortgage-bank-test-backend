import { POST_ENUM } from "../../lib/enums/post.enum";
import { IMediator } from "../../lib/interfaces";

export interface IPost {
	id: number;
	userId: string;
	postId: string;
	title: string;
	description: string;
	image_url: string;
	created_at: string;
	updated_at: string;
	status: POST_ENUM;
}

export interface Comments {
	userId: string;
	postId: string;
	commentId: string;
	comment: string;
	created_at: string;
	updated_at: string;
}

export interface PostReactions {
	userId: string;
	postId: string;
	postReactionId: string;
	like: number;
	dislike: number;
	created_at: string;
	updated_at: string;
}
export interface CommentReactions {
	userId: string;
	postId: string;
	commentReactionId: string;
	commentId: string;
	like: number;
	dislike: number;
	created_at: string;
	updated_at: string;
}

export interface CreatePostDto {
	title: string;
	description: string;
	image_url: string;
	createdAt: string;
	updatedAt: string;
	comments: Comments[]; // Array of comments
	likes: number;
	status: POST_ENUM;
}

export type IUpdatePostModel = Partial<IPost>;

export abstract class IPostRepository {
	abstract createPost(
		createPostDto: CreatePostDto,
	): Promise<IMediator<IPost> | null>;
	abstract getAllPost(): Promise<IMediator<IPost[]> | null>;
	abstract editPost(
		userId: string,
		editPostDto: IUpdatePostModel,
	): Promise<IMediator<IPost | null>>;
	abstract deletePost(postId: string): Promise<IMediator<IPost | null>>;
	abstract getAllUserPosts(
		userId: string,
		limit: number,
	): Promise<IMediator<IPost[] | null>>;
	abstract getAPost(postId: string): Promise<IMediator<IPost | null>>;
	abstract commentOnAPost(
		postId: string,
		userId: string,
	): Promise<IMediator<Comments[] | null>>;
	abstract likeAPost(
		userId: string,
		postId: string,
		action: boolean,
	): Promise<IMediator<IPost | null>>;
}
