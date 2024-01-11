import {Request, Response} from "express"
import languageInfoRepository from "./repository"




class LanguageInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await languageInfoRepository.uploadRecords(req.body.languageDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} Languages uploaded successful`)
             }
           return res.status(400).json({error: "Languages upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Language upload failed"}) 
        }
        
    }

    async getAllLanguages(req:Request, res:Response){
        try {
            const data:any = await languageInfoRepository.findAllLanguage();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Language found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getLanguageByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await languageInfoRepository.findLanguageByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Language not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    // async getLanguagesByCriteria(req:Request, res:Response){
  
    //     try {
    //          const data:any = await languageInfoRepository.findLanguageByCriteria(req.body.criterion, req.body.data);

    //          if(data?.errorNum){
    //             return res.status(400).json({error:data?.code})
    //          }
    //          return res.status(200).json({data})
       
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }

}



export default new LanguageInfoController()