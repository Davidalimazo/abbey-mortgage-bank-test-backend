import {Request, Response} from "express"
import militaryInfoRepository from "./repository"
import { MilitarySearchCriteria } from "./interface";
import { saveAuditDetails } from "../../utils/constants";




class MilitaryInfoController{
    
    async upload(req:any, res:Response){
    
       
        try {
            const data:any = await militaryInfoRepository.uploadRecords(req.body.militaryDetailsData, );
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                await saveAuditDetails(req, res, 201, "Uploaded Military Info", "MILITARY_INFORMATION", "", "");
                return res.status(200).json(`Militarys info uploaded successful`)
             }
           return res.status(400).json({error: "Militarys info upload failed"})
            
        } catch (err) {
            return res.status(500).json({error:"Military info upload failed"}) 
        }
        
    }

    async getAllMilitaryInfo(req:any, res:Response){
        try {
            const data:any = await militaryInfoRepository.findAllMilitary(req.locals.PERSONNEL_NO);
            if(data?.errorNum){
    
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Military info found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }
    async getByColumnNameInfo(req:Request, res:Response){
        const {column} =  req.params;

        try {
            const data:any = await militaryInfoRepository.findByColumnName(column as MilitarySearchCriteria);
            if(data?.errorNum){

                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Military info found"})
        } catch (error:any) {

            return res.status(500).json({error:error.message})
        }
    }

    async getMilitaryByPersonalNo(req:any, res:Response){
       
        try {
             const data:any = await militaryInfoRepository.findMilitaryInfoByPersonalNo(req.params.id, req.locals.PERSONNEL_NO);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Military info not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }
    async updateMilitaryInfoByPersonalNo(req:any, res:Response){

        try {
            const data:any = await militaryInfoRepository.updateMilitaryInfoByPersonalNo(req.params.id, req.body, req.locals.PERSONNEL_NO);
     
       if(data?.errorNum){
           return res.status(400).json({error:data?.code})
        }
        if(data){
           return res.status(200).json(`${data} updated successfully`)
        }
        return res.status(400).json({error:"Military info not found"})
       
       } catch (error:any) {
           return res.status(500).json({error:error.message})
       }
       }

    async getMilitarysByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await militaryInfoRepository.findMilitaryInfoByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
    
                return res.status(400).json({error:data?.code})
             }

             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new MilitaryInfoController()