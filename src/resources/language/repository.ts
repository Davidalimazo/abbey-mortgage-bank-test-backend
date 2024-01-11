import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  LanguageType } from "../personnel/interface";
import { LanguageSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class LanguageInfoRepository{

    async uploadRecords(LanguageDetailsData:LanguageType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO LANGUAGES (
      PERSONNEL_NO,
      LANGUAGE1,
      LANGUAGE2,
      LANGUAGE3,
      LANGUAGE4
      ) VALUES ( 
        :PERSONNEL_NO,
        :LANGUAGE1,
        :LANGUAGE2,
        :LANGUAGE3,
        :LANGUAGE4)`;

    // Divide data into chunks
    for (let i = 0; i < LanguageDetailsData.length; i += CHUNK_SIZE) {

      const chunk = LanguageDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
                    LANGUAGE1: item["LANGUAGE 1"],
                    LANGUAGE2: item["LANGUAGE 2"],
                    LANGUAGE3: item["LANGUAGE 3"],
                    LANGUAGE4: item["LANGUAGE 4"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            LANGUAGE1: { type: Oracledb.STRING, maxSize:50 },
            LANGUAGE2: { type: Oracledb.STRING, maxSize:50 },
            LANGUAGE3: { type: Oracledb.STRING, maxSize:50 },
            LANGUAGE4: { type: Oracledb.STRING, maxSize:50 },
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

    async findLanguageByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM LANGUAGES WHERE PERSONNEL_NO = ${personalNo}`;
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

// async findLanguageByCriteria(criteria:LanguageSearchCriteria, data:string){
//   let connection =  await connectToDB();
  

  
//   try {
//       const sql = `SELECT * FROM LANGUAGES WHERE ${LanguageSearchCriteria[criteria]} = :1`;
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



async findAllLanguage(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM LANGUAGES`;
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

export default new LanguageInfoRepository()