import { POST_STATUS } from "../../lib/enums/post.enum";
import { IMediator } from "../../lib/interfaces";

export interface IPost {
	userId: string;
	postId: string;
	title: string;
	description: string;
	image_url: string;
	created_at: string;
	updated_at: string;
	status: POST_STATUS;
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
	status: POST_STATUS;
	userId: string; // Matches userId from users table
	postId?: string;
}

export type IUpdatePostModel = Partial<IPost>;

export abstract class IPostRepository {
	abstract createPost(
		createPostDto: CreatePostDto,
	): Promise<IMediator<IPost> | null>;
	abstract getAllPost(): Promise<IMediator<IPost[]> | null>;
	abstract editPost(
		userId: string,
		postId: string,
		editPostDto: IUpdatePostModel,
	): Promise<IMediator<IPost | null>>;
	abstract deletePost(
		userId: string,
		postId: string
	): Promise<IMediator<string | null>>;
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
