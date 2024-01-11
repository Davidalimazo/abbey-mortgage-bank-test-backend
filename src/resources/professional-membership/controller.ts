import {Request, Response} from "express"
import promembershipInfoRepository from "./repository"




class PromembershipInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await promembershipInfoRepository.uploadRecords(req.body.promembershipDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`Promemberships uploaded successful`)
             }
           return res.status(400).json({error: "Promemberships upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Promembership upload failed"}) 
        }
        
    }

    async getAllPromembership(req:Request, res:Response){
        try {
            const data:any = await promembershipInfoRepository.findAllPromembership();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data})
             }
             return res.status(400).json({error:"No Promembership found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getPromembershipByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await promembershipInfoRepository.findPromembershipByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"Promembership not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getPromembershipsByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await promembershipInfoRepository.findPromembershipByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new PromembershipInfoController()