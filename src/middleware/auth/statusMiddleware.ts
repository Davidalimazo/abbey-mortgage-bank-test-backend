import { NextFunction, Request, Response } from 'express';
import { saveAuditDetails } from '../../utils/constants';

export const checkUserStatus = async(req: any, res: Response, next: NextFunction) => {

	if (req.locals.STATUS !== 1) {
        return res.status(400).json({error:"User disabled, contact admin"})
	}

	next();
};
