import { HttpStatus } from "../constants/http_status";

export interface IMediator<T> {
	status: HttpStatus;
	message: string;
	data: T;
}
