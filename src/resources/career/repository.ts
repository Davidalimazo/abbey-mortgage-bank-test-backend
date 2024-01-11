import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  CareerType } from "../personnel/interface";
import { CareerSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class CareerInfoRepository{

    async uploadRecords(CareerDetailsData:CareerType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO CAREER (
      PERSONNEL_NO,
      SERIAL,
      UNIT_FROM,
      UNIT_TO,
      AUTHORITY,
      RECOMMENDATION_DATE,
      REMARKS
      ) VALUES ( 
        :PERSONNEL_NO,
        :SERIAL,
        :UNIT_FROM,
        :UNIT_TO,
        :AUTHORITY,
        :RECOMMENDATION_DATE,
        :REMARKS)`;

    // Divide data into chunks
    for (let i = 0; i < CareerDetailsData.length; i += CHUNK_SIZE) {

      const chunk = CareerDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          SERIAL: item["SERIAL"],
          UNIT_FROM: item["UNIT FROM"],
          UNIT_TO: item["UNIT TO"],
          AUTHORITY: item["AUTHORITY"],
          RECOMMENDATION_DATE: new Date(item["RECOMMENDATION DATE"]),
          REMARKS: item["REMARKS"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            SERIAL: { type: Oracledb.STRING, maxSize:30 },
            UNIT_FROM: { type: Oracledb.STRING, maxSize:50 },
            UNIT_TO: { type: Oracledb.STRING, maxSize:50 },
            AUTHORITY: { type: Oracledb.STRING, maxSize:50 },
            RECOMMENDATION_DATE: { type: Oracledb.DATE },
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

    async findCareerByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM CAREER WHERE PERSONNEL_NO = ${personalNo}`;
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

async findCareerByCriteria(criteria:CareerSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM CAREER WHERE ${CareerSearchCriteria[criteria]} = :1`;
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



async findAllCareer(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM CAREER`;
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

export default new CareerInfoRepository()