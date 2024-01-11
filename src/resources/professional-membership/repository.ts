import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  ProfessionalMembershipType } from "../personnel/interface";
import { PromembershipSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class PromembershipInfoRepository{

    async uploadRecords(promembershipDetailsData:ProfessionalMembershipType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO PROFESSIONAL_MEMBERSHIP (
      PERSONNEL_NO,
      CERTIFICATE,
      PROFESSIONAL_BODY,
      MEMBERSHIP_NO,
      STATUS,
      REGISTRATION_DATE,
      AUTHORITY
      ) VALUES ( 
        :PERSONNEL_NO,
        :CERTIFICATE,
        :PROFESSIONAL_BODY,
        :MEMBERSHIP_NO,
        :STATUS,
        :REGISTRATION_DATE,
        :AUTHORITY)`;

    // Divide data into chunks
    for (let i = 0; i < promembershipDetailsData.length; i += CHUNK_SIZE) {

      const chunk = promembershipDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          CERTIFICATE: item["CERTIFICATE"],
          PROFESSIONAL_BODY: item["PROFESSIONAL BODY"],
          MEMBERSHIP_NO: String(item["MEMBERSHIP NO"]),
          STATUS: item["STATUS"],
          REGISTRATION_DATE: item["REGISTRATION DATE"] ? new Date(item["REGISTRATION DATE"]) : null,
          AUTHORITY: item["AUTHORITY"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            CERTIFICATE: { type: Oracledb.STRING, maxSize:50 },
            PROFESSIONAL_BODY: { type: Oracledb.STRING, maxSize:50 },
            MEMBERSHIP_NO: { type: Oracledb.STRING, maxSize:30 },
            STATUS: { type: Oracledb.STRING, maxSize:20 },
            REGISTRATION_DATE: { type: Oracledb.DATE },
            AUTHORITY: { type: Oracledb.STRING, maxSize:50 },
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

    async findPromembershipByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM PROFESSIONAL_MEMBERSHIP WHERE PERSONNEL_NO = ${personalNo}`;
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

async findPromembershipByCriteria(criteria:PromembershipSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM PROFESSIONAL_MEMBERSHIP WHERE ${PromembershipSearchCriteria[criteria]} = :1`;
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



async findAllPromembership(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM PROFESSIONAL_MEMBERSHIP`;
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

export default new PromembershipInfoRepository()