import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  HonoursType } from "../personnel/interface";
import { HonoursSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class HonoursInfoRepository{

    async uploadRecords(honoursDetailsData:HonoursType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO HONOURS_AND_AWARDS (
      PERSONNEL_NO,
      AWARD,
      AWARD_DATE,
      AWARD_ABBR,
      AUTHORITY
      ) VALUES ( 
        :PERSONNEL_NO, 
        :AWARD,
        :AWARD_DATE,
        :AWARD_ABBR,
        :AUTHORITY)`;

    // Divide data into chunks
    for (let i = 0; i < honoursDetailsData.length; i += CHUNK_SIZE) {

      const chunk = honoursDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          AWARD: item["AWARD"],
          AWARD_DATE: item["AWARD DATE"] ? new Date(item["AWARD DATE"]) : null,
          AWARD_ABBR: item["AWARD ABBR"],
          AUTHORITY: item["AUTHORITY"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            AWARD: { type: Oracledb.STRING, maxSize:50 },
            AWARD_DATE: { type: Oracledb.DATE },
            AWARD_ABBR: { type: Oracledb.STRING, maxSize:20 },
            AUTHORITY: { type: Oracledb.STRING, maxSize:50 }
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

    async findHonoursByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM HONOURS_AND_AWARDS WHERE PERSONNEL_NO = ${personalNo}`;
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

// async findHonoursByCriteria(criteria:HonoursSearchCriteria, data:string){
//   let connection =  await connectToDB();
  

  
//   try {
//       const sql = `SELECT * FROM Honours WHERE ${HonoursSearchCriteria[criteria]} = :1`;
//       const result:any = await connection.execute(sql,[data], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
    
//       return result.rows[0];
      
//   } catch (error) {
//       console.log(error);
//       return error;
//   } finally{
//       if (connection) {
//           try {
//             await connection.close();
//           } catch (err) {
//             console.error('Error closing connection:', err);
//           }
//         }
//   }
// }



async findAllHonours(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM HONOURS_AND_AWARDS`;
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

export default new HonoursInfoRepository()