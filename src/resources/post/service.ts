import { Request, Response } from "express";
import postRepository from "./repository";
import { HttpStatus } from "../../lib/constants/http_status";

class PostService {
	async createpost(req: Request, res: Response): Promise<any> {
		const {
			title,
			description,
			image_url,
			createdAt,
			updatedAt,
			comments,
			likes,
			status,
			assigned_to,
		} = req.body;
		try {
			const data = await postRepository.createPost({
				title,
				description,
				image_url,
				createdAt,
				updatedAt,
				comments,
				likes,
				status,
			
			});

			if (data.status === HttpStatus.OK) {
				return res.status(HttpStatus.OK).json(data.data);
			} else {
				return res.status(data.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}

	async editPost(req: Request, res: Response): Promise<any> {
		const { userId, post } = req.body;
		try {
			const data = await postRepository.editPost(userId, post);

			if (data.status === HttpStatus.OK) {
				return res.status(HttpStatus.OK).json(data.data);
			} else {
				return res.status(data.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}

	async getAllPost(req: Request, res: Response): Promise<any> {
		const { pageSize, pageNumber } = req.body;
		try {
			const data = await postRepository.getAllPost();

			if (data.status === HttpStatus.OK) {
				return res.status(HttpStatus.OK).json(data.data);
			} else {
				return res.status(data?.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}
}

export default new PostService();
