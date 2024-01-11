import {Request, Response} from "express"
import personalInfoRepository from "./repository"
import { saveAuditDetails } from "../../utils/constants";




class PersonalInfoController{
    async uploadPersonnels(req:any, res:Response){
    
       
        try {
            const data:any = await personalInfoRepository.uploadPersonnel(req.body.personalDetailData, req.locals?.PERSONNEL_NO);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                await saveAuditDetails(req, res, 201, "Created Personnel", "PERSONAL_INFO", "", "");
                return res.status(200).json("Personnels uploaded successful")
             }
           return res.status(400).json({error: "Personnels upload failed"})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({error:"Personnel upload failed"}) 
        }
        
    }
    async uploadManyPersonnels(req:Request, res:Response){   
       
        try {
            const data:any = await personalInfoRepository.uploadRecords(req.body.personalDetailData);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "number"){
                await saveAuditDetails(req, res, 201, "Created Personnel", "PERSONAL_INFO", "", "");
                return res.status(200).json(`${data} Personnels uploaded successful`)
             }
           return res.status(400).json({error: "Personnels upload failed"})
            
        } catch (err) {
            return res.status(500).json({error:"Personnel upload failed"}) 
        }
        
    }

    async getActiveAndNonActivePersonnelCount(req:Request, res:Response){
    
       
        try {
            const data:any = await personalInfoRepository.getActiveAndNonActivePersonnelCount();
            if(data?.errorNum){
               
                return res.status(400).json({error:data?.code})
             }
             if(typeof data === "object"){
              
                return res.status(200).json({data})
             }
           
           return res.status(400).json({error: "Personnels upload failed"})
            
        } catch (err) {
            console.log(err)
           
            return res.status(500).json({error:"Personnel upload failed"}) 
        }
        
    }
//    async createPersonnel(req:Request, res:Response){
//         try {
         
//           const personnel:any = await personalInfoRepository.findUserByPersonalNo(req.body.PERSONNEL_NO);


//           if(personnel?.FIRST_NAME){
//             return  res.status(400).json({error:"Personnel already exist"})
//           }
//           const data:any = await personalInfoRepository.createPersonalDetails(req.body);
//           console.log(data)
//           if(data?.errorNum){
//             return res.status(400).json({error:data?.code})
//          }
//           return  res.status(201).json("Personnel created successfully")
           
//         } catch (error:any) {
//             return res.status(500).json({error:error.message})
//         }
//     }

    async getAllPersonnels(req:any, res:Response){
        try {
            const data:any = await personalInfoRepository.findAllPersonnel(req.locals.PERSONNEL_NO);
            if(data?.errorNum){
               
                return res.status(400).json({error:data?.code})
             }
             if(data){
               
                return res.status(200).json({data:[...data]})
             }
            
             return res.status(400).json({error:"No personnel found"})
        } catch (error:any) {
           
            return res.status(500).json({error:error.message})
        }
    }
    async getAllPersonelMgntData(req:any, res:Response){
        try {
            const data:any = await personalInfoRepository.getAllPersonelMgntData(req.locals?.PERSONNEL_NO);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             if(data){
                return res.status(200).json({data:[...data]})
             }
             return res.status(400).json({error:"No personnel found"})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getPersonnelByPersonalNo(req:any, res:Response){
   
        try {
             const data:any = await personalInfoRepository.findUserByPersonalNo(req.params.id, req.locals.PERSONNEL_NO);
      
        if(data?.errorNum){
           
            return res.status(400).json({error:data?.code})
         }
         if(data){
           
            return res.status(200).json({...data})
         }
        
         return res.status(400).json({error:"Personnel not found"})
        
        } catch (error:any) {
          
            return res.status(500).json({error:error.message})
        }
    }


    async getPersonnelSpecificPersonalInfo(req:any, res:Response){
   
        try {
             const data:any = await personalInfoRepository.getPersonnelSpecificPersonalInfo(req.params.id, req.locals?.PERSONNEL_NO);
      
        if(data?.errorNum){
          
            return res.status(400).json({error:data?.code})
         }
         if(data){
          
            return res.status(200).json({...data})
         }
        
         return res.status(400).json({error:"Personnel not found"})
        
        } catch (error:any) {
           
            return res.status(500).json({error:error.message})
        }
    }

    async getPersonnelCVData(req:any, res:Response){
   
        try {
             const data:any = await personalInfoRepository.getPersonnelCVData(`'${req.params.id}'`, req.locals?.PERSONNEL_NO);
      
        if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         if(data){
            return res.status(200).json({...data})
         }
         return res.status(400).json({error:"Personnel not found"})
        
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    // async changePersonnelPassword(req:Request, res:Response){
    //  const {PersonnelId, passwords} = req.body;
    //     try {
    //         const Personnel:any = await personalInfoRepository.findPersonnelByPersonnelId(req.body.PersonnelId);
    //         if(Personnel?.errorNum){
    //             return res.status(400).json({error:Personnel?.code})
    //          }

           
    //           if(Personnel?.EMAIL.length > 0){
                
    //             const salt = await bcrypt.genSalt(10);
    //             if(!Personnel?.HAS_CHANGED_PASSWORD){
    //               if(Personnel.Personnel_PASSWORD === passwords.temp){
    //                 const hash = await bcrypt.hash(passwords.new, salt);
                          
    //                 const result:any = await personalInfoRepository.updatePassword(hash, PersonnelId);
        
    //                 if(result?.errorNum){
    //                     return res.status(400).json({error:result?.code})
    //                  }
    //                  return res.status(200).json("Password changed successfully")
      
    //               }else{
    //                 return res.status(400).json({error:"Password do not match"})
    //               }
    //             }else{
               
    //               const compare = await bcrypt.compare(passwords.temp, Personnel.Personnel_PASSWORD)
    //               if(compare){
    //                 const hash = await bcrypt.hash(passwords.new, salt);

    //                 console.log(hash, PersonnelId)
                  
    //                 const result:any = await personalInfoRepository.updatePassword(hash, PersonnelId);
        
    //                 if(result?.errorNum){
    //                     return res.status(400).json({error:result?.code})
    //                  }
    //                  return res.status(200).json("Password changed successfully")
    
    //               }
    //               return res.status(400).json({error:"Password do not match"})
    //             }
    //           }else{
    //             return res.status(400).json({error:"Account not found"})
    //           }
              
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }
    // async getPersonnelById(req:Request, res:Response){
       
    //     try {
    //          const data:any = await personalInfoRepository.findPersonnelByPersonnelId(req.params.id);
    //          if(data?.errorNum){
    //             return res.status(400).json({error:data?.code})
    //          }
    //          return res.status(200).json({data})
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }
    async getPersonnelsByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await personalInfoRepository.findPersonnelByCriteria(req.body.criterion, req.body.data);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             return res.status(200).json({data})
       
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    // async login(req:Request, res:Response){
    //     const {email, password} = req.body;

    //     try {
    //         const Personnel:any = await personalInfoRepository.findPersonnelByEmail(email);

    //         if(Personnel?.errorNum){
    //             return res.status(400).json({error:"Personnel not found"})
    //          }

    //         if(Personnel?.Personnel_ID){
    //             const {Personnel_PASSWORD, ...rest} = Personnel;
          
    //             if(Personnel.HAS_CHANGED_PASSWORD){
    //            const compare = await bcrypt.compare(password, Personnel.Personnel_PASSWORD);
                
    //               if(compare){
    //                 const token = jwt.sign({ ...rest }, env.JWT_SECRET, { expiresIn: '1h' });
    //                 return res.status(200).json({token})
    //               }
    //               return res.status(400).json({error:"Password do not match"})
            
    //             }else{
    //               if(password === Personnel.Personnel_PASSWORD){
                   
    //                 const token = jwt.sign({ ...rest }, env.JWT_SECRET, { expiresIn: '1h' });
    //                 return res.status(200).json({token})
    //               }
    //               return res.status(400).json({error:"Password do not match"})
    //             }
              
    //           }else{
    //             return  res.status(400).json({error: "invalid email and password"})
    //           }
             
        
    //     } catch (error:any) {
    //         return res.status(500).json({error:error.message})
    //     }
    // }
}



export default new PersonalInfoController()