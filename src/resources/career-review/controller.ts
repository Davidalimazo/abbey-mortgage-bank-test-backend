import {Request, Response} from "express"
import careerReviewInfoRepository from "./repository"




class CareerReviewInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await careerReviewInfoRepository.uploadRecords(req.body.careerReviewDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} Career reviews uploaded successful`)
             }
           return res.status(400).json({error: "Career reviews upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Career review upload failed"}) 
        }
        
    }

    async getAllCareerReviews(req:Request, res:Response){
        try {
            const data:any = await careerReviewInfoRepository.findAllCareerReview();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No CareerReview found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getCareerReviewByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await careerReviewInfoRepository.findCareerReviewByPersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"CareerReview not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getCareerReviewsByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await careerReviewInfoRepository.findCareerReviewByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new CareerReviewInfoController()