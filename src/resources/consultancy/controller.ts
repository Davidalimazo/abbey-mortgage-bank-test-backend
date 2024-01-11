import {Request, Response} from "express"
import consultancyInfoRepository from "./repository"




class ConsultancyInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await consultancyInfoRepository.uploadRecords(req.body.consultancyDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} Consultancys uploaded successful`)
             }
           return res.status(400).json({error: "Consultancys upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Consultancy upload failed"}) 
        }
        
    }

    async getAllConsultancy(req:Request, res:Response){
        try {
            const data:any = await consultancyInfoRepository.findAllConsultancy();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Consultancy found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getConsultancyByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await consultancyInfoRepository.findConsultancyByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"Consultancy not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    // async getConsultancysByCriteria(req:Request, res:Response){
  
    //     try {
    //          const data:any = await consultancyInfoRepository.findConsultancyByCriteria(req.body.criterion, req.body.data);

    //          if(data?.errorNum){
    //             return res.status(400).json({error:data?.code})
    //          }
    //          return res.status(200).json({data})
       
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }

}



export default new ConsultancyInfoController()