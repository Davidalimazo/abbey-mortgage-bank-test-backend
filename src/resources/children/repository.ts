import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  ChildrenType } from "../personnel/interface";
import { ChildrenSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class ChildrenInfoRepository{

    async uploadRecords(childrenDetailsData:ChildrenType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO CHILDREN (
      PERSONNEL_NO,
      FIRST_NAME,
      SEX,
      DATE_OF_BIRTH,
      REMARKS) VALUES ( 
        :PERSONNEL_NO,
        :FIRST_NAME,
        :SEX,
        :DATE_OF_BIRTH,
        :REMARKS)`;

    // Divide data into chunks
    for (let i = 0; i < childrenDetailsData.length; i += CHUNK_SIZE) {

      const chunk = childrenDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO:item["PERSONNEL NO"],
          FIRST_NAME:item["FIRST NAME"],
          SEX:item["SEX"],
          DATE_OF_BIRTH: new Date(item["DATE OF BIRTH"]),
          REMARKS:item["REMARKS"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            FIRST_NAME: { type: Oracledb.STRING, maxSize:50 },
            SEX: { type: Oracledb.STRING, maxSize:10 },
            DATE_OF_BIRTH: { type: Oracledb.DATE },
            REMARKS: { type: Oracledb.STRING, maxSize:100 },
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

    async findChildrenByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM CHILDREN WHERE PERSONNEL_NO = ${personalNo}`;
            const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
            
            const data = result.rows;

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

async findChildrenByCriteria(criteria:ChildrenSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM Children WHERE ${ChildrenSearchCriteria[criteria]} = :1`;
      const result:any = await connection.execute(sql,[data], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
    
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



async findAllChildren(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM Children`;
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
      const rows:any = [];

      result.rows.forEach((data:any)=>{
        const {PASSPORT_PHOTOGRAPH, PICTURE, ...rest} = data;
        rows.push(rest);
      });

      return rows;
      
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

export default new ChildrenInfoRepository()