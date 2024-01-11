import {Request, Response} from "express"
import militaryQualificationsInfoRepository from "./repository"




class MilitaryQualificationsInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await militaryQualificationsInfoRepository.uploadRecords(req.body.militaryQualificationsDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`militaryQualificationss uploaded successful`)
             }
           return res.status(400).json({error: "militaryQualificationss upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"militaryQualifications upload failed"}) 
        }
        
    }

    async getAllmilitaryQualifications(req:Request, res:Response){
        try {
            const data:any = await militaryQualificationsInfoRepository.findAllMilitaryQualifications();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No militaryQualifications found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getmilitaryQualificationsByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await militaryQualificationsInfoRepository.findMilitaryQualificationsByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"militaryQualifications not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getmilitaryQualificationssByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await militaryQualificationsInfoRepository.findMilitaryQualificationsByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new MilitaryQualificationsInfoController()