import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import { AccountDetailsType, SearchCriteria } from "../personnel/interface";
import { AccountSearchCriteria } from "./interface";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class AccountInfoRepository{

    async uploadRecords(accountDetailsData:AccountDetailsType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO ACCOUNT_DETAILS (
      PERSONNEL_NO,
      NAME,
      ACCOUNT_NUMBER,
      BANK_NAME,
      BANK_ADDRESS,
      REMARKS) VALUES ( 
        :PERSONNEL_NO,
        :NAME,
        :ACCOUNT_NUMBER,
        :BANK_NAME,
        :BANK_ADDRESS,
        :REMARKS)`;

    // Divide data into chunks
    for (let i = 0; i < accountDetailsData.length; i += CHUNK_SIZE) {

      const chunk = accountDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
          NAME:item["NAME"],
          ACCOUNT_NUMBER:String(item["ACCOUNT NUMBER"]),
          BANK_NAME:item["BANK NAME"],
          BANK_ADDRESS:item["BANK ADDRESS"],
          REMARKS:item["REMARKS"],
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            NAME: { type: Oracledb.STRING, maxSize:100 },
            ACCOUNT_NUMBER: { type: Oracledb.STRING, maxSize:10 },
            BANK_NAME: { type: Oracledb.STRING, maxSize:50 },
            BANK_ADDRESS: { type: Oracledb.STRING, maxSize:150 },
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

    async findUserBypersonalNo(personalNo:string){
        let connection =  await connectToDB();
        
        try {

            const sql = `SELECT * FROM ACCOUNT_DETAILS WHERE PERSONNEL_NO = ${personalNo}`;
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

async findAccountByCriteria(criteria:AccountSearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM ACCOUNT_DETAILS WHERE ${AccountSearchCriteria[criteria]} = :1`;
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



async findAllAccount(){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM ACCOUNT_DETAILS`;
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

export default new AccountInfoRepository()