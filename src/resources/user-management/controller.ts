import {Request, Response} from "express"
import userManagementRepository from "./repository"
import { saveAuditDetails } from "../../utils/constants";




class UserManagementController{
    
  
    async getAllTableName(req:any, res:Response){
  
        try {

            const userType = req?.locals?.USER_TYPE;
             const data:any = await userManagementRepository.getAllTableName();


             if(data?.errorNum){
               
                return res.status(400).json({error:data?.code})
             }else{
                if(userType !== "ADMIN"){
                    const tablesToExclude: string[] = ['AUDIT_TBL', 'USERS_TBL', 'USER_ROLES', 'ROLES'];
                    const filteredTables: string[] = data.filter((table:any) => !tablesToExclude.includes(table));
                   
                    return res.status(200).json({data:filteredTables})
                }else{

                    return res.status(200).json({data})
                }
               
             }
            
       
        } catch (error:any) {
           
            return res.status(500).json({error:error.message})
        }
    }

    async queryFinder(req:Request, res:Response){
  
        try {
             const data:any = await userManagementRepository.queryFinder(req.body);

             if(data?.errorNum){
               
                return res.status(400).json({error:data?.code})
             }
            
             return res.status(200).json({data})
       
        } catch (error:any) {
          
            return res.status(500).json({error:error.message})
        }
    }
    async findPersonnelByName(req:any, res:Response){
  
        try {
             const data:any = await userManagementRepository.findPersonnelByName(req.params.name?.toLowerCase(), req.locals?.PERSONNEL_NO);

             if(data?.errorNum){
            
                return res.status(400).json({error:data?.code})
             }

             return res.status(200).json({data})
       
        } catch (error:any) {
          
            return res.status(500).json({error:error.message})
        }
    }

    async findPersonnelByPhoneNumber(req:any, res:Response){
  
        try {
             const data:any = await userManagementRepository.findPersonnelByPhoneNumber(req.params.phoneNumber, req.locals?.PERSONNEL_NO);

             if(data?.errorNum){
              
                return res.status(400).json({error:data?.code})
             }
           
             return res.status(200).json({data})
       
        } catch (error:any) {
           
            return res.status(500).json({error:error.message})
        }
    }

    async findPersonnelAge(req:any, res:Response){
  
        try {
             const data:any = await userManagementRepository.findPersonnelAge(req.params.age);

             if(data?.errorNum){
              
                return res.status(400).json({error:data?.code})
             }
           
             return res.status(200).json({data})
       
        } catch (error:any) {
         
            return res.status(500).json({error:error.message})
        }
    }

    async findIndividualSearchData(req:Request, res:Response){
  
        try {
             const data:any = await userManagementRepository.findIndividualSearchData(req.body);

             if(data?.errorNum){
              
                return res.status(400).json({error:data?.code})
             }
           
             return res.status(200).json({data})
       
        } catch (error:any) {
         
            return res.status(500).json({error:error.message})
        }
    }

    async findPersonnelAgePaginated(req:any, res:Response){
  
        try {
             const data:any = await userManagementRepository.findPersonnelAgePaginated(req.body, req.locals?.PERSONNEL_NO);

             if(data?.errorNum){
              
                return res.status(400).json({error:data?.code})
             }
           
             return res.status(200).json({data})
       
        } catch (error:any) {
          
            return res.status(500).json({error:error.message})
        }
    }

    async findTableColumns(req:Request, res:Response){
  
        try {
             const data:any = await userManagementRepository.findTableColumns(req.params.columnName);

             if(data?.errorNum){
               
                return res.status(400).json({error:data?.code})
             }
            
             return res.status(200).json({data})
       
        } catch (error:any) {
          
            return res.status(500).json({error:error.message})
        }
    }

    async findPersonnelByNo(req:any, res:Response){
  
        try {
            if(req.body.query?.personnelNo === req.locals?.PERSONNEL_NO){
              
                return res.status(200).json({})
            }
             const data:any = await userManagementRepository.findPersonnelByNo(req.body.query);

             if(data?.errorNum){
               
                return res.status(400).json({error:data?.code})
             }
           
             return res.status(200).json({data})
       
        } catch (error:any) {
          
            return res.status(500).json({error:error.message})
        }
    }

    async queryRunner(req:any, res:Response){
  
        try {

             const data:any = await userManagementRepository.queryRunner(req.body.script);

             if(data?.errorNum){
               
                return res.status(400).json({error:data?.code})
             }
           
             return res.status(200).json({...data})
       
        } catch (error:any) {
          
            return res.status(500).json({error:error.message})
        }
    }

}



export default new UserManagementController()