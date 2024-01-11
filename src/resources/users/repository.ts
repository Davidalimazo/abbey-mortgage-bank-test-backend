import { connectToDB } from "../../database/connecttodb";
import { CriteriaSearchEnum, UsersType } from "./interface";
import OracleDB from "oracledb"
import {v4 as uuid} from "uuid"

const CHUNK_SIZE = 100;


class UsersRepository{

  async uploadRecords(usersDTO:UsersType[], CREATED_BY:string){
    let connection =  await connectToDB();

try {

  let rows;

  const sql =`INSERT INTO USERS_TBL (FIRST_NAME, SURNAME, USER_ROLE, USER_TYPE, PHONE_NUMBER, USER_PASSWORD, EMAIL, USER_ID, PERSONNEL_NO, STATUS, CREATED_BY) VALUES (:FIRST_NAME, :SURNAME, :USER_ROLE, :USER_TYPE, :PHONE_NUMBER, :USER_PASSWORD, :EMAIL, :USER_ID, :PERSONNEL_NO, :STATUS, :CREATED_BY)`;

  // Divide data into chunks
  for (let i = 0; i < usersDTO.length; i += CHUNK_SIZE) {

    const chunk = usersDTO.slice(i, i + CHUNK_SIZE).map(item=>{
      return {
        PERSONNEL_NO: item["personnelNo"],
        FIRST_NAME: item["firstName"],
        SURNAME: item["surname"],
        USER_ROLE: item["role"],
        USER_TYPE: item["userType"],
        PHONE_NUMBER: item["phoneNumber"],
        EMAIL: item["email"],
        STATUS: Number(item["status"]),
        USER_ID: uuid(),
        USER_PASSWORD: uuid().slice(0, 7) + "A@2",
        CREATED_BY
      }
    });

    try {
      const options = {
        autoCommit: true,
        bindDefs: {
          PERSONNEL_NO: { type: OracleDB.STRING, maxSize:15 },
          FIRST_NAME: { type: OracleDB.STRING, maxSize:50 },
          SURNAME: { type: OracleDB.STRING, maxSize:50 },
          USER_ROLE: { type: OracleDB.STRING, maxSize:20 },
          STATUS: { type: OracleDB.NUMBER },
          USER_TYPE: { type: OracleDB.STRING, maxSize:15 },
          PHONE_NUMBER: { type: OracleDB.STRING, maxSize:20 },
          EMAIL:  { type: OracleDB.STRING, maxSize:70 },
          USER_ID: { type: OracleDB.STRING, maxSize:70 },
          USER_PASSWORD: { type: OracleDB.STRING, maxSize:200 },
          CREATED_BY: { type: OracleDB.STRING, maxSize:50 },
        }
      };
  
      let result:any = await connection.executeMany(sql, chunk, options);
      rows += result.rowsAffected;
    } catch (error:any) {
       // Handle unique constraint violation error (e.g., unique key already exists)
  if (error && error.errorNum === 1) {
    console.error('Unique constraint violation occurred:', error.message);
    // You can log or handle this error as needed
    // For example, skip the rows causing the violation and continue

    continue;
  } else {
    console.error('Error:', error.message);
    // Handle other types of errors as needed
    return error.message;
  }
}
  
  }
  return rows;
} catch (error:any) {
 return error.message;
} finally {
  if (connection) {
    try {
      await connection.close();
    } catch (error:any) {
      console.error('Error closing connection:', error.message);
    }
  }
}
  }

    async uploadUsers(usersDTO:UsersType[]){

          let connection =  await connectToDB();

          try {
        
            for (const item of usersDTO) {
              const {firstName, surname, role, userType, phoneNumber, email,  } = item;
              const sql = `INSERT INTO USERS_TBL (FIRST_NAME, SURNAME, USER_ROLE, USER_TYPE, PHONE_NUMBER, USER_PASSWORD, EMAIL, USER_ID, PERSONNEL_NO) VALUES (:FIRST_NAME, :SURNAME, :USER_ROLE, :USER_TYPE, :PHONE_NUMBER, :USER_PASSWORD, :EMAIL, :USER_ID, :PERSONNEL_NO)`;
              
              const result = await connection.execute(sql, {FIRST_NAME: firstName, SURNAME:surname, USER_ROLE:role, USER_TYPE:userType, PHONE_NUMBER: phoneNumber, USER_PASSWORD: uuid().slice(0, 7) + "A@2", EMAIL:email,  USER_ID:uuid()}, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });
              console.log(`Inserted: ${surname} - ${firstName}`);
            }
            return "success";
          } catch (err) {
            console.error('Error occurred:', err);
            return err;
          } finally {
            if (connection) {
              try {
                await connection.close();
              } catch (err) {
                console.error('Error closing connection:', err);
              }
            }
          }
    }

    async createUser(usersDTO:UsersType, CREATED_BY:string){

        let connection =  await connectToDB();

    try {
        
        const {firstName, surname, role, userType, phoneNumber, email , userId, personnelNo } = usersDTO;
        const sql = `INSERT INTO USERS_TBL (FIRST_NAME, SURNAME, USER_ROLE, USER_TYPE, PHONE_NUMBER, USER_PASSWORD, EMAIL, USER_ID, PERSONNEL_NO, CREATED_BY) VALUES (:FIRST_NAME, :SURNAME, :USER_ROLE, :USER_TYPE, :PHONE_NUMBER, :USER_PASSWORD, :EMAIL, :USER_ID, :PERSONNEL_NO, :CREATED_BY)`;
        
        const result = await connection.execute(sql, {FIRST_NAME: firstName, SURNAME:surname, USER_ROLE:role, USER_TYPE:userType, PHONE_NUMBER: phoneNumber, USER_PASSWORD: uuid().slice(0, 7) + "A@2", EMAIL:email,  USER_ID:uuid(), PERSONNEL_NO:personnelNo, CREATED_BY}, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });
        console.log(`Inserted: ${surname} - ${firstName}`);
        return result.rows
    } catch (err) {
        console.error('Error occurred:', err);
        return err;
    } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
      }
    }

    async createUserRole(){

        let connection =  await connectToDB();

    try {    

        const sql = `INSERT INTO user_roles (personnel_no, role_id)
        VALUES ('N/10956', 1)`;
        
        const result = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });

        return result.rows
    } catch (err) {
        console.error('Error occurred:', err);
        return err;
    } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
      }
    }

    async findUserByEmail(email:string){
        let connection =  await connectToDB();
        
        try {
            const sql = `SELECT * FROM users_tbl WHERE email = :1`;
            const result:any = await connection.execute(sql,[email], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
            
            const data = result.rows[0];

            if(data){
              let update = `UPDATE users_tbl
              SET last_seen = CURRENT_TIMESTAMP
              WHERE email = '${email}'`;
             await connection.execute(update,[], {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });
            return data
            }
      
            return null;
        } catch (error) {
            console.log(error);
            return error;
        } finally{
            if (connection) {
                try {
                  await connection.close();
                } catch (err) {
                  console.error('Error closing connection:', err);
                }
              }
        }
}

async findUserByUserId(userId:string){
    let connection =  await connectToDB();
    
    try {
        const sql = `SELECT * FROM users_tbl WHERE user_id = :1`;
        const result:any = await connection.execute(sql,[userId], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
       
        return result.rows[0];
        
    } catch (error) {
        console.log(error);
        return error;
    } finally{
        if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error('Error closing connection:', err);
            }
          }
    }
}

async changeEmail(email:string, userId:string){
  let connection =  await connectToDB();
  
  try {
      const sql = `UPDATE USERS_TBL SET EMAIL='${email}' WHERE USER_ID='${userId}'`;
      const result:any = await connection.execute(sql,[], {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });
     
      return result.rowsAffected;
      
  } catch (error) {
      console.log(error);
      return error;
  } finally{
      if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
  }
}

async findUserByPersonalNo(personalNo:string){
  let connection =  await connectToDB();
  
  try {

      const sql = `SELECT * FROM USERS_TBL WHERE PERSONNEL_NO = '${personalNo}'`;
      const result:any = await connection.execute(sql, {}, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });
      
      const data = result.rows[0];

      if(data){

      return data
      }

      return null;
      
  } catch (error) {
      console.log(error);
      return error;
  } finally{
      if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
  }
}

async findUserByPersonnelNo(userId:string){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM users_tbl WHERE user_id = :1`;
      const result:any = await connection.execute(sql,[userId], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
     
      return result.rows[0];
      
  } catch (error) {
      console.log(error);
      return error;
  } finally{
      if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
  }
}

async findUserByCriterial(criteria:CriteriaSearchEnum, data:string){
  let connection =  await connectToDB();

  
  try {
      const sql = `SELECT * FROM users_tbl WHERE ${CriteriaSearchEnum[criteria]} = :1`;
      const result:any = await connection.execute(sql,[data], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
    
      return result.rows[0];
      
  } catch (error) {
      console.log(error);
      return error;
  } finally{
      if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
  }
}

async updatePassword(hash:string, userId:string){
  let connection =  await connectToDB();
  
  try {
    const sql = `UPDATE users_tbl SET user_password = :1, has_changed_password = :2 WHERE user_id = :3`;
    const result: any = await connection.execute(sql, [hash, 1, userId], {autoCommit: true, outFormat: OracleDB.OUT_FORMAT_OBJECT});

    return result;
      
  } catch (error) {
      console.log(error);
      return error;
  } finally{
      if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
  }
}

async changeUserStatus(personnel_no:string, status:number){
  let connection =  await connectToDB();
  
  try {
    const sql = `UPDATE users_tbl
    SET status = ${status}
    WHERE personnel_no = '${personnel_no}'`;
    const result: any = await connection.execute(sql, [], {autoCommit: true, outFormat: OracleDB.OUT_FORMAT_OBJECT});

    return result;
      
  } catch (error) {
      console.log(error);
      return error;
  } finally{
      if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
  }
}


async deleteUser(personnel_no:string){
  let connection =  await connectToDB();
  
  try {
    const sql = `delete from users_tbl where personnel_no='${personnel_no}'`;
    const result: any = await connection.execute(sql, [], {autoCommit: true, outFormat: OracleDB.OUT_FORMAT_OBJECT});

    return result;
      
  } catch (error) {
      console.log(error);
      return error;
  } finally{
      if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
  }
}


async findAllUsers(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM users_tbl`;
      const result:any = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
      return result.rows;
      
  } catch (error) {
      console.log(error);
      return error;
  } finally{
      if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
  }
}
}

export default new UsersRepository()