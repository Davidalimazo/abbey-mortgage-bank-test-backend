import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import {  MilitaryDetailType } from "../personnel/interface";
import { MilitaryDetailsSchema, MilitarySearchCriteria, MilitaryUpdateDetailsSchema, reqObjKeys } from "./interface";
import { addYearsToDate } from "../../utils/constants";


const CHUNK_SIZE = 100; // Adjust this based on your needs



class MilitaryInfoRepository{

    async uploadRecords(MilitaryDetailsData:MilitaryDetailType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO MILITARY_INFORMATION (
      PERSONNEL_NO,
      PERSONNEL_STATUS,
      EXTENSION_OF_SERVICE,
      AUTHORITY_FOR_EXTENSION_OF_SERVICE,
      UNIT,
      UNIT_COMMANDER,
      FORMATION,
      CHANGE_OF_CORPS,
      BRIGADE,
      UNIT_LOCATION,
      STATE_UNIT_IS_LOCATED,
      CORPS,
      AUTHORITY_FOR_CHANGE_OF_CORPS,
      CHANGE_OF_CORPS_DATE,
      APPOINTMENT,
      TYPE_OF_COMMISSION,
      CONVERSION_OF_COMMISSION_AUTHORITY,
      ANTE_DATE_ON_COMMISSION,
      CONVERSION_DATE,
      EFFECTIVE_DATE_OF_LAST_PROMOTION,
      LAST_PROMOTION_SIGNATURE_DATE,
      DATE_OF_COMMISSION,
      NEXT_DATE_OF_PROMOTION,
      DATE_TAKEN_ON_STRENGTH_IN_PRESENT_UNIT,
      POSTING_PROMULGATION,
      RUN_OUT_DATE,
      DATE_OF_ENLISTMENT,
      MERGER_OF_SERVICE_DATE,
      NDA_COURSE,
      STAFF_COLLEGE_COURSE,
      NDA_GRADE,
      STAFF_COLLEGE) VALUES ( 
        :PERSONNEL_NO,
        :PERSONNEL_STATUS,
        :EXTENSION_OF_SERVICE,
        :AUTHORITY_FOR_EXTENSION_OF_SERVICE,
        :UNIT,
        :UNIT_COMMANDER,
        :FORMATION,
        :CHANGE_OF_CORPS,
        :BRIGADE,
        :UNIT_LOCATION,
        :STATE_UNIT_IS_LOCATED,
        :CORPS,
        :AUTHORITY_FOR_CHANGE_OF_CORPS,
        :CHANGE_OF_CORPS_DATE,
        :APPOINTMENT,
        :TYPE_OF_COMMISSION,
        :CONVERSION_OF_COMMISSION_AUTHORITY,
        :ANTE_DATE_ON_COMMISSION,
        :CONVERSION_DATE,
        :EFFECTIVE_DATE_OF_LAST_PROMOTION,
        :LAST_PROMOTION_SIGNATURE_DATE,
        :DATE_OF_COMMISSION,
        :NEXT_DATE_OF_PROMOTION,
        :DATE_TAKEN_ON_STRENGTH_IN_PRESENT_UNIT,
        :POSTING_PROMULGATION,
        :RUN_OUT_DATE,
        :DATE_OF_ENLISTMENT,
        :MERGER_OF_SERVICE_DATE,
        :NDA_COURSE,
        :STAFF_COLLEGE_COURSE,
        :NDA_GRADE,
        :STAFF_COLLEGE)`;

    // Divide data into chunks
    for (let i = 0; i < MilitaryDetailsData.length; i += CHUNK_SIZE) {

      const chunk = MilitaryDetailsData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO: item["PERSONNEL NO"],
                          PERSONNEL_STATUS: item["PERSONNEL STATUS"],
                          EXTENSION_OF_SERVICE: item["EXTENSION OF SERVICE"] ? new Date(item["EXTENSION OF SERVICE"]) : null,
                          AUTHORITY_FOR_EXTENSION_OF_SERVICE:item["AUTHORITY FOR EXTENSION OF SERVICE"],
                          UNIT: item["UNIT"],
                          UNIT_COMMANDER: item["UNIT COMMANDER"],
                          FORMATION: item["FORMATION"],
                          CHANGE_OF_CORPS: item["CHANGE OF CORPS"],
                          BRIGADE: item["BRIGADE"],
                          UNIT_LOCATION: item["UNIT LOCATION"],
                          STATE_UNIT_IS_LOCATED: item["STATE UNIT IS LOCATED"],
                          CORPS: item["CORPS"],
                          AUTHORITY_FOR_CHANGE_OF_CORPS:item["AUTHORITY FOR CHANGE OF CORPS"],
                          CHANGE_OF_CORPS_DATE: item["CHANGE OF CORPS DATE"] ? new Date(item["CHANGE OF CORPS DATE"]) : null,
                          APPOINTMENT: item["APPOINTMENT"],
                          TYPE_OF_COMMISSION: item["TYPE OF COMMISSION"],
                          CONVERSION_OF_COMMISSION_AUTHORITY: item["CONVERSION OF COMMISSION AUTHORITY"],
                          ANTE_DATE_ON_COMMISSION: item["ANTE-DATE ON COMMISSION"] ?  new Date(item["ANTE-DATE ON COMMISSION"]) : null,
                          CONVERSION_DATE: item["CONVERSION DATE"] ? new Date(item["CONVERSION DATE"]) : null,
                          EFFECTIVE_DATE_OF_LAST_PROMOTION: item["EFFECTIVE DATE OF LAST PROMOTION"] ? new Date(item["EFFECTIVE DATE OF LAST PROMOTION"]) : null,
                          LAST_PROMOTION_SIGNATURE_DATE: item["LAST PROMOTION SIGNATURE DATE"] ? new Date(item["LAST PROMOTION SIGNATURE DATE"]) : null,
                          DATE_OF_COMMISSION: item["DATE OF COMMISSION"] ? new Date(item["DATE OF COMMISSION"]) : null,
                          NEXT_DATE_OF_PROMOTION: item["EFFECTIVE DATE OF LAST PROMOTION"] ? addYearsToDate(item["EFFECTIVE DATE OF LAST PROMOTION"], 5) : null,
                          DATE_TAKEN_ON_STRENGTH_IN_PRESENT_UNIT: item["DATE TAKEN ON STRENGTH IN PRESENT UNIT"] ? new Date(item["DATE TAKEN ON STRENGTH IN PRESENT UNIT"]) : null,
                          POSTING_PROMULGATION: item["POSTING PROMULGATION"] ? new Date(item["POSTING PROMULGATION"]) : null,
                          RUN_OUT_DATE: item["RUN OUT DATE"] ? new Date(item["RUN OUT DATE"]) : null,
                          DATE_OF_ENLISTMENT: item["DATE OF ENLISTMENT"] ? new Date(item["DATE OF ENLISTMENT"]) : null,
                          MERGER_OF_SERVICE_DATE:item["MERGER OF SERVICE DATE"] ? new Date(item["MERGER OF SERVICE DATE"]) : null,
                          NDA_COURSE: item["NDA COURSE"],
                          STAFF_COLLEGE_COURSE: item["STAFF COLLEGE COURSE"],
                          NDA_GRADE: item["NDA GRADE"],
                          STAFF_COLLEGE: item["STAFF COLLEGE"]
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            PERSONNEL_STATUS: { type: Oracledb.STRING, maxSize:50 },
            EXTENSION_OF_SERVICE:  { type: Oracledb.DATE },
            AUTHORITY_FOR_EXTENSION_OF_SERVICE:  { type: Oracledb.STRING, maxSize:50 },
            UNIT: { type: Oracledb.STRING, maxSize:50 },
            UNIT_COMMANDER: { type: Oracledb.STRING, maxSize:100 },
            FORMATION: { type: Oracledb.STRING, maxSize:50 },
            CHANGE_OF_CORPS: { type: Oracledb.STRING, maxSize:50 },
            BRIGADE: { type: Oracledb.STRING, maxSize:50 },
            UNIT_LOCATION: { type: Oracledb.STRING, maxSize:50 },
            STATE_UNIT_IS_LOCATED: { type: Oracledb.STRING, maxSize:50 },
            CORPS: { type: Oracledb.STRING, maxSize:50 },
            AUTHORITY_FOR_CHANGE_OF_CORPS: { type: Oracledb.STRING, maxSize:50 },
            CHANGE_OF_CORPS_DATE:{ type: Oracledb.DATE },
            APPOINTMENT: { type: Oracledb.STRING, maxSize:50 },
            TYPE_OF_COMMISSION: { type: Oracledb.STRING, maxSize:50 },
            CONVERSION_OF_COMMISSION_AUTHORITY: { type: Oracledb.STRING, maxSize:50 },
            ANTE_DATE_ON_COMMISSION:{ type: Oracledb.DATE },
            CONVERSION_DATE:{ type: Oracledb.DATE },
            EFFECTIVE_DATE_OF_LAST_PROMOTION:{ type: Oracledb.DATE },
            LAST_PROMOTION_SIGNATURE_DATE:{ type: Oracledb.DATE },
            DATE_OF_COMMISSION:{ type: Oracledb.DATE },
            NEXT_DATE_OF_PROMOTION:{ type: Oracledb.DATE },
            DATE_TAKEN_ON_STRENGTH_IN_PRESENT_UNIT:{ type: Oracledb.DATE },
            POSTING_PROMULGATION: { type: Oracledb.DATE },
            RUN_OUT_DATE:{ type: Oracledb.DATE },
            DATE_OF_ENLISTMENT:{ type: Oracledb.DATE },
            MERGER_OF_SERVICE_DATE:{ type: Oracledb.DATE },
            NDA_COURSE: { type: Oracledb.STRING, maxSize:50 },
            STAFF_COLLEGE_COURSE: { type: Oracledb.STRING, maxSize:50 },
            NDA_GRADE: { type: Oracledb.STRING, maxSize:20 },
            STAFF_COLLEGE: { type: Oracledb.STRING, maxSize:150 },
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

    async findMilitaryInfoByPersonalNo(personalNo:string, localPersonnelNo:string){
        let connection =  await connectToDB();
        if(personalNo === localPersonnelNo){
          return [];
        }
        
        try {

            const sql = `SELECT * FROM MILITARY_INFORMATION WHERE PERSONNEL_NO = '${personalNo}'`;
            const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
            const sql2 = `SELECT RANK FROM PERSONAL_INFO WHERE PERSONNEL_NO = '${personalNo}'`;
            const result2:any = await connection.execute(sql2, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
            
            const data = result.rows[0];

            if(data){

            return {...data, RANK:result2.rows[0]?.RANK}
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
    async updateMilitaryInfoByPersonalNo(personalNo:string, updatedData:Record<string, any>, localPersonnelNo:string){
        let connection =  await connectToDB();
        
        try {
          const existingData = await this.findMilitaryInfoByPersonalNo(personalNo, localPersonnelNo);
      
          const changedFields: Record<string, any> = {};
          for (const key in updatedData) {
            const value = updatedData[key];
  
            if (value !== existingData[key] && value !== undefined) {
              if (key.endsWith('_DATE') && typeof value === 'string') {
                changedFields[reqObjKeys[key]] = new Date(value);
                console.log(reqObjKeys[key])
              } else {
                console.log(reqObjKeys[key])
                changedFields[reqObjKeys[key]] = value;
              }
            }
          }
      
          if (Object.keys(changedFields).length === 0) {
            console.log('No changes or all changes are undefined. Skipping update.');
            return null;
          }
      
          // Construct and execute the SQL update query
          let updateQuery = 'UPDATE MILITARY_INFORMATION SET';
          const updateParams: any[] = [];
          for (const field in changedFields) {
            updateQuery += ` ${field} = :${field},`;
            updateParams.push(changedFields[field]);
          }
          updateQuery = updateQuery.slice(0, -1); // Remove the trailing comma
          updateQuery += ' WHERE PERSONNEL_NO = :personnelNo';
      
          try {
            const result = await connection.execute(updateQuery, {
              ...changedFields,
              personnelNo: existingData.PERSONNEL_NO,
            }, { outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit: true });
            console.log('Update successful:', result.rowsAffected);
            return result.rowsAffected;
          } catch (error) {
            console.error('Error updating data:', error);
          }
        } catch (error) {
          console.log(error);
          return error;
        } finally {
          // Your existing connection closing code...
        }
}

async findMilitaryInfoByCriteria(criteria:MilitarySearchCriteria, data:string){
  let connection =  await connectToDB();
  

  
  try {
      const sql = `SELECT * FROM MILITARY_INFORMATION WHERE ${MilitarySearchCriteria[criteria]} = :1`;
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



async findAllMilitary(localPersonnelNo:string){
  let connection =  await connectToDB();
  
  try {
    
      const sql = `SELECT * FROM MILITARY_INFORMATION`;
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
      const rows:any = [];

      result.rows.forEach((data:any)=>{
        const {PASSPORT_PHOTOGRAPH, PICTURE, ...rest} = data;
        rows.push(rest);
      });

      const data=  result.rows
      const array:any[] = []
      if(data){
        data.map((item:any)=>{
          if(item?.PERSONNEL_NO !== localPersonnelNo){
            array.push({...item})
          }
        })
      }

        return array
      
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

async findByColumnName(criteria:MilitarySearchCriteria){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT ${MilitarySearchCriteria[criteria]} FROM MILITARY_INFORMATION`;
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });

      return result.rows;
      
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

export default new MilitaryInfoRepository()