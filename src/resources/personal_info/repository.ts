import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import { base64ToBuffer, base64ToImage, convertToLowerCase } from "../../utils/constants";
import { PersonalDetailType, SearchCriteria } from "../personnel/interface";

const CHUNK_SIZE = 100; // Adjust this based on your needs

Oracledb.fetchAsString = [ Oracledb.CLOB ];
Oracledb.fetchAsBuffer = [ Oracledb.BLOB ];


class PersonalInfoRepository{
    async uploadPersonnel(personalDetailData:PersonalDetailType[], localUser:string){

          let connection =  await connectToDB();

          try {

            let result: any;
        
            for (const item of personalDetailData) {

              const getPersonnel = await this.findUserByPersonalNo(`'${item["PERSONNEL NO"]}'`, localUser);

              if(!getPersonnel){
                const sql = `INSERT INTO PERSONAL_INFO (
                  PERSONNEL_NO,
                  RANK,
                  SURNAME,
                  FIRST_NAME,
                  MIDDLE_NAME,
                  OTHER_NAMES,
                  INITIALS,
                  DATE_OF_BIRTH,
                  EMAIL,
                  PHONE_NUMBER,
                  BLOOD_GROUP,
                  MARITAL_STATUS,
                  SEX,
                  RELIGION,
                  ADDRESS,
                  PLACE_OF_BIRTH,
                  STATE,
                  LGA,
                  GEO_POLITICAL_ZONE,
                  NATIONALITY,
                  TELEPHONE_NO,
                  PASSPORT_PHOTOGRAPH,
                  PICTURE
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :RANK,
                  :SURNAME,
                  :FIRST_NAME,
                  :MIDDLE_NAME,
                  :OTHER_NAMES,
                  :INITIALS,
                  TO_DATE(:DATE_OF_BIRTH, ,'DD-MM-YYYY'),
                  :EMAIL,
                  :PHONE_NUMBER,
                  :BLOOD_GROUP,
                  :MARITAL_STATUS,
                  :SEX,
                  :RELIGION,
                  :ADDRESS,
                  :PLACE_OF_BIRTH,
                  :STATE,
                  :LGA, 
                  :GEO_POLITICAL_ZONE,
                  :NATIONALITY,
                  :TELEPHONE_NO,
                  :PASSPORT_PHOTOGRAPH,
                  :PICTURE)`;
                
                 result = await connection.execute(sql, {
                  PERSONNEL_NO:item["PERSONNEL NO"],
                  RANK:item["RANK"],
                  SURNAME:item["SURNAME"],
                  FIRST_NAME:item["FIRST NAME"],
                  MIDDLE_NAME:item["MIDDLE NAME"],
                  OTHER_NAMES:item["OTHER NAMES"],
                  INITIALS:item["INITIALS"],
                  DATE_OF_BIRTH:item["DATE OF BIRTH"] ? new Date(item["DATE OF BIRTH"]) : null,
                  EMAIL:item["EMAIL ID"],
                  PHONE_NUMBER:String(item["PHONE NO"]),
                  BLOOD_GROUP:item["BLOOD GROUP"],
                  MARITAL_STATUS:item["MARITAL STATUS"],
                  SEX:item["SEX"],
                  RELIGION:item["RELIGION"],
                  ADDRESS:item["ADDRESS"],
                  PLACE_OF_BIRTH:item["PLACE OF BIRTH"],
                  STATE:item["STATE"],
                  LGA:item["LGA"],
                  GEO_POLITICAL_ZONE:item["GEO-POLITICAL ZONE"],
                  NATIONALITY:item["NATIONALITY"],
                  TELEPHONE_NO:String(item["TELEPHONE NO"]),
                  PASSPORT_PHOTOGRAPH:item["PASSPORT"] ? base64ToBuffer(item["PASSPORT"]) : null,
                  PICTURE:item["PICTURE"] ? base64ToBuffer(item["PICTURE"]) : null,
                }, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                console.log(`Inserted: ${item["SURNAME"]} - ${item["PERSONNEL NO"]}`);
              }else{
                continue;
              }
            }
           
            return result?.rowsAffected
    } catch (err) {
        console.error('Error occurred:', err);
        return err;
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

    async getPersonnelCVData(personalNo:string, localPersonnelNo:string){
      let connection =  await connectToDB();
    
        try {
          if(personalNo === localPersonnelNo){
            return [];
          }
          const personalInfoSql = `select * from personal_info where personnel_no=${personalNo}`;
          const bankSql = `select * from account_details where personnel_no=${personalNo}`;
          const nextOfKinSql = `select * from next_of_kin where personnel_no=${personalNo}`;
          const spouseSql = `select * from spouse where personnel_no=${personalNo}`;
          const childrenSql = `select * from children where personnel_no=${personalNo}`;
    
          const personalInfoSqlResult:any = await connection.execute(personalInfoSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
          const bankSqlResult:any = await connection.execute(bankSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
          const nextOfKinResult:any = await connection.execute(nextOfKinSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
          const spouseResult:any = await connection.execute(spouseSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
          const childrenResult:any = await connection.execute(childrenSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });

          return {
            personalInfo: personalInfoSqlResult.rows[0],
            bank: bankSqlResult.rows[0],
            nextOfKin: nextOfKinResult.rows,
            spouse: spouseResult.rows,
            children: childrenResult.rows,
          }
          
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

    async getPersonnelSpecificPersonalInfo(personalNo:string, localPersonnelNo:string){
      let connection =  await connectToDB();

           if(personalNo === localPersonnelNo){
            return [];
          }
    
        try {
          const personalInfoSql = `select * from personal_info where personnel_no='${personalNo}'`;
          const bankSql = `select * from account_details where personnel_no='${personalNo}'`;
          const nextOfKinSql = `select * from next_of_kin where personnel_no='${personalNo}'`;
          const spouseSql = `select * from spouse where personnel_no='${personalNo}'`;
          const childrenSql = `select * from children where personnel_no='${personalNo}'`;
    
          const personalInfoSqlResult:any = await connection.execute(personalInfoSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
          const bankSqlResult:any = await connection.execute(bankSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
          const nextOfKinResult:any = await connection.execute(nextOfKinSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
          const spouseResult:any = await connection.execute(spouseSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
          const childrenResult:any = await connection.execute(childrenSql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });

          return {
            personalInfo: personalInfoSqlResult.rows[0],
            bank: bankSqlResult.rows[0],
            nextOfKin: nextOfKinResult.rows,
            spouse: spouseResult.rows,
            children: childrenResult.rows,
          }
          
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

    async uploadRecords(personalDetailData:PersonalDetailType[]){
      let connection =  await connectToDB();

  try {

    let rows;

    const sql = `INSERT INTO PERSONAL_INFO (
      PERSONNEL_NO,
      RANK,
      SURNAME,
      FIRST_NAME,
      MIDDLE_NAME,
      OTHER_NAMES,
      INITIALS,
      DATE_OF_BIRTH,
      EMAIL,
      PHONE_NUMBER,
      BLOOD_GROUP,
      MARITAL_STATUS,
      SEX,
      RELIGION,
      ADDRESS,
      PLACE_OF_BIRTH,
      STATE,
      LGA,
      GEO_POLITICAL_ZONE,
      NATIONALITY,
      TELEPHONE_NO,
      PASSPORT_PHOTOGRAPH,
      PICTURE
    ) VALUES ( 
      :PERSONNEL_NO,
      :RANK,
      :SURNAME,
      :FIRST_NAME,
      :MIDDLE_NAME,
      :OTHER_NAMES,
      :INITIALS,
      :DATE_OF_BIRTH,
      :EMAIL,
      :PHONE_NUMBER,
      :BLOOD_GROUP,
      :MARITAL_STATUS,
      :SEX,
      :RELIGION,
      :ADDRESS,
      :PLACE_OF_BIRTH,
      :STATE,
      :LGA, 
      :GEO_POLITICAL_ZONE,
      :NATIONALITY,
      :TELEPHONE_NO,
      :PASSPORT_PHOTOGRAPH,
      :PICTURE)`;

    // Divide data into chunks
    for (let i = 0; i < personalDetailData.length; i += CHUNK_SIZE) {

      const chunk = personalDetailData.slice(i, i + CHUNK_SIZE).map(item=>{
        return {
          PERSONNEL_NO:item["PERSONNEL NO"],
          RANK:item["RANK"],
          SURNAME: item["SURNAME"],
          FIRST_NAME: item["FIRST NAME"],
          MIDDLE_NAME: item["MIDDLE NAME"],
          OTHER_NAMES: item["OTHER NAMES"],
          INITIALS: item["INITIALS"],
          DATE_OF_BIRTH: new Date(item["DATE OF BIRTH"]),
          EMAIL: convertToLowerCase(item["EMAIL ID"]),
          PHONE_NUMBER: item["PHONE NO"] ? String(item["PHONE NO"]) : "",
          BLOOD_GROUP: item["BLOOD GROUP"],
          MARITAL_STATUS: item["MARITAL STATUS"],
          SEX: convertToLowerCase(item["SEX"]),
          RELIGION: item["RELIGION"],
          ADDRESS: convertToLowerCase(item["ADDRESS"]),
          PLACE_OF_BIRTH: item["PLACE OF BIRTH"],
          STATE: item["STATE"],
          LGA: item["LGA"],
          GEO_POLITICAL_ZONE: item["GEO-POLITICAL ZONE"],
          NATIONALITY: item["NATIONALITY"],
          TELEPHONE_NO: item["TELEPHONE NO"] ? String(item["TELEPHONE NO"]) : "",
          PASSPORT_PHOTOGRAPH: item["PASSPORT"] ? item["PASSPORT"] : "",
          PICTURE: item["PICTURE"] ? item["PICTURE"] : "" 
        }
      });

      try {
        const options = {
          autoCommit: true,
          bindDefs: {
            PERSONNEL_NO: { type: Oracledb.STRING, maxSize:10 },
            RANK: { type: Oracledb.STRING, maxSize:50 },
            SURNAME: { type: Oracledb.STRING, maxSize:50 },
            FIRST_NAME: { type: Oracledb.STRING, maxSize:50 },
            MIDDLE_NAME: { type: Oracledb.STRING, maxSize:50 },
            OTHER_NAMES: { type: Oracledb.STRING, maxSize:50 },
            INITIALS: { type: Oracledb.STRING, maxSize:20  },
            DATE_OF_BIRTH: { type: Oracledb.DATE },
            EMAIL: { type: Oracledb.STRING, maxSize:70 },
            PHONE_NUMBER: { type: Oracledb.STRING, maxSize:60 },
            BLOOD_GROUP: { type: Oracledb.STRING, maxSize:10 },
            MARITAL_STATUS: { type: Oracledb.STRING, maxSize:30 },
            SEX: { type: Oracledb.STRING, maxSize:10 },
            RELIGION: { type: Oracledb.STRING, maxSize:30 },
            ADDRESS: { type: Oracledb.STRING, maxSize:150 },
            PLACE_OF_BIRTH: { type: Oracledb.STRING, maxSize:50 },
            STATE: { type: Oracledb.STRING, maxSize:30 },
            LGA: { type: Oracledb.STRING, maxSize:50 },
            GEO_POLITICAL_ZONE: { type: Oracledb.STRING, maxSize:50 },
            NATIONALITY: { type: Oracledb.STRING, maxSize:30 },
            TELEPHONE_NO: { type: Oracledb.STRING, maxSize:60 },
            PASSPORT_PHOTOGRAPH: { type: Oracledb.CLOB },
            PICTURE:{ type: Oracledb.CLOB }
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

    async findUserByPersonalNo(personalNo:string, localPersonnelNo:string){
        let connection =  await connectToDB();

             if(personalNo === localPersonnelNo){
              return [];
            }
        
        try {

            const sql = `SELECT * FROM PERSONAL_INFO WHERE PERSONNEL_NO = '${personalNo}'`;
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



async updatePersonnelRecords(userId:string){
    let connection =  await connectToDB();
    
    try {
        const sql = `SELECT * FROM Personnel_tbl WHERE user_id = :1`;
        const result:any = await connection.execute(sql,[userId], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
       
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

async getActiveAndNonActivePersonnelCount(){
    let connection =  await connectToDB();
    
    try {
        const sql = `SELECT
        pi.geo_political_zone,
        SUM(CASE WHEN mi.personnel_status = 'ORGANIC' THEN 1 ELSE 0 END) AS active_count,
        SUM(CASE WHEN mi.personnel_status IN ('VOL RTD', 'DEAD', 'COMP RTD', 'DISS AND JAILED') THEN 1 ELSE 0 END) AS non_active_count,
        SUM(CASE WHEN pi.is_special = 1 THEN 1 ELSE 0 END) AS special_count
    FROM
        personal_info pi
    JOIN
        military_information mi ON pi.personnel_no = mi.personnel_no
    WHERE
        pi.geo_political_zone IN ('NC', 'NE', 'NW', 'SE', 'SS', 'SW')
    GROUP BY
        pi.geo_political_zone`;
        const result:any = await connection.execute(sql,[], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
       
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

async findPersonnelByCriteria(criteria:SearchCriteria, data:string){
  let connection =  await connectToDB();

  
  try {
      const sql = `SELECT * FROM PERSONAL_INFO WHERE ${SearchCriteria[criteria]} = :1`;
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

// async updatePassword(hash:string, userId:string){
//   let connection =  await connectToDB();
  
//   try {
//     const sql = `UPDATE Personnel_tbl SET user_password = :1, has_changed_password = :2 WHERE user_id = :3`;
//     const result: any = await connection.execute(sql, [hash, 1, userId], {autoCommit: true, outFormat: Oracledb.OUT_FORMAT_OBJECT});

//     return result;
      
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


async findAllPersonnel(personalNo:string){
  let connection =  await connectToDB();

  
  try {

      const sql = `SELECT * FROM PERSONAL_INFO`;
      const result = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });

      const data=  result.rows
      const array:any[] = []
      if(data){
        data.map((item:any)=>{
          if(item?.PERSONNEL_NO !== personalNo){
            array.push({...item})
          }
        })

        return array
      }else{
        return array
      }
      
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


async getAllPersonelMgntData(personalNo:string){
  let connection =  await connectToDB();
  
  try {
      const sql = `select pi.personnel_no, pi.rank, pi.initials, pi.surname, pi.first_name, pi.middle_name, pi.sex, mi.personnel_status, pi.marital_status, mi.date_of_enlistment from personal_info pi full outer join military_information mi on pi.personnel_no=mi.personnel_no`;

      const result = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });

      const data=  result.rows
      const array:any[] = []
      if(data){
        data.map((item:any)=>{
          if(item?.PERSONNEL_NO !== personalNo){
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
}

export default new PersonalInfoRepository()