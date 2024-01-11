import {Request, Response} from "express"
import terminationInfoRepository from "./repository"




class TerminationInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await terminationInfoRepository.uploadRecords(req.body.terminationDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`Terminations uploaded successful`)
             }
           return res.status(400).json({error: "Terminations upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Termination upload failed"}) 
        }
        
    }

    async getAllTermination(req:Request, res:Response){
        try {
            const data:any = await terminationInfoRepository.findAllTermination();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Termination found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getTerminationByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await terminationInfoRepository.findTerminationByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Termination not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getTerminationsByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await terminationInfoRepository.findTerminationByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new TerminationInfoController()