  
  import fs from 'fs';
  import path from 'path'
  import OracleDB from "oracledb"
  import os from "os"
import { connectToDB } from '../database/connecttodb';
import { Request, Response } from 'express';

  export const saveAuditDetails=async(req:Request, res:Response, status:number, ACTION_PERFORMED:string, 
  COLUMNS_AFFECTED:string,
  ACCOUNT_NAME_AFFECTED:string,
  ACCOUNT_PERSONNEL_NO:string)=>{
    let connection =  await connectToDB();
    try {

      const sql = `INSERT INTO AUDIT_TBL (
      PERSONNEL_NO,
      ROLE_ID,
      REQUEST_DATE,
      REQUEST_URL,
      REQUEST_METHOD,
      RESPONSE_STATUS_CODE,
      RESPONSE_HOST,
      REQUEST_IP,
      USER_TYPE,
      USER_ROLE,
      EMAIL,
      NAME,
      ACTION_PERFORMED, 
      COLUMNS_AFFECTED,
      ACCOUNT_NAME_AFFECTED,
      ACCOUNT_PERSONNEL_NO
      ) VALUES(
        :PERSONNEL_NO,
        :ROLE_ID,
        :REQUEST_DATE,
        :REQUEST_URL,
        :REQUEST_METHOD,
        :RESPONSE_STATUS_CODE,
        :RESPONSE_HOST,
        :REQUEST_IP,
        :USER_TYPE,
        :USER_ROLE,
        :EMAIL,
        :NAME,
        :ACTION_PERFORMED, 
        :COLUMNS_AFFECTED,
        :ACCOUNT_NAME_AFFECTED,
        :ACCOUNT_PERSONNEL_NO
      )`;

      //@ts-ignore
      const user = req.locals;
        
        const result = await connection.execute(sql, {
          PERSONNEL_NO: user?.PERSONNEL_NO,
          ROLE_ID: 1,
          REQUEST_DATE: new Date(Date.now()),
          REQUEST_URL: req.url,
          REQUEST_METHOD: req.method,
          RESPONSE_STATUS_CODE: status,
          RESPONSE_HOST: os.hostname(),
          REQUEST_IP: req.ip,
          USER_TYPE: user?.USER_TYPE,
          USER_ROLE: user?.USER_ROLE,
          EMAIL: user?.EMAIL,
          NAME:`${user?.SURNAME} ${user?.FIRST_NAME}`,
          ACTION_PERFORMED, 
          COLUMNS_AFFECTED,
          ACCOUNT_NAME_AFFECTED,
          ACCOUNT_PERSONNEL_NO
        }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });

  
    } catch (err) {
      console.error('Error occurred:', err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }
  
  export function base64ToImage(blobData:Buffer, filename?:string) {
   const blobToString: string = blobData.toString('base64');
      const base64Data = blobToString.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(blobData).toString('base64');
      // const getPersonnel = filename.split("/")[1]
      // const filePath = path.join(__dirname, '..', '..', 'public', 'images', `${getPersonnel}.png`); // Adjust the path to your desired location
  
      // fs.writeFileSync(filePath, buffer, 'base64');
  
      return buffer;
  }

  export const addYearsToDate=(date:string | undefined, years:number)=>{
    if(date) {
    const originalDate = new Date(date);
    const newDate = new Date(originalDate); // Create a new Date object to avoid mutating the original date
    newDate.setFullYear(originalDate.getFullYear() + years);
    return newDate;
    }
    return null;
  }
  

  // Function to convert Base64 to a buffer
 export function base64ToBuffer(base64String: string) {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const binaryString = Buffer.from(base64Data, 'base64');
    return binaryString;
 }


 export function removeBase64Prefix(base64String: string | undefined ) {
  const prefix = 'data:image/png;base64,';

  if(!base64String) return "";
  
  if (base64String.startsWith(prefix)) {
      return base64String.substring(prefix.length);
  } else {
      return base64String; // Return the input string unchanged
  }
}

export function getDateFromAge(age: number): string {
  const today: Date = new Date();
  const birthYear: number = today.getFullYear() - age;
  const birthDate: Date = new Date(birthYear, today.getMonth(), today.getDate());
  
  // Format the date to 'yyyy-mm-dd'
  const formattedDate: string = birthDate.toISOString().split('T')[0];
  return formattedDate;
}

export function formatDateToString(date: Date): string {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();

  const formattedMonth: string = month < 10 ? `0${month}` : `${month}`;
  const formattedDay: string = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${formattedMonth}-${formattedDay}`;
}

export const convertToLowerCase=(data:string | null | undefined)=>{
  if(!data) return "";
  return data.toLowerCase();
}