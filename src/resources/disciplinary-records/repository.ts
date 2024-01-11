import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  DisciplineType } from "../personnel/interface";
import { DisciplinaryRecordsSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class DisciplinaryRecordsInfoRepository{

    async uploadRecords(disciplinaryRecords:DisciplineType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO DISCIPLINARY_RECORDS (
      PERSONNEL_NO,
      OFFENCE,
      REPORTING_AUTHORITY,
      TRYING_OFFICER,
      DATE_TRIED,
      EFFECTIVE_DATE,
      DISPOSAL_DATE,
      DATE_ENTERED,
      VERDICT,
      PENALTY,
      REMARKS
      ) VALUES ( 
        :PERSONNEL_NO,
        :OFFENCE,
        :REPORTING_AUTHORITY,
        :TRYING_OFFICER,
        :DATE_TRIED,
        :EFFECTIVE_DATE,
        :DISPOSAL_DATE,
        :DATE_ENTERED,
        :VERDICT,
        :PENALTY,
        :REMARKS)`;

    // Divide data into chunks
    for (let i = 0; i < disciplinaryRecords.length; i += CHUNK_SIZE) {

      const chunk = disciplinaryRecords.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          OFFENCE: item["OFFENCE"],
          REPORTING_AUTHORITY: item["REPORTING AUTHORITY"],
          TRYING_OFFICER: item["TRYING OFFICER"],
          DATE_TRIED: item["DATE TRIED"] ? new Date(item["DATE TRIED"]) : null,
          EFFECTIVE_DATE: item["EFFECTIVE DATE"] ? new Date(item["EFFECTIVE DATE"]) : null,
          DISPOSAL_DATE: item["DISPOSAL DATE"] ? new Date(item["DISPOSAL DATE"]) : null,
          DATE_ENTERED: item["DATE ENTERED"] ? new Date(item["DATE ENTERED"]) : null,
          VERDICT: item["VERDICT"],
          PENALTY: item["PENALTY"],
          REMARKS: item["REMARKS"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            OFFENCE: { type: Oracledb.STRING, maxSize:100 },
            REPORTING_AUTHORITY: { type: Oracledb.STRING, maxSize:50 },
            TRYING_OFFICER:{ type: Oracledb.STRING, maxSize:50 },
            DATE_TRIED: { type: Oracledb.DATE },
            EFFECTIVE_DATE: { type: Oracledb.DATE },
            DISPOSAL_DATE: { type: Oracledb.DATE },
            DATE_ENTERED: { type: Oracledb.DATE },
            VERDICT: { type: Oracledb.STRING, maxSize:50 },
            PENALTY: { type: Oracledb.STRING, maxSize:50 },
            REMARKS: { type: Oracledb.STRING, maxSize:100 }
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

    async findDisciplinaryRecordsByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM DISCIPLINARY_RECORDS WHERE PERSONNEL_NO = ${personalNo}`;
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

async findDisciplinaryRecordsByCriteria(criteria:DisciplinaryRecordsSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM DISCIPLINARY_RECORDS WHERE ${DisciplinaryRecordsSearchCriteria[criteria]} = :1`;
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



async findAllDisciplinaryRecords(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM DISCIPLINARY_RECORDS`;
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

export default new DisciplinaryRecordsInfoRepository()