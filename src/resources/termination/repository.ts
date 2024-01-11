import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  TerminationType } from "../personnel/interface";
import { TerminationSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class TerminationInfoRepository{

    async uploadRecords(TerminationDetailsData:TerminationType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO TERMINATE (
      PERSONNEL_NO,
      SOS_DATE,
      TERMINAL_DATE,
      EFFECTIVE_DATE,
      TYPE_OF_TERMINATE
      ) VALUES ( 
        :PERSONNEL_NO,
        :SOS_DATE,
        :TERMINAL_DATE,
        :EFFECTIVE_DATE,
        :TYPE_OF_TERMINATE)`;

    // Divide data into chunks
    for (let i = 0; i < TerminationDetailsData.length; i += CHUNK_SIZE) {

      const chunk = TerminationDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          SOS_DATE: new Date(item["SOS DATE"]),
          TERMINAL_DATE: new Date(item["TERMINAL DATE"]),
          EFFECTIVE_DATE: new Date(item["EFFECTIVE DATE"]),
          TYPE_OF_TERMINATE: item["TYPE OF TERMINATION"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            SOS_DATE: { type: Oracledb.DATE },
            TERMINAL_DATE:  { type: Oracledb.DATE },
            EFFECTIVE_DATE:  { type: Oracledb.DATE },
            TYPE_OF_TERMINATE: { type: Oracledb.STRING, maxSize:50 },
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

    async findTerminationByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM TERMINATE WHERE PERSONNEL_NO = ${personalNo}`;
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

async findTerminationByCriteria(criteria:TerminationSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM TERMINATE WHERE ${TerminationSearchCriteria[criteria]} = :1`;
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



async findAllTermination(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM TERMINATE`;
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

export default new TerminationInfoRepository()