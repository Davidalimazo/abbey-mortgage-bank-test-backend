import {Request, Response} from "express"
import disciplinaryRecordsInfoRepository from "./repository"




class DisciplinaryRecordsInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await disciplinaryRecordsInfoRepository.uploadRecords(req.body.disciplinaryRecordsDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} DisciplinaryRecordss uploaded successful`)
             }
           return res.status(400).json({error: "DisciplinaryRecordss upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"DisciplinaryRecords upload failed"}) 
        }
        
    }

    async getAllDisciplinaryRecords(req:Request, res:Response){
        try {
            const data:any = await disciplinaryRecordsInfoRepository.findAllDisciplinaryRecords();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No DisciplinaryRecords found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getDisciplinaryRecordsByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await disciplinaryRecordsInfoRepository.findDisciplinaryRecordsByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"DisciplinaryRecords not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getDisciplinaryRecordssByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await disciplinaryRecordsInfoRepository.findDisciplinaryRecordsByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new DisciplinaryRecordsInfoController()