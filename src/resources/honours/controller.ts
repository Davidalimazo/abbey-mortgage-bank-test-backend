import {Request, Response} from "express"
import honoursInfoRepository from "./repository"




class HonoursInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await honoursInfoRepository.uploadRecords(req.body.honoursDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} Honourss uploaded successful`)
             }
           return res.status(400).json({error: "Honourss upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Honours upload failed"}) 
        }
        
    }

    async getAllHonourss(req:Request, res:Response){
        try {
            const data:any = await honoursInfoRepository.findAllHonours();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Honours found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getHonoursByPersonalNo(req:Request, res:Response){
       
        try {
             const data:any = await honoursInfoRepository.findHonoursByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"Honours not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    // async getHonourssByCriteria(req:Request, res:Response){
  
    //     try {
    //          const data:any = await honoursInfoRepository.findHonoursByCriteria(req.body.criterion, req.body.data);

    //          if(data?.errorNum){
    //             return res.status(400).json({error:data?.code})
    //          }
    //          return res.status(200).json({data})
       
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }

}



export default new HonoursInfoController()