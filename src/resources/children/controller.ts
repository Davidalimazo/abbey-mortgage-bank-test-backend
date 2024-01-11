import {Request, Response} from "express"
import childrenInfoRepository from "./repository"




class ChildrenInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await childrenInfoRepository.uploadRecords(req.body.childrenDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`Childrens uploaded successful`)
             }
           return res.status(400).json({error: "Childrens upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Children upload failed"}) 
        }
        
    }

    async getAllChildren(req:Request, res:Response){
        try {
            const data:any = await childrenInfoRepository.findAllChildren();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Children found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getChildrenByPersonalNo(req:Request, res:Response){
       
        try {
             const data:any = await childrenInfoRepository.findChildrenByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"Children not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getChildrensByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await childrenInfoRepository.findChildrenByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new ChildrenInfoController()