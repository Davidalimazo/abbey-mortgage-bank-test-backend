import {Request, Response} from "express"
import careerInfoRepository from "./repository"




class CareerInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await careerInfoRepository.uploadRecords(req.body.careerDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} Careers uploaded successful`)
             }
           return res.status(400).json({error: "Careers upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Career upload failed"}) 
        }
        
    }

    async getAllCareers(req:Request, res:Response){
        try {
            const data:any = await careerInfoRepository.findAllCareer();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Career found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getCareerByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await careerInfoRepository.findCareerByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Career not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getCareersByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await careerInfoRepository.findCareerByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new CareerInfoController()