import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  PromotionHistoryType } from "../personnel/interface";
import { PromotionHistorySearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class PromotionHistoryInfoRepository{

    async uploadRecords(promotionHistoryDetailsData:PromotionHistoryType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO PROMOTION_HISTORY (
      PERSONNEL_NO,
      RANK,
      DATE_OF_LAST_PROMOTION,
      SENIORITY_ON_EACH_RANK,
      AUTHORITY_ON_EACH_RANK
      ) VALUES ( 
        :PERSONNEL_NO,
        :RANK,
        :DATE_OF_LAST_PROMOTION,
        :SENIORITY_ON_EACH_RANK,
        :AUTHORITY_ON_EACH_RANK)`;

    // Divide data into chunks
    for (let i = 0; i < promotionHistoryDetailsData.length; i += CHUNK_SIZE) {

      const chunk = promotionHistoryDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO:item["PERSONNEL NO"],
                    RANK: item["RANK"],
                    DATE_OF_LAST_PROMOTION: item["DATE OF LAST PROMOTION"] ? new Date(item["DATE OF LAST PROMOTION"]) : null,
                    SENIORITY_ON_EACH_RANK: item["SENIORITY ON EACH RANK"] ? new Date(item["SENIORITY ON EACH RANK"]) : null,
                    AUTHORITY_ON_EACH_RANK: item["PROMOTION AUTHORITY FOR EACH RANK"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            RANK: { type: Oracledb.STRING, maxSize:50 },
            DATE_OF_LAST_PROMOTION: { type: Oracledb.DATE },
            SENIORITY_ON_EACH_RANK: { type: Oracledb.DATE},
            AUTHORITY_ON_EACH_RANK: { type: Oracledb.STRING, maxSize:50 },
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

    async findPromotionHistoryByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM PROMOTION_HISTORY WHERE PERSONNEL_NO = ${personalNo}`;
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

async findPromotionHistoryByCriteria(criteria:PromotionHistorySearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM PROMOTION_HISTORY WHERE ${PromotionHistorySearchCriteria[criteria]} = :1`;
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



async findAllPromotionHistory(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM PROMOTION_HISTORY`;
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

async findFirstPromotionDetails(id:string){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT *
      FROM promotion_history where personnel_no='${id}'
      ORDER BY SENIORITY_ON_EACH_RANK ASC`;
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });

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
}

export default new PromotionHistoryInfoRepository()