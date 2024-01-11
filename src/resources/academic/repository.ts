import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  AcademicType } from "../personnel/interface";
import { AcademicSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class AcademicInfoRepository{

    async uploadRecords(academicDetailsData:AcademicType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO ACADEMIC_QUALIFICATION (
      PERSONNEL_NO,
      SCHOOL_ATTENDED,
      CERTIFICATE_OBTAINED,
      COURSE,
      ADDRESS,
      DATE_STARTED,
      DATE_ENDED,
      AUTHORITY
      ) VALUES ( 
        :PERSONNEL_NO,
        :SCHOOL_ATTENDED,
        :CERTIFICATE_OBTAINED,
        :COURSE,
        :ADDRESS,
        :DATE_STARTED,
        :DATE_ENDED,
        :AUTHORITY)`;

    // Divide data into chunks
    for (let i = 0; i < academicDetailsData.length; i += CHUNK_SIZE) {

      const chunk = academicDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          SCHOOL_ATTENDED: item["SCHOOL ATTENDED"],
          CERTIFICATE_OBTAINED: item["QUALIFICATION OBTAINED"],
          ADDRESS: item["ADDRESS"],
          DATE_STARTED: item["DATE STARTED"] ? new Date(item["DATE STARTED"]) : null,
          DATE_ENDED: item["DATE ENDED"] ? new Date(item["DATE ENDED"]) : null,
          COURSE: item["COURSE"],
          AUTHORITY: item["AUTHORITY"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            SCHOOL_ATTENDED: { type: Oracledb.STRING, maxSize:150 },
            CERTIFICATE_OBTAINED: { type: Oracledb.STRING, maxSize:50 },
            COURSE:  { type: Oracledb.STRING, maxSize:50 },
            DATE_STARTED:  { type: Oracledb.DATE },
            DATE_ENDED:  { type: Oracledb.DATE },
            ADDRESS:  { type: Oracledb.STRING, maxSize:150 },
            AUTHORITY:  { type: Oracledb.STRING, maxSize:50 },
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

    async findAcademicByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM ACADEMIC_QUALIFICATION WHERE PERSONNEL_NO = ${personalNo}`;
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

async findAcademicByCriteria(criteria:AcademicSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM ACADEMIC_QUALIFICATION WHERE ${AcademicSearchCriteria[criteria]} = :1`;
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



async findAllAcademic(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM ACADEMIC_QUALIFICATION`;
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

export default new AcademicInfoRepository()