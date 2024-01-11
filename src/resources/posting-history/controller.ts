import {Request, Response} from "express"
import PostingInfoRepository from "./repository"




class PostingInfoController{
    
    async upload(req:Request, res:Response){
      
        try {
            const data:any = await PostingInfoRepository.uploadRecords(req.body.postingData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`Postings uploaded successful`)
             }
           return res.status(400).json({error: "Postings upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Posting upload failed"}) 
        }
        
    }

    async getAllPosting(req:Request, res:Response){
        try {
            const data:any = await PostingInfoRepository.findAllPosting();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No Posting found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getPostingByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await PostingInfoRepository.findPostingByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({data})
         }
         return res.status(400).json({error:"Posting not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async findCurrentPosting(req:Request, res:Response){
       
        try {
             const data:any = await PostingInfoRepository.findCurrentPosting(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Posting not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    // async getPostingsByCriteria(req:Request, res:Response){
  
    //     try {
    //          const data:any = await PostingInfoRepository.findPostingByCriteria(req.body.criterion, req.body.data);

    //          if(data?.errorNum){
    //             return res.status(400).json({error:data?.code})
    //          }
    //          return res.status(200).json({data})
       
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }

}



export default new PostingInfoController()