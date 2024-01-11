import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  NextOfKinType } from "../personnel/interface";
import { NextOfKinSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class NextOfKinInfoRepository{

    async uploadRecords(nextOfKinDetailsData:NextOfKinType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO NEXT_OF_KIN (
      PERSONNEL_NO,
      FULL_NAME,
      RELATIONSHIP,
      PHONE_NUMBER,
      EMAIL,
      ADDRESS,
      AUTHORITY_CONFIRMING_NOK) VALUES ( 
        :PERSONNEL_NO,
        :FULL_NAME,
        :RELATIONSHIP,
        :PHONE_NUMBER,
        :EMAIL,
        :ADDRESS,
        :AUTHORITY_CONFIRMING_NOK)`;

    // Divide data into chunks
    for (let i = 0; i < nextOfKinDetailsData.length; i += CHUNK_SIZE) {

      const chunk = nextOfKinDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO:item["PERSONNEL NO"],
          FULL_NAME:item["FULL NAME"],
          RELATIONSHIP:item["RELATIONSHIP"],
          PHONE_NUMBER:String(item["TELEPHONE NO"]),
          EMAIL:item["EMAIL ADDRESS"],
          ADDRESS:item["ADDRESS"],
          AUTHORITY_CONFIRMING_NOK:item["AUTHORITY CONFIRMING NOK"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            FULL_NAME: { type: Oracledb.STRING, maxSize:100 },
            RELATIONSHIP: { type: Oracledb.STRING, maxSize:30 },
            PHONE_NUMBER: { type: Oracledb.STRING, maxSize:100 },
            EMAIL: { type: Oracledb.STRING, maxSize:70 },
            ADDRESS: { type: Oracledb.STRING, maxSize:100 },
            AUTHORITY_CONFIRMING_NOK: { type: Oracledb.STRING, maxSize:50 },
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

    async findNextOfKinByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM NEXT_OF_KIN WHERE PERSONNEL_NO = ${personalNo}`;
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

async findNextOfKinByCriteria(criteria:NextOfKinSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM NEXT_OF_KIN WHERE ${NextOfKinSearchCriteria[criteria]} = :1`;
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



async findAllNextOfKin(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM NEXT_OF_KIN`;
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

export default new NextOfKinInfoRepository()