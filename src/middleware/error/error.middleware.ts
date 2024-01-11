import {Request, Response, NextFunction} from "express";
import HttpExceptions from "../../utils/exceptions/http.exceptions";


function ErrorMiddleWare(
	error:HttpExceptions,
	req:Request,
	res:Response,
	next:NextFunction
){
	const status = error.status || 500;
	const message = error.message || "Something went wrong";
	res.status(status).send({
		status, message
	});
}
export default ErrorMiddleWare;