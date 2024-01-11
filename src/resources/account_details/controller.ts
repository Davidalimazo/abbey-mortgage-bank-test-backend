import {Request, Response} from "express"
import AccountInfoRepository from "./repository"




class AccountInfoController{
    
    async upload(req:Request, res:Response){
    
       
        try {
            const data:any = await AccountInfoRepository.uploadRecords(req.body.accountDetailsData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                return res.status(200).json(`${data} Accounts uploaded successful`)
             }
           return res.status(400).json({error: "Accounts upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Account upload failed"}) 
        }
        
    }

    async getAllAccounts(req:Request, res:Response){
        try {
            const data:any = await AccountInfoRepository.findAllAccount();
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No account found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getAccountByPersonalNo(req:Request, res:Response){
        console.log(`'${req.params.id}'`)
       
        try {
             const data:any = await AccountInfoRepository.findUserBypersonalNo(`'${req.params.id}'`);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Account not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getAccountsByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await AccountInfoRepository.findAccountByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

}



export default new AccountInfoController()