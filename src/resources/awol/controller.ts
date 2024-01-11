import {Request, Response} from "express"
import AwolInfoRepository from "./repository"




class AwolInfoController{
    
    async upload(req:Request, res:Response){
      
        try {
            const data:any = await AwolInfoRepository.uploadRecords(req.body.awolDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`Awols uploaded successful`)
             }
           return res.status(400).json({error: "Awols upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Awol upload failed"}) 
        }
        
    }

    async getAllAwol(req:Request, res:Response){
        try {
            const data:any = await AwolInfoRepository.findAllAwol();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Awol found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async findAwolCountInGPZ(req:Request, res:Response){
        try {
            const data:any = await AwolInfoRepository.findAwolCountInGPZ();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data})
             }
             return res.status(400).json({error:"No Awol found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getAwolByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await AwolInfoRepository.findAwolByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"Awol not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getAwolsByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await AwolInfoRepository.findAwolByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new AwolInfoController()