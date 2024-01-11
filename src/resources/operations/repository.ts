import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  OperationType } from "../personnel/interface";
import { OperationsSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class OperationsInfoRepository{

    async uploadRecords(operationsDetailsData:OperationType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO OPERATIONS (
      PERSONNEL_NO,
      NAME_OF_OPERATION,
      START_DATE,
      END_DATE
      ) VALUES ( 
        :PERSONNEL_NO,
        :NAME_OF_OPERATION,
        :START_DATE,
        :END_DATE)`;

    // Divide data into chunks
    for (let i = 0; i < operationsDetailsData.length; i += CHUNK_SIZE) {

      const chunk = operationsDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          NAME_OF_OPERATION: item["NAME OF OPERATION"],
          START_DATE:item["START DATE"] ? new Date(item["START DATE"]) : null,
          END_DATE: item["END DATE"] ? new Date(item["END DATE"]) : null
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            NAME_OF_OPERATION: { type: Oracledb.STRING, maxSize:50 },
            START_DATE: { type:Oracledb.DATE },
            END_DATE: { type: Oracledb.DATE}
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

    async findOperationsByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM OPERATIONS WHERE PERSONNEL_NO = ${personalNo}`;
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

// async findOperationsByCriteria(criteria:OperationsSearchCriteria, data:string){
//   let connection =  await connectToDB();
  

  
//   try {
//       const sql = `SELECT * FROM OPERATIONS WHERE ${OperationsSearchCriteria[criteria]} = :1`;
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



async findAllOperations(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM OPERATIONS`;
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

export default new OperationsInfoRepository()