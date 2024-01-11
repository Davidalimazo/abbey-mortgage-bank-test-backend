import {Request, Response} from "express"
import promotionHistoryInfoRepository from "./repository"




class PromotionHistoryInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await promotionHistoryInfoRepository.uploadRecords(req.body.promotionHistoryDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`Promotion History uploaded successful`)
             }
           return res.status(400).json({error: "Promotion History upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Promotion History upload failed"}) 
        }
        
    }

    async findFirstPromotionDetails(req:Request, res:Response){
        try {
            const data:any = await promotionHistoryInfoRepository.findFirstPromotionDetails(req.params.id);
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
            const data:any = await promotionHistoryInfoRepository.findAllPromotionHistory();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No PromotionHistory found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getPromotionHistoryByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await promotionHistoryInfoRepository.findPromotionHistoryByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"PromotionHistory not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getPromotionHistorysByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await promotionHistoryInfoRepository.findPromotionHistoryByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new PromotionHistoryInfoController()