import {Request, Response} from "express"
import spouseInfoRepository from "./repository"




class SpouseInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await spouseInfoRepository.uploadRecords(req.body.spouseDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`Spouses uploaded successful`)
             }
           return res.status(400).json({error: "Spouses upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Spouse upload failed"}) 
        }
        
    }

    async getAllSpouses(req:Request, res:Response){
        try {
            const data:any = await spouseInfoRepository.findAllSpouse();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Spouse found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getSpouseByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await spouseInfoRepository.findSpouseByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Spouse not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getSpousesByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await spouseInfoRepository.findSpouseByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new SpouseInfoController()