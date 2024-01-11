import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  SpouseType } from "../personnel/interface";
import { SpouseSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class SpouseInfoRepository{

    async uploadRecords(spouseDetailsData:SpouseType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO SPOUSE (
      PERSONNEL_NO,
      FIRST_NAME,
      MAIDEN_NAME,
      PHONE_NUMBER,
      ADDRESS,
      NATIONALITY,
      REMARKS) VALUES ( 
        :PERSONNEL_NO,
        :FIRST_NAME,
        :MAIDEN_NAME,
        :PHONE_NUMBER,
        :ADDRESS,
        :NATIONALITY,
        :REMARKS)`;

    // Divide data into chunks
    for (let i = 0; i < spouseDetailsData.length; i += CHUNK_SIZE) {

      const chunk = spouseDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO:item["PERSONNEL NO"],
          FIRST_NAME:item["FIRST NAME"],
          MAIDEN_NAME:item["MAIDEN NAME"],
          NATIONALITY:item["NATIONALITY"],
          PHONE_NUMBER: String(item["PHONE NO"]),
          ADDRESS: item["ADDRESS"],
          REMARKS: item["REMARKS"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            FIRST_NAME: { type: Oracledb.STRING, maxSize:50 },
            MAIDEN_NAME: { type: Oracledb.STRING, maxSize:50 },
            NATIONALITY: { type: Oracledb.STRING, maxSize:50 },
            PHONE_NUMBER: { type: Oracledb.STRING, maxSize:100 },
            ADDRESS: { type: Oracledb.STRING, maxSize:100 },
            REMARKS: { type: Oracledb.STRING, maxSize:100 },
          }
        };
    
        let result:any = await connection.executeMany(sql, chunk, options);
        console.log(result)
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

    async findSpouseByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM SPOUSE WHERE PERSONNEL_NO = ${personalNo}`;
            const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
            
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

async findSpouseByCriteria(criteria:SpouseSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM SPOUSE WHERE ${SpouseSearchCriteria[criteria]} = :1`;
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



async findAllSpouse(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM SPOUSE`;
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

export default new SpouseInfoRepository()