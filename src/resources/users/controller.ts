import {Request, Response} from "express"
import bcrypt from "bcrypt";
import userRepository from "./repository"
import env from "../../utils/validateEnv";
import jwt from 'jsonwebtoken';
import { saveAuditDetails } from "../../utils/constants";


class UserController{
    async uploadUsersController(req:any, res:Response){
        const {users} = req.body;
        try {
            const data:any = await userRepository.uploadRecords(users, req.locals.PERSONNEL_NO);
            if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             await saveAuditDetails(req, res, 201, "Created Users", "USERS_TBL", "", "");

            return res.status(200).json("user creation successful")
            
        } catch (err) {
            return res.status(500).json({error:"user creation failed"}) 
        }
        
    }
   async createUser(req:any, res:Response){
        try {
         

          const user:any = await userRepository.findUserByEmail(req.body.email);

          if(user?.EMAIL){
            return  res.status(400).json({error:"user already exist"})
          }
          const data:any = await userRepository.createUser(req.body, req.locals.PERSONNEL_NO);
          if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
         
         await saveAuditDetails(req, res, 201, "Created User", "USERS_TBL", `${req.body.SURNAME} ${req.body.FIRST_NAME}`, `${req.body.PERSONNEL_NO}`);
          return  res.status(201).json("User created successfully")
           
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }
   async createUserRole(req:Request, res:Response){
        try {
         

          const data:any = await userRepository.createUserRole();

          if(data?.errorNum){
            return res.status(400).json({error:data?.code})
         }
          return  res.status(201).json("Role created successfully")
           
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getAllUsers(req:Request, res:Response){
        try {
            const data:any = await userRepository.findAllUsers();
            if(data?.errorNum){
             
                return res.status(400).json({error:data?.code})
             }
          
        return res.status(200).json(data)
        } catch (error:any) {
         
            return res.status(500).json({error:error.message})
        }
    }

    async getUserByEmail(req:Request, res:Response){
       
        try {
             const data:any = await userRepository.findUserByEmail(req.params.email);
      
        if(data?.errorNum){
        
            return res.status(400).json({error:data?.code})
         }
        
         return res.status(200).json({data})
        } catch (error:any) {
         
            return res.status(500).json({error:error.message})
        }
    }

    async changeUserPassword(req:Request, res:Response){
     const {userId, passwords} = req.body;
        try {
            const user:any = await userRepository.findUserByUserId(req.body.userId);
            if(user?.errorNum){
                return res.status(400).json({error:user?.code})
             }

           
              if(user?.EMAIL.length > 0){
                
                const salt = await bcrypt.genSalt(10);
                if(!user?.HAS_CHANGED_PASSWORD){
                  if(user.USER_PASSWORD === passwords.temp){
                    const hash = await bcrypt.hash(passwords.new, salt);
                          
                    const result:any = await userRepository.updatePassword(hash, userId);
        
                    if(result?.errorNum){
                        return res.status(400).json({error:result?.code})
                     }
                     await saveAuditDetails(req, res, 200, "Updated Password", "USER_PASSWORD", `${user?.SURNAME} ${user?.FIRST_NAME}`, `${user?.PERSONNEL_NO}`);
                     return res.status(200).json("Password changed successfully")
      
                  }else{
                    return res.status(400).json({error:"Password do not match"})
                  }
                }else{
               
                  const compare = await bcrypt.compare(passwords.temp, user.USER_PASSWORD)
                  if(compare){
                    const hash = await bcrypt.hash(passwords.new, salt);
                  
                    const result:any = await userRepository.updatePassword(hash, userId);
        
                    if(result?.errorNum){
                        return res.status(400).json({error:result?.code})
                     }
                     await saveAuditDetails(req, res, 200, "Updated Password", "USER_PASSWORD", `${user?.SURNAME} ${user?.FIRST_NAME}`, `${user?.PERSONNEL_NO}`);
                     return res.status(200).json("Password changed successfully")
    
                  }
       
                  return res.status(400).json({error:"Password do not match"})
                }
              }else{
         
                return res.status(400).json({error:"Account not found"})
              }
              
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }
    async getUserById(req:Request, res:Response){
       
        try {
             const data:any = await userRepository.findUserByUserId(req.params.id);
             if(data?.errorNum){
             
                return res.status(400).json({error:data?.code})
             }
           
             return res.status(200).json({data})
        } catch (error:any) {
         
            return res.status(500).json({error:error.message})
        }
    }

    async deleteUser(req:any, res:Response){
       
        try {
          if(req.body.personnel_no === req.locals.PERSONNEL_NO){
            await saveAuditDetails(req, res, 400, "Delete User", "USERS_TBL", `${req.locals.SURNAME} ${req.locals?.FIRST_NAME}`, `${req.locals.PERSONNEL_NO}`);
            return res.status(400).json("You can not delete yourself")
          }
             const user:any = await userRepository.findUserByPersonalNo(req.body.personnel_no);
             const data:any = await userRepository.deleteUser(req.body.personnel_no);
             if(data?.errorNum){
              await saveAuditDetails(req, res, 400, "Delete User", "USERS_TBL", `${user?.SURNAME} ${user?.FIRST_NAME}`, `${user?.PERSONNEL_NO}`);
                return res.status(400).json({error:data?.code})
             }
             await saveAuditDetails(req, res, 200, "Delete User", "USERS_TBL", `${user?.SURNAME} ${user?.FIRST_NAME}`, `${user?.PERSONNEL_NO}`);
             return res.status(200).json({data})
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async changeUserStatus(req:any, res:Response){
       
        try {
          if(req.body.personnel_no === req.locals.PERSONNEL_NO){
            await saveAuditDetails(req, res, 400, "Change Status", "STATUS", `${req.locals.SURNAME} ${req.locals?.FIRST_NAME}`, `${req.locals.PERSONNEL_NO}`);
            return res.status(400).json({error:"You can not change your status"})
          }
             const data:any = await userRepository.changeUserStatus(req.body.personnel_no, req.body.status);

             if(data?.errorNum){
                return res.status(400).json({error:data?.code})
             }
             const user:any = await userRepository.findUserByPersonalNo(req.body.personnel_no);
             await saveAuditDetails(req, res, 200, "Change Status", "STATUS", `${user?.SURNAME} ${user?.FIRST_NAME}`, `${user?.PERSONNEL_NO}`);
             return res.status(200).json("Status changed successfully")
        } catch (error:any) {
            return res.status(500).json({error:error.message})
        }
    }

    async getUsersByCriteria(req:Request, res:Response){
  
        try {
             const data:any = await userRepository.findUserByCriterial(req.body.criterion, req.body.data);

             if(data?.errorNum){
            
                return res.status(400).json({error:data?.code})
             }
           
             return res.status(200).json({data})
       
        } catch (error:any) {
        
            return res.status(500).json({error:error.message})
        }
    }

    async changeEmail(req:Request, res:Response){
  
        try {
             const data:any = await userRepository.changeEmail(req.body.email, req.body.userId);

             if(data?.errorNum){
            
                return res.status(400).json({error:data?.code})
             }
           
             return res.status(200).json({data})
       
        } catch (error:any) {
        
            return res.status(500).json({error:error.message})
        }
    }

    async login(req:any, res:Response){
        const {email, password} = req.body;

        try {
            const user:any = await userRepository.findUserByEmail(email);

            if(user?.errorNum){
                return res.status(400).json({error:"User not found"})
             }

            else if(user?.STATUS === 0){
              return res.status(400).json({error:"User account disabled, contact admin"})
             }
           else if(user?.USER_ID){
                const {USER_PASSWORD, ...rest} = user;
          
                if(user.HAS_CHANGED_PASSWORD){
               const compare = await bcrypt.compare(password, user.USER_PASSWORD);
                
                  if(compare){
                    const token = jwt.sign({ ...rest }, env.JWT_SECRET, { expiresIn: '2h' });
                    req.locals = {...rest}
              
                    return res.status(200).json({token, user:rest})
                  }
                  req.locals = {EMAIL:email}
                 
                  return res.status(400).json({error:"Password do not match"})
            
                }else{
                  if(password === user.USER_PASSWORD){
                   
                    const token = jwt.sign({ ...rest }, env.JWT_SECRET, { expiresIn: '2h' });
                    req.locals = {...rest}
              
                    return res.status(200).json({token, user:rest})
                  }
                  req.locals = {EMAIL:email}
                
                  return res.status(400).json({error:"Password do not match"})
                }
              
              }else{
                req.locals = {EMAIL:email}
               
                return  res.status(400).json({error: "invalid email and password"})
              }
             
        
        } catch (error:any) {
          req.locals = {EMAIL:email}
         
            return res.status(500).json({error:error.message})
        }
    }
}



export default new UserController()