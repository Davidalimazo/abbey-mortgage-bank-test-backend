import {Request, Response} from "express"
import PromotionRepository from "./repository"




class PromotionController{
    
    async upload(req:Request, res:Response){
       
        try {
            const data:any = await PromotionRepository.uploadRecords(req.body.promotionHistoryDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`Promotion uploaded successful`)
             }
           return res.status(400).json({error: "Promotion upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Promotion upload failed"}) 
        }
        
    }

    async findFirstPromotionDetails(req:Request, res:Response){
        try {
            const data:any = await PromotionRepository.findFirstPromotionDetails(req.params.id);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data})
             }
             return res.status(400).json({error:"No Posting found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getAllPromotionHistory(req:Request, res:Response){
        try {
            const data:any = await PromotionRepository.findAllPromotionHistory();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Promotion found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getPromotionHistoryByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await PromotionRepository.findPromotionHistoryByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Promotion not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getPromotionHistorysByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await PromotionRepository.findPromotionHistoryByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new PromotionController()