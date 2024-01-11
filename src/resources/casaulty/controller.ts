import {Request, Response} from "express"
import Casaulty from "./repository"




class CasaultyInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await Casaulty.uploadRecords(req.body.casaultyDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} Casaultys uploaded successful`)
             }
           return res.status(400).json({error: "Casaultys upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Casaulty upload failed"}) 
        }
        
    }

    async getAllCasaultys(req:Request, res:Response){
        try {
            const data:any = await Casaulty.findAllCasaulty();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Casaulty found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getCasaultyByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await Casaulty.findCasaultyByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Casaulty not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    // async getCasaultysByCriteria(req:Request, res:Response){
  
    //     try {
    //          const data:any = await Casaulty.findCasaultyByCriteria(req.body.criterion, req.body.data);

    //          if(data?.errorNum){
    //             return res.status(400).json({error:data?.code})
    //          }
    //          return res.status(200).json({data})
       
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }

}



export default new CasaultyInfoController()