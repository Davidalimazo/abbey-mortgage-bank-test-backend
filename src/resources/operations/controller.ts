import {Request, Response} from "express"
import operationsInfoRepository from "./repository"




class OperationsInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await operationsInfoRepository.uploadRecords(req.body.operationsDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} Operationss uploaded successful`)
             }
           return res.status(400).json({error: "Operationss upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Operations upload failed"}) 
        }
        
    }

    async getAllOperationss(req:Request, res:Response){
        try {
            const data:any = await operationsInfoRepository.findAllOperations();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Operations found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getOperationsByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await operationsInfoRepository.findOperationsByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"Operations not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    // async getOperationssByCriteria(req:Request, res:Response){
  
    //     try {
    //          const data:any = await operationsInfoRepository.findOperationsByCriteria(req.body.criterion, req.body.data);

    //          if(data?.errorNum){
    //             return res.status(400).json({error:data?.code})
    //          }
    //          return res.status(200).json({data})
       
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }

}



export default new OperationsInfoController()