import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  CasaultyType } from "../personnel/interface";
//import { CasaultySearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class CasaultyInfoRepository{

    async uploadRecords(CasaultyDetailsData:CasaultyType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO CASUALTY (
      PERSONNEL_NO,
      DATE_OF_DEATH,
      CAUSE_OF_DEATH,
      AUTHORITY,
      REMARKS
      ) VALUES ( 
        :PERSONNEL_NO,
        :DATE_OF_DEATH,
        :CAUSE_OF_DEATH,
        :AUTHORITY,
        :REMARKS)`;

    // Divide data into chunks
    for (let i = 0; i < CasaultyDetailsData.length; i += CHUNK_SIZE) {

      const chunk = CasaultyDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          DATE_OF_DEATH: item["DATE OF DEATH"] ? new Date(item["DATE OF DEATH"]) : null,
          CAUSE_OF_DEATH: item["CAUSE OF DEATH"],
          AUTHORITY: item["AUTHORITY"],
          REMARKS: item["REMARKS"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            DATE_OF_DEATH: { type: Oracledb.DATE },
            CAUSE_OF_DEATH: { type: Oracledb.STRING, maxSize:50 },
            AUTHORITY: { type: Oracledb.STRING, maxSize:50 },
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

    async findCasaultyByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM CASUALTY WHERE PERSONNEL_NO = ${personalNo}`;
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

// async findCasaultyByCriteria(criteria:CasaultySearchCriteria, data:string){
//   let connection =  await connectToDB();
  

  
//   try {
//       const sql = `SELECT * FROM CASUALTY WHERE ${CasaultySearchCriteria[criteria]} = :1`;
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



async findAllCasaulty(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM CASUALTY`;
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

export default new CasaultyInfoRepository()