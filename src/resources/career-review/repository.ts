import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  CareerReviewType } from "../personnel/interface";
import { CareerReviewSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class CareerReviewInfoRepository{

    async uploadRecords(careerReviewDetailsData:CareerReviewType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO CAREER_REVIEW (
      PERSONNEL_NO,
      RECOMMENDATION_DATE,
      AUTHORITY,
      STATUS
      ) VALUES ( 
        :PERSONNEL_NO,
        :RECOMMENDATION_DATE,
        :AUTHORITY,
        :STATUS)`;

    // Divide data into chunks
    for (let i = 0; i < careerReviewDetailsData.length; i += CHUNK_SIZE) {

      const chunk = careerReviewDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          RECOMMENDATION_DATE: new Date(item["RECOMMENDATION DATE"]),
          AUTHORITY: item["AUTHORITY "],
          STATUS: item["STATUS"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            RECOMMENDATION_DATE: { type: Oracledb.DATE }, 
            AUTHORITY: { type: Oracledb.STRING, maxSize:50 },
            STATUS: { type: Oracledb.STRING, maxSize:50 },
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

    async findCareerReviewByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM CAREER_REVIEW WHERE PERSONNEL_NO = ${personalNo}`;
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

async findCareerReviewByCriteria(criteria:CareerReviewSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM CAREER_REVIEW WHERE ${CareerReviewSearchCriteria[criteria]} = :1`;
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



async findAllCareerReview(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM CareerReview`;
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

export default new CareerReviewInfoRepository()