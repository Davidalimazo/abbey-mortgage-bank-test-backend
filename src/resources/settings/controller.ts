import {Request, Response} from "express"
import userRepository from "./repository"
import { saveAuditDetails } from "../../utils/constants";



class SettingsController{
    async performRmanBackup(req:any, res:Response){
   
        try {
            const data:any = await userRepository.performRmanBackup();
      
            if(data?.status > 200 || data === undefined){
                return res.status(400).json({error:data?.error})
             }
             await saveAuditDetails(req, res, 200, "Backup Database", "Database", "Whole Database", "");

            return res.status(200).json({data:"Database backup successful"})
            
        } catch (err) {
            return res.status(500).json({error:"user creation failed"}) 
        }
        
    }
}



export default new SettingsController()