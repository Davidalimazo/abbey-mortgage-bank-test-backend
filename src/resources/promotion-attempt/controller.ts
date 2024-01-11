import {Request, Response} from "express"
import promotionAttemptInfoRepository from "./repository"




class PromotionAttemptInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await promotionAttemptInfoRepository.uploadRecords(req.body.promotionAttemptDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} PromotionAttempts uploaded successful`)
             }
           return res.status(400).json({error: "PromotionAttempts upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"PromotionAttempt upload failed"}) 
        }
        
    }

    async getAllPromotionAttempts(req:Request, res:Response){
        try {
            const data:any = await promotionAttemptInfoRepository.findAllPromotionAttempt();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No PromotionAttempt found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getPromotionAttemptByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await promotionAttemptInfoRepository.findPromotionAttemptByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"PromotionAttempt not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    // async getPromotionAttemptsByCriteria(req:Request, res:Response){
  
    //     try {
    //          const data:any = await promotionAttemptInfoRepository.findPromotionAttemptByCriteria(req.body.criterion, req.body.data);

    //          if(data?.errorNum){
    //             return res.status(400).json({error:data?.code})
    //          }
    //          return res.status(200).json({data})
       
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }

}



export default new PromotionAttemptInfoController()