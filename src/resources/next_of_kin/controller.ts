import {Request, Response} from "express"
import nextOfKinInfoRepository from "./repository"




class NextOfKinInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await nextOfKinInfoRepository.uploadRecords(req.body.nextOfKinDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} NextOfKins uploaded successful`)
             }
           return res.status(400).json({error: "NextOfKins upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"NextOfKin upload failed"}) 
        }
        
    }

    async getAllNextOfKins(req:Request, res:Response){
        try {
            const data:any = await nextOfKinInfoRepository.findAllNextOfKin();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No NextOfKin found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getNextOfKinByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await nextOfKinInfoRepository.findNextOfKinByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"NextOfKin not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getNextOfKinsByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await nextOfKinInfoRepository.findNextOfKinByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new NextOfKinInfoController()