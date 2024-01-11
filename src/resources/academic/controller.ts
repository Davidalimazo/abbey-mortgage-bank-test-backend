import {Request, Response} from "express"
import academicInfoRepository from "./repository"




class AcademicInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await academicInfoRepository.uploadRecords(req.body.academicDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`Academics uploaded successful`)
             }
           return res.status(400).json({error: "Academics upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Academic upload failed"}) 
        }
        
    }

    async getAllAcademic(req:Request, res:Response){
        try {
            const data:any = await academicInfoRepository.findAllAcademic();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data})
             }
             return res.status(400).json({error:"No Academic found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getAcademicByPersonalNo(req:Request, res:Response){
       
        try {
             const data:any = await academicInfoRepository.findAcademicByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"Academic not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getAcademicsByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await academicInfoRepository.findAcademicByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new AcademicInfoController()