import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  AwolType } from "../personnel/interface";
import { AwolSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class AwolInfoRepository{

    async uploadRecords(awolDetailsData:AwolType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO AWOL (
      PERSONNEL_NO,
      EFFECTIVE_DATE_OF_AWOL,
      AWOL_AUTHORITY,
      AUTHORITY,
      EFFECTIVE_DATE_OF_AWOL_CANCELLATION,
      AWOL_CANCELLATION_AUTHORITY) VALUES ( 
        :PERSONNEL_NO,
        :EFFECTIVE_DATE_OF_AWOL,
        :AWOL_AUTHORITY,
        :AUTHORITY,
        :EFFECTIVE_DATE_OF_AWOL_CANCELLATION,
        :AWOL_CANCELLATION_AUTHORITY)`;

    // Divide data into chunks
    for (let i = 0; i < awolDetailsData.length; i += CHUNK_SIZE) {

      const chunk = awolDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO:item["PERSONNEL NO"],
          EFFECTIVE_DATE_OF_AWOL: new Date(item["EFFECTIVE DATE OF AWOL"]),
          AWOL_AUTHORITY: item["AWOL AUTHORITY"],
          AUTHORITY: item["AUTHORITY"],
          EFFECTIVE_DATE_OF_AWOL_CANCELLATION: new Date(item["EFFECTIVE DATE OF AWOL CANCELLATION"]),
          AWOL_CANCELLATION_AUTHORITY: item["AWOL CANCELLATION AUTHORITY"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
          PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
          EFFECTIVE_DATE_OF_AWOL:{ type: Oracledb.DATE },
          AWOL_AUTHORITY: { type: Oracledb.STRING, maxSize:50 },
          AUTHORITY: { type: Oracledb.STRING, maxSize:50 },
          EFFECTIVE_DATE_OF_AWOL_CANCELLATION: { type: Oracledb.DATE },
          AWOL_CANCELLATION_AUTHORITY: { type: Oracledb.STRING, maxSize:50 },
          }
        };
    
        //@ts-ignore
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

    async findAwolByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM AWOL WHERE PERSONNEL_NO = ${personalNo}`;
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


    async findAwolCountInGPZ(){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT pi.geo_political_zone, COUNT(a.personnel_no) AS awol_count
            FROM personal_info pi
            LEFT JOIN awol a ON pi.personnel_no = a.personnel_no
            GROUP BY pi.geo_political_zone`;
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

async findAwolByCriteria(criteria:AwolSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM AWOL WHERE ${AwolSearchCriteria[criteria]} = :1`;
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



async findAllAwol(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM AWOL`;
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

export default new AwolInfoRepository()