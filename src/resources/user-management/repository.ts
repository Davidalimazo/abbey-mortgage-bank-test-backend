import { connectToDB } from "../../database/connecttodb";
import Oracledb from "oracledb"
import { formatDateToString } from "../../utils/constants";
import flatted from "flatted";

Oracledb.fetchAsString = [ Oracledb.CLOB ];
Oracledb.fetchAsBuffer = [ Oracledb.BLOB ];


class UserManagementRepository{


    async getAllTableName(){
        let connection =  await connectToDB();
        
        try {

            const sql = `select DISTINCT table_name from user_tables`;
            const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_ARRAY, autoCommit:true });
            
            const data = result.rows;

            const array:any[] =[]

            if(data){
              data.forEach((item:Array<string>, idx:number)=>{
                array.push(item[0])
              })

            return array;
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

    async queryFinder(queryData:any){
        let connection =  await connectToDB();
        
        try {

        if(queryData.isFullData){

          //begin download full data

          if(queryData.query.tableName && !queryData.query.columnName && !queryData.query.searchValue && !queryData.query.sex && !queryData.query.zone && !queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            if(queryData.query.tableName.toLowerCase() !== "personal_info"){
              const sql = `SELECT p.rank, p.initials, p.surname, p.first_name, t.* FROM ${queryData.query.tableName} t join personal_info p on t.personnel_no=p.personnel_no`
  

              const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                  
              const data = result.rows;
  
              const array:any[] = []
  
              if(data){ 
                if(Array.isArray(data)){
                  data.forEach(item=>{
                    const {RNUM, ID, USER_PASSWORD, 	HAS_CHANGED_PASSWORD, ...rest} = item;
                    return array.push(rest)
                  })
                  return array
                }
              return data;
              }
  
              return null;
            }else{
              const sql = `SELECT * FROM ${queryData.query.tableName}`
  

              const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                  
              const data = result.rows;
  
              const array:any[] = []
  
              if(data){ 
                if(Array.isArray(data)){
                  data.forEach(item=>{
                    const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
                    return array.push(rest)
                  })
                  return array
                }
              return data;
              }
  
              return null;
            }

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && !queryData.query.sex && !queryData.query.zone && !queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            if(queryData.query.tableName.toLowerCase() === "personal_info"){

             const countSQL = `select * from personal_info where ${queryData.query.columnName}='${queryData.query.searchValue}'`;

             const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                
            const data = countResult.rows;

            const array:any[] = []

            if(data){ 
              if(Array.isArray(data)){
                data.forEach(item=>{
                  const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
                  return array.push(rest)
                })
                return array
              }
            return data;
            }

            return null;

            }else{
              const countSQL = `select p.rank, p.initials, p.surname, p.first_name, t.* from ${queryData.query.tableName} t join personal_info p on 
              t.personnel_no=p.personnel_no where ${queryData.query.columnName}='${queryData.query.searchValue}'`;

             const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                
            const data = countResult.rows;

            const array:any[] = []

            if(data){ 
              if(Array.isArray(data)){
                data.forEach(item=>{
                  const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
                  return array.push(rest)
                })
                return array
              }
            return data;
            }

            return null;
            }


          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && !queryData.query.zone && !queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            if(queryData.query.tableName.toLowerCase() === "personal_info"){
              const sql = `select * from personal_info where  ${queryData.query.columnName}='${queryData.query.searchValue}' AND sex='${queryData.query.sex}'`

              const countResult:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

               
              const data = countResult.rows;
   
              const array:any[] = []
   
              if(data){ 
                if(Array.isArray(data)){
                  data.forEach(item=>{
                     const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
                    return array.push(rest)
                  })
                  return array
                }
              return data;
              }
   
              return null;
            }else{
              const countSQL = `SELECT pi.rank, pi.initials, pi.surname, pi.first_name, 
              ta.* FROM ${queryData.query.tableName} ta JOIN PERSONAL_INFO pi
            
            ON ta.personnel_no=pi.personnel_no where ${queryData.query.columnName}='${queryData.query.searchValue}' AND sex='${queryData.query.sex}'`;

            const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

               
           const data = countResult.rows;

           const array:any[] = []

           if(data){ 
             if(Array.isArray(data)){
               data.forEach(item=>{
                const {RNUM, ID, USER_PASSWORD,	HAS_CHANGED_PASSWORD, ...rest} = item;
                 return array.push(rest)
               })
               return array
             }
           return data;
           }

           return null;
            }

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && queryData.query.zone && !queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            if(queryData.query.tableName.toLowerCase() === "personal_info"){
               //begin table is personal_info
              const sql = `select * from personal_info where  ${queryData.query.columnName}='${queryData.query.searchValue}' AND sex='${queryData.query.sex}' AND geo_political_zone='${queryData.query.zone}'`

              const countResult:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

               
              const data = countResult.rows;
   
              const array:any[] = []
   
              if(data){ 
                if(Array.isArray(data)){
                  data.forEach(item=>{
                    const {RNUM, ID, USER_PASSWORD, 	HAS_CHANGED_PASSWORD, ...rest} = item;
                    return array.push(rest)
                  })
                  return array
                }
              return data;
              }
   
              return null;

               //end table is personal_info
            }else{

               //begin table is not personal_info
              const countSQL = `SELECT pi.rank, pi.initials, pi.surname, pi.first_name, 
              ta.* FROM ${queryData.query.tableName} ta JOIN PERSONAL_INFO pi
            
            ON ta.personnel_no=pi.personnel_no where ${queryData.query.columnName}='${queryData.query.searchValue}' AND sex='${queryData.query.sex}' AND geo_political_zone='${queryData.query.zone}'`;

            const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

               
           const data = countResult.rows;

           const array:any[] = []

           if(data){ 
             if(Array.isArray(data)){
               data.forEach(item=>{
                const {RNUM, ID, USER_PASSWORD, ...rest} = item;
                 return array.push(rest)
               })
               return array
             }
           return data;
           }

           return null;
            }  //end table is not personal_info

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && queryData.query.zone && queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            if(queryData.query.tableName.toLowerCase() === "personal_info"){
             
  
               const sql = `SELECT *
               FROM personal_info p
               INNER JOIN military_information m ON p.personnel_no = m.personnel_no             
               WHERE m.personnel_status = '${queryData.query.status}'
                 AND p.geo_political_zone = '${queryData.query.zone}'
                 AND p.${queryData.query.columnName} = '${queryData.query.searchValue}'`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID,  ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }else{
  
              const sql = `SELECT *
               FROM personal_info p
               INNER JOIN military_information m ON p.personnel_no = m.personnel_no
               INNER JOIN ${queryData.query.tableName} o ON p.personnel_no = o.personnel_no
               WHERE m.personnel_status = '${queryData.query.status}'
                 AND p.geo_political_zone = '${queryData.query.zone}'
                 AND o.${queryData.query.columnName} = '${queryData.query.searchValue}'`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID,  ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && queryData.query.zone && queryData.query.status && queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            const ageInNumber =queryData.query.age;
            const today = new Date();
            const birthDateFrom = new Date(today.getFullYear() - ageInNumber - 1, today.getMonth(), today.getDate());
            const birthDateTo = new Date(today.getFullYear() - ageInNumber, today.getMonth(), today.getDate());

            if(queryData.query.tableName.toLowerCase() === "personal_info" || queryData.query.tableName.toLowerCase() === "military_information"){

              const alias = queryData.query.tableName.toLowerCase() === "personal_info" ? 'p' : 'm';
             
              const countSQL = `SELECT *
              FROM personal_info p
              INNER JOIN military_information m ON p.personnel_no = m.personnel_no
              WHERE m.personnel_status = '${queryData.query.status}'
                AND p.geo_political_zone = '${queryData.query.zone}'
                AND ${alias}.${queryData.query.columnName} = '${queryData.query.searchValue}'
               AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')`
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

                 
             const data = countResult.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID,  ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }else{
              const countSQL = `SELECT *
              FROM personal_info p
              INNER JOIN military_information m ON p.personnel_no = m.personnel_no
              INNER JOIN ${queryData.query.tableName} o ON p.personnel_no = o.personnel_no
              WHERE m.personnel_status = '${queryData.query.status}'
                AND p.geo_political_zone = '${queryData.query.zone}'
                AND o.${queryData.query.columnName} = '${queryData.query.searchValue}'
               AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')`
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = countResult.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID,  ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && queryData.query.zone && queryData.query.status && queryData.query.age && queryData.query.enlistmentYear && !queryData.query.retirementYear){

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && queryData.query.zone && queryData.query.status && queryData.query.age && queryData.query.enlistmentYear && queryData.query.retirementYear){

          }
//end download full data

     }else{
           //begin current data search

          const countSQL = `select count(*) as total from ${queryData.query.tableName}`

          const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

          if(queryData.query.tableName && !queryData.query.columnName && !queryData.query.searchValue && !queryData.query.sex && !queryData.query.zone && !queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            if(queryData.query.tableName.toLowerCase() === "personal_info"){
              const sql = `SELECT *
              FROM (
                SELECT pi.*, ROWNUM AS rnum
                FROM ${queryData.query.tableName} pi
                WHERE ROWNUM <= ${queryData.page.endRow}
              )
              WHERE rnum > ${queryData.page.startRow}`

            const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                
            const data = result.rows;

            const array:any[] = []

            if(data){ 
              if(Array.isArray(data)){
                data.forEach(item=>{
                  const {RNUM, ID,  ...rest} = item;
                  return array.push(rest)
                })
                return {
                  data:array,
                  total:countResult?.rows[0]?.TOTAL
                };
              }
            return data;
            }

            return null;
            }else{
              const sql = `SELECT *
              FROM (
                SELECT p.rank, p.initials, p.surname, p.first_name, 
                pi.*, ROWNUM AS rnum
                FROM ${queryData.query.tableName} pi join personal_info p on 
                pi.personnel_no=p.personnel_no
                WHERE ROWNUM <= ${queryData.page.endRow}
              )
              WHERE rnum > ${queryData.page.startRow}`

            const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                
            const data = result.rows;

            const array:any[] = []

            if(data){ 
              if(Array.isArray(data)){
                data.forEach(item=>{
                  const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
                  return array.push(rest)
                })
                return {
                  data:array,
                  total:countResult?.rows[0]?.TOTAL
                };
              }
            return data;
            }

            return null;
            }

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && !queryData.query.sex && !queryData.query.zone && !queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

             if(queryData.query.tableName.toLowerCase() === "personal_info"){
              //begin table is personal_info
              const countSQL = `select count(*) as total from personal_info where ${queryData.query.columnName}='${queryData.query.searchValue}'`;

             const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

             let arr = [];

             if(countResult?.rows[0]?.TOTAL < 2){

              const singleSQL = `select * from personal_info where ${queryData.query.columnName}='${queryData.query.searchValue}'`;

             const singleResult:any = await connection.execute(singleSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
             arr = singleResult?.rows;
             if(singleResult?.rows.length > 0){
              const {RNUM, ID,  ...rest} = singleResult?.rows[0];
                  arr = [{...rest}]
             }
             }

              const sql = `SELECT *
              FROM (
                SELECT personal_info.*, ROWNUM AS rnum
                  FROM personal_info 
                  WHERE ${queryData.query.columnName} = '${queryData.query.searchValue}' AND
                  ROWNUM <=  ${queryData.page.endRow}
                )
                WHERE rnum > ${queryData.page.startRow}`

            const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                
            const data = result.rows;

            const array:any[] = []

            if(data){ 
              if(Array.isArray(data)){
                data.forEach(item=>{
                  const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
                  return array.push(rest)
                })
                return {
                   total: countResult?.rows[0]?.TOTAL,
                  data: arr.length > 0 ? arr : array            
                };
              }
            return data;
            }

            return null;
             }else{
              //begin table is not personal_info

              const countSQL = `select count(*) as total from ${queryData.query.tableName} where ${queryData.query.columnName}='${queryData.query.searchValue}'`;

             const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

              const sql = `SELECT *
              FROM (
                SELECT p.rank, p.initials, p.surname, p.first_name, 
                 pi.*, ROWNUM AS rnum
                  FROM ${queryData.query.tableName} pi join personal_info p on 
                  pi.personnel_no=p.personnel_no
                  WHERE ${queryData.query.columnName} = '${queryData.query.searchValue}' AND
                  ROWNUM <=  ${queryData.page.endRow}
                )
                WHERE rnum > ${queryData.page.startRow}`

            const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                
            const data = result.rows;

            const array:any[] = []

            if(data){ 
              if(Array.isArray(data)){
                data.forEach(item=>{
                  const {RNUM, ID,  ...rest} = item;
                  return array.push(rest)
                })
                return {
                   total:countResult?.rows[0]?.TOTAL,
                  data:array            
                };
              }
            return data;
            }

            return null;
             } //end table is not personal_info

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && !queryData.query.zone && !queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            if(queryData.query.tableName.toLowerCase() === "personal_info"){
              //begin table is personal_info
              const countSQL = `SELECT count(*) as total

              FROM personal_info where ${queryData.query.columnName}='${queryData.query.searchValue}' AND sex='${queryData.query.sex}'`;
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
               const sql = `SELECT *
               FROM (
                   SELECT personal_info.*, ROWNUM AS rnum
                   FROM personal_info 
                   WHERE ${queryData.query.columnName} = '${queryData.query.searchValue}' AND sex = '${queryData.query.sex}'
               ) subquery_alias
               WHERE rnum BETWEEN ${queryData.page.startRow} AND ${queryData.page.endRow}`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID,  ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;

             //begin table is personal_info

            }else{

              //begin table is not personal_info

              const countSQL = `SELECT count(*) as total

              FROM ${queryData.query.tableName} ta JOIN PERSONAL_INFO pi
              
              ON ta.personnel_no=pi.personnel_no where ${queryData.query.columnName}='${queryData.query.searchValue}' AND sex='${queryData.query.sex}'`;
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
               const sql = `SELECT *
               FROM (
                 SELECT ta.*, ROWNUM AS rnum
                 FROM ${queryData.query.tableName} ta
                 JOIN personal_info pi ON ta.personnel_no = pi.personnel_no
                 WHERE ta.${queryData.query.columnName} = '${queryData.query.searchValue}' AND pi.sex = '${queryData.query.sex}'
               )
               WHERE rnum BETWEEN ${queryData.page.startRow} AND ${queryData.page.endRow}`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID,  ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }  //end table is not personal_info

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && queryData.query.zone && !queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            
            if(queryData.query.tableName.toLowerCase() === "personal_info"){
             
              const countSQL = `SELECT count(*) as total

              FROM personal_info where ${queryData.query.columnName}='${queryData.query.searchValue}' AND sex='${queryData.query.sex}' AND geo_political_zone='${queryData.query.zone}'`;
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
               const sql = `SELECT *
               FROM (
                   SELECT personal_info.*, ROWNUM AS rnum
                   FROM personal_info 
                   WHERE ${queryData.query.columnName} = '${queryData.query.searchValue}' AND sex = '${queryData.query.sex}' AND geo_political_zone='${queryData.query.zone}'
               ) subquery_alias
               WHERE rnum BETWEEN ${queryData.page.startRow} AND ${queryData.page.endRow}`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID, ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }else{
              const countSQL = `SELECT count(*) as total

              FROM ${queryData.query.tableName} ta JOIN PERSONAL_INFO pi
              
              ON ta.personnel_no=pi.personnel_no where ${queryData.query.columnName}='${queryData.query.searchValue}' AND sex='${queryData.query.sex}' AND geo_political_zone='${queryData.query.zone}'`;
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
               const sql = `SELECT *
               FROM (
                 SELECT ta.*, ROWNUM AS rnum
                 FROM ${queryData.query.tableName} ta
                 JOIN personal_info pi ON ta.personnel_no = pi.personnel_no
                 WHERE ta.${queryData.query.columnName} = '${queryData.query.searchValue}' AND pi.sex = '${queryData.query.sex}' AND geo_political_zone='${queryData.query.zone}'
               )
               WHERE rnum BETWEEN ${queryData.page.startRow} AND ${queryData.page.endRow}`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID, ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && queryData.query.zone && queryData.query.status && !queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            
            if(queryData.query.tableName.toLowerCase() === "personal_info" || queryData.query.tableName.toLowerCase() === "military_information"){

              const alias = queryData.query.tableName.toLowerCase() === "personal_info" ? 'p' : 'm';
             
              const countSQL = `SELECT count(*) as total
              FROM personal_info p
              INNER JOIN military_information m ON p.personnel_no = m.personnel_no             
              WHERE m.personnel_status = '${queryData.query.status}'
                AND p.geo_political_zone = '${queryData.query.zone}'
                AND ${alias}.${queryData.query.columnName} = '${queryData.query.searchValue}'`
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
               const sql = `SELECT *
               FROM personal_info p
               INNER JOIN military_information m ON p.personnel_no = m.personnel_no             
               WHERE m.personnel_status = '${queryData.query.status}'
                 AND p.geo_political_zone = '${queryData.query.zone}'
                 AND ${alias}.${queryData.query.columnName} = '${queryData.query.searchValue}'`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID, ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }else{
              const countSQL = `SELECT count(*) as total
              FROM personal_info p
              INNER JOIN military_information m ON p.personnel_no = m.personnel_no
              INNER JOIN ${queryData.query.tableName} o ON p.personnel_no = o.personnel_no
              WHERE m.personnel_status = '${queryData.query.status}'
                AND p.geo_political_zone = '${queryData.query.zone}'
                AND o.${queryData.query.columnName} = '${queryData.query.searchValue}'`
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

  
              const sql = `SELECT *
              FROM (
                SELECT p.*, ROWNUM AS rnum
                FROM (
                  SELECT *
                  FROM personal_info p
                  INNER JOIN military_information m ON p.personnel_no = m.personnel_no
                  INNER JOIN ${queryData.query.tableName} o ON p.personnel_no = o.personnel_no
                  WHERE m.personnel_status = '${queryData.query.status}'
                    AND p.geo_political_zone = '${queryData.query.zone}'
                    AND o.${queryData.query.columnName} = '${queryData.query.searchValue}'
                ) p
                WHERE ROWNUM <= ${queryData.page.endRow}
              )
              WHERE rnum >= ${queryData.page.startRow}`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID, ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }

          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && queryData.query.zone && queryData.query.status && queryData.query.age && !queryData.query.enlistmentYear && !queryData.query.retirementYear){

            const ageInNumber =queryData.query.age;
            const today = new Date();
            const birthDateFrom = new Date(today.getFullYear() - ageInNumber - 1, today.getMonth(), today.getDate());
            const birthDateTo = new Date(today.getFullYear() - ageInNumber, today.getMonth(), today.getDate());

            if(queryData.query.tableName.toLowerCase() === "personal_info" || queryData.query.tableName.toLowerCase() === "military_information"){

              const alias = queryData.query.tableName.toLowerCase() === "personal_info" ? 'p' : 'm';
             
              const countSQL = `SELECT count(*) as total
              FROM personal_info p
              INNER JOIN military_information m ON p.personnel_no = m.personnel_no
              WHERE m.personnel_status = '${queryData.query.status}'
                AND p.geo_political_zone = '${queryData.query.zone}'
                AND ${alias}.${queryData.query.columnName} = '${queryData.query.searchValue}'
               AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')`
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
               const sql = `SELECT *
               FROM (
                 SELECT p.*, ROWNUM AS rnum
                 FROM (
                   SELECT *
                   FROM personal_info p
                   INNER JOIN military_information m ON p.personnel_no = m.personnel_no
                   WHERE m.personnel_status = '${queryData.query.status}'
                     AND p.geo_political_zone = '${queryData.query.zone}'
                     AND ${alias}.${queryData.query.columnName} = '${queryData.query.searchValue}'
                    AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')
                 ) p
                 WHERE ROWNUM <= ${queryData.page.endRow}
               )
               WHERE rnum >= ${queryData.page.startRow}`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID, ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }else{
              const countSQL = `SELECT count(*) as total
              FROM personal_info p
              INNER JOIN military_information m ON p.personnel_no = m.personnel_no
              INNER JOIN ${queryData.query.tableName} o ON p.personnel_no = o.personnel_no
              WHERE m.personnel_status = '${queryData.query.status}'
                AND p.geo_political_zone = '${queryData.query.zone}'
                AND o.${queryData.query.columnName} = '${queryData.query.searchValue}'
               AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')`
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

  
              const sql = `SELECT *
              FROM (
                SELECT p.*, ROWNUM AS rnum
                FROM (
                  SELECT *
                  FROM personal_info p
                  INNER JOIN military_information m ON p.personnel_no = m.personnel_no
                  INNER JOIN ${queryData.query.tableName} o ON p.personnel_no = o.personnel_no
                  WHERE m.personnel_status = '${queryData.query.status}'
                    AND p.geo_political_zone = '${queryData.query.zone}'
                    AND o.${queryData.query.columnName} = '${queryData.query.searchValue}'
                    AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')
                ) p
                WHERE ROWNUM <= ${queryData.page.endRow}
              )
              WHERE rnum >= ${queryData.page.startRow}`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID,  ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }
//current
          }else if(queryData.query.tableName && queryData.query.columnName && queryData.query.searchValue && queryData.query.sex && queryData.query.zone && queryData.query.status && !queryData.query.age && queryData.query.enlistmentYear){
            
            const ageInNumber =queryData.query.age;
            const today = new Date();
            const birthDateFrom = new Date(today.getFullYear() - ageInNumber - 1, today.getMonth(), today.getDate());
            const birthDateTo = new Date(today.getFullYear() - ageInNumber, today.getMonth(), today.getDate());

            if(queryData.query.tableName.toLowerCase() === "personal_info" || queryData.query.tableName.toLowerCase() === "military_information"){

              const alias = queryData.query.tableName.toLowerCase() === "personal_info" ? 'p' : 'm';
             
              const countSQL = `SELECT count(*) as total
              FROM personal_info p
              INNER JOIN military_information m ON p.personnel_no = m.personnel_no
              WHERE m.personnel_status = '${queryData.query.status}'
                AND p.geo_political_zone = '${queryData.query.zone}'
                AND m.date_of_enlistment = '${queryData.query.enlistmentYear}'
                AND ${alias}.${queryData.query.columnName} = '${queryData.query.searchValue}'
               AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')`
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
               const sql = `SELECT *
               FROM (
                 SELECT p.*, ROWNUM AS rnum
                 FROM (
                   SELECT *
                   FROM personal_info p
                   INNER JOIN military_information m ON p.personnel_no = m.personnel_no
                   WHERE m.personnel_status = '${queryData.query.status}'
                     AND p.geo_political_zone = '${queryData.query.zone}'
                     AND m.date_of_enlistment = '${queryData.query.enlistmentYear}'
                     AND ${alias}.${queryData.query.columnName} = '${queryData.query.searchValue}'
                    AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')
                 ) p
                 WHERE ROWNUM <= ${queryData.page.endRow}
               )
               WHERE rnum >= ${queryData.page.startRow}`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID, ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }else{
              const countSQL = `SELECT count(*) as total
              FROM personal_info p
              INNER JOIN military_information m ON p.personnel_no = m.personnel_no
              INNER JOIN ${queryData.query.tableName} o ON p.personnel_no = o.personnel_no
              WHERE m.personnel_status = '${queryData.query.status}'
                AND p.geo_political_zone = '${queryData.query.zone}'
                AND m.date_of_enlistment = '${queryData.query.enlistmentYear}'
                AND o.${queryData.query.columnName} = '${queryData.query.searchValue}'
               AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')`
  
              const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

  
              const sql = `SELECT *
              FROM (
                SELECT p.*, ROWNUM AS rnum
                FROM (
                  SELECT *
                  FROM personal_info p
                  INNER JOIN military_information m ON p.personnel_no = m.personnel_no
                  INNER JOIN ${queryData.query.tableName} o ON p.personnel_no = o.personnel_no
                  WHERE m.personnel_status = '${queryData.query.status}'
                    AND p.geo_political_zone = '${queryData.query.zone}'
                    AND m.date_of_enlistment = '${queryData.query.enlistmentYear}'
                    AND o.${queryData.query.columnName} = '${queryData.query.searchValue}'
                    AND p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')
                ) p
                WHERE ROWNUM <= ${queryData.page.endRow}
              )
              WHERE rnum >= ${queryData.page.startRow}`
  
             const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
                 
             const data = result.rows;
  
             const array:any[] = []
  
             if(data){ 
               if(Array.isArray(data)){
                 data.forEach(item=>{
                  const {RNUM, ID, ...rest} = item;
                   return array.push(rest)
                 })
                 return {
                    total:countResult?.rows[0]?.TOTAL,
                   data:array            
                 };
               }
             return data;
             }
  
             return null;
            }
          }
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

async findTableColumns(columnName:string){
  let connection =  await connectToDB();
  
  try {
      const sql = `select column_name from USER_TAB_COLUMNS where table_name='${columnName}'`;
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_ARRAY });
      const data = result.rows;

      const array:any[] =[]

      if(data){
        data.forEach((item:Array<string>, idx:number)=>{
          array.push(item[0])
        })
      return array;
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

async findIndividualSearchData({
  value,
  tableName,
  columnName,
  endRow,
  startRow,
  isDownload=false,
  isAge,
  age,
  isEnlistmentYear=false
}: {
  isEnlistmentYear:boolean
  value: string;
  tableName: string;
  columnName: string;
  startRow:number,
  endRow:number,
  isDownload:boolean,
  isAge?:boolean,
  age?:number
}){
  let connection =  await connectToDB();
  
  try {

if(isDownload){

if(isEnlistmentYear){
  const countSQL = `SELECT *
  FROM military_information
  WHERE EXTRACT(YEAR FROM date_of_enlistment) = '${value}'`

  const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

    const data = countResult.rows;

    const array:any[] = []

    if(data){ 
      if(Array.isArray(data)){
        data.forEach(item=>{
          const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
          return array.push(rest)
        })
        return {
          data:array            
        };
      }
    return data;
    }

    return null;
}
 else if(tableName.toLowerCase()==='personal_info'){

    if(columnName.toLowerCase() === "date_of_birth" && !isAge){
          
    const countSQL = `SELECT *
    FROM personal_info
    WHERE date_of_birth = TO_DATE('${value}', 'YYYY-MM-DD')`
  
    const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
      const data = countResult.rows;
  
      const array:any[] = []
  
      if(data){ 
        if(Array.isArray(data)){
          data.forEach(item=>{
            const {RNUM, ID, ...rest} = item;
            return array.push(rest)
          })
          return {
            data:array            
          };
        }
      return data;
      }
  
      return null;
    }else if(isAge && age){

    const ageInNumber = age;
    const today = new Date();
    const birthDateFrom = new Date(today.getFullYear() - ageInNumber - 1, today.getMonth(), today.getDate());
    const birthDateTo = new Date(today.getFullYear() - ageInNumber, today.getMonth(), today.getDate());

    const countSQL = `SELECT *
    FROM personal_info p WHERE p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')`

    const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
    const data = countResult.rows;

    const array:any[] = []

    if(data){ 
      if(Array.isArray(data)){
        data.forEach(item=>{
          const {RNUM, ID,  ...rest} = item;
          return array.push(rest)
        })
        return {
          data:array            
        };
      }
    return data;
    }

    return null;

  }
  
  }
  else {
    const countSQL = `SELECT *
    FROM ${tableName}
    WHERE ${columnName} = '${value}'`
  
    const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
      const data = countResult.rows;
  
      const array:any[] = []
  
      if(data){ 
        if(Array.isArray(data)){
          data.forEach(item=>{
            const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
            return array.push(rest)
          })
          return {
            data:array            
          };
        }
      return data;
      }
  
      return null;
  }

}else{

  const ageInNumber = age || 0;
  const today = new Date();
  const birthDateFrom = new Date(today.getFullYear() - ageInNumber - 1, today.getMonth(), today.getDate());
  const birthDateTo = new Date(today.getFullYear() - ageInNumber, today.getMonth(), today.getDate());

  if(isEnlistmentYear){

    const countSQL = `SELECT count(*) as total
    FROM military_information
    WHERE EXTRACT(YEAR FROM date_of_enlistment) = '${value}'`
  
    const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  

    const sql = `SELECT *
    FROM (
      SELECT m.*, ROWNUM AS row_num
      FROM (
        SELECT *
        FROM military_information
        WHERE EXTRACT(YEAR FROM date_of_enlistment) = '${value}'  
      ) m
      WHERE ROWNUM <= ${endRow}
    )
    WHERE row_num >= ${startRow}`
  
    const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
    const data = result.rows;

    const array:any[] = []
   
    if(data){ 
      if(Array.isArray(data)){
        data.forEach(item=>{
          const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
          return array.push(rest)
        })
        return {
           total:countResult?.rows[0]?.TOTAL,
          data:array            
        };
      }
    return data;
    }
   
    return null;
  }

 else if(tableName.toLowerCase()==='personal_info'){
if(columnName.toLowerCase() === "date_of_birth" && !isAge){
  const countSQL = `SELECT count(*) as total
  FROM personal_info
  WHERE date_of_birth = TO_DATE('${value}', 'YYYY-MM-DD')`

  const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

  const sql = `SELECT *
  FROM (
    SELECT p.*, ROWNUM AS rnum
    FROM (
      SELECT *
  FROM personal_info p
  WHERE date_of_birth = TO_DATE('${value}', 'YYYY-MM-DD')
    ) p
    WHERE ROWNUM <= ${endRow}
  )
  WHERE rnum >= ${startRow}`

 const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
     
 const data = result.rows;

 const array:any[] = []

 if(data){ 
   if(Array.isArray(data)){
     data.forEach(item=>{
      const {RNUM, ID, ...rest} = item;
       return array.push(rest)
     })
     return {
        total:countResult?.rows[0]?.TOTAL,
       data:array            
     };
   }
 return data;
 }

 return null;

}
else if(isAge && age){
  const countSQL = `SELECT count(*) as total
  FROM personal_info p
  WHERE p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')`

  const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

  const sql = `SELECT *
  FROM (
    SELECT p.*, ROWNUM AS rnum
    FROM (
      SELECT *
      FROM personal_info p
      WHERE p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')
    ) p
    WHERE ROWNUM <= ${endRow}
  )
  WHERE rnum >= ${startRow}`;

 const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
     
 const data = result.rows;

 const array:any[] = []

 if(data){ 
   if(Array.isArray(data)){
     data.forEach(item=>{
      const {RNUM, ID,  ...rest} = item;
       return array.push(rest)
     })
     return {
        total:countResult?.rows[0]?.TOTAL,
       data:array            
     };
   }
 return data;
 }

 return null;
}
else{
  const countSQL = `SELECT count(*) as total
    FROM ${tableName}
    WHERE ${columnName} = '${value}'`
  
    const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
  
      const sql = `SELECT *
      FROM (
        SELECT t.*, ROWNUM AS row_num
        FROM personal_info t
        WHERE ${columnName} = '${value}'
      )
      WHERE row_num BETWEEN ${startRow} AND ${endRow}
      `;
   
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
      const data = result.rows;
  
      const array:any[] = []
  
      if(data){ 
        if(Array.isArray(data)){
          data.forEach(item=>{
            const {RNUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
            return array.push(rest)
          })
          return {
             total:countResult?.rows[0]?.TOTAL,
            data:array            
          };
        }
      return data;
      }
  
      return null;
}
  }else if(isAge && age){
    const countSQL = `SELECT count(*) as total
    FROM personal_info p
    WHERE p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')`
  
    const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

    const sql = `SELECT *
    FROM (
      SELECT p.*, ROWNUM AS rnum
      FROM (
        SELECT *
        FROM personal_info p
        WHERE p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(birthDateTo)}', 'YYYY-MM-DD')
      ) p
      WHERE ROWNUM <= ${endRow}
    )
    WHERE rnum >= ${startRow}`;

   const result:any = await connection.execute(sql, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
       
   const data = result.rows;

   const array:any[] = []

   if(data){ 
     if(Array.isArray(data)){
       data.forEach(item=>{
        const {RNUM, ID,  ...rest} = item;
         return array.push(rest)
       })
       return {
          total:countResult?.rows[0]?.TOTAL,
         data:array            
       };
     }
   return data;
   }

   return null;
  }
  
  else{
    let countSQL = "";
    let sql = "";

    if(columnName === "All"){
      countSQL = `SELECT count(*) as total
      FROM ${tableName}`;

      sql = `SELECT *
      FROM (
        SELECT t.*, ROWNUM AS row_num
        FROM ${tableName} t
      )
      WHERE row_num BETWEEN ${startRow} AND ${endRow}
      `;
    }else{
      countSQL = `SELECT count(*) as total
      FROM ${tableName}
      WHERE ${columnName} = '${value}'`;

     sql = `SELECT *
      FROM (
        SELECT t.*, ROWNUM AS row_num
        FROM ${tableName} t
        WHERE ${columnName} = '${value}'
      )
      WHERE row_num BETWEEN ${startRow} AND ${endRow}
      `;
    }


  
    const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
  
   
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
      const data = result.rows;
  
      const array:any[] = []
  
      if(data){ 
        if(Array.isArray(data)){
          data.forEach(item=>{
            const {	ROW_NUM, ID, USER_PASSWORD, HAS_CHANGED_PASSWORD, ...rest} = item;
            if(rest?.STATUS !== undefined){
              if(rest.STATUS === 1) {
                rest.STATUS = "Enabled";
              }else{
                rest.STATUS = "Disabled";
              }
            }
            return array.push(rest)
          })
          return {
             total:countResult?.rows[0]?.TOTAL,
            data:array            
          };
        }
      return data;
      }
  
      return null;
  }
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

async findPersonnelByNo({personnelNo, tableName}:{tableName:string, personnelNo:string}){
  let connection =  await connectToDB();
  
  try {
      const sql = `select * from personal_info p JOIN ${tableName} o ON p.personnel_no=o.personnel_no where p.personnel_no='${personnelNo}'`;
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
      const data = result.rows;

      if(data){
      return {
        data,
        total:1
      };
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

// async findRecordOfMilitaryservice(personnelNo:string){
//   let connection =  await connectToDB();
  
//   try {
//       const sql = `select * from personal_info p JOIN military_information o ON p.personnel_no=o.personnel_no where p.personnel_no='${personnelNo}'`;
//       const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT });
//       const data = result.rows;

//       if(data){
//       return {
//         data,
//         total:1
//       };
//       }

//       return null;
      
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

async findPersonnelByPhoneNumber(phoneNumber:string, localUser:string){
  let connection =  await connectToDB();
  
  try {

    const split = phoneNumber.split("/")[0]

    const countSQL = `SELECT count(*) as total
    FROM personal_info
    WHERE phone_number LIKE '%' || '${split}' || '%' OR telephone_no LIKE '%' || '${split}' || '%'`

    const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });


    let query: string = `
    SELECT *
    FROM personal_info
    WHERE phone_number LIKE '%' || '${split}' || '%' OR telephone_no LIKE '%' || '${split}' || '%'`;


    const result: Oracledb.Result<any> = await connection.execute(query, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

      const array:any[] = []

      const data = result.rows
  
      if(data){ 
        if(Array.isArray(data)){
          data.forEach(item=>{
            if(item?.PERSONNEL_NO !== localUser){
              const {RNUM, ID, ...rest} = item;
              return array.push(rest)
            }
          })
          return {
             total:countResult?.rows[0]?.TOTAL,
            data:array            
          };
        }
      return data;
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


async findPersonnelByName(name:string, localUser:string){
  let connection =  await connectToDB();
  
  try {

    const countSQL = `SELECT count(*) as total
    FROM personal_info
    WHERE first_name LIKE '%' || '${name}' || '%' OR middle_name LIKE '%' || '${name}' || '%' OR other_names LIKE '%' || '${name}' || '%'`

    const countResult:any = await connection.execute(countSQL, {}, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

    const searchName: string = name.trim(); // Remove leading/trailing spaces
    const searchTerms: string[] = searchName.split(' ').filter(term => term !== ''); // Split user input by space

    let query: string = `
      SELECT *
      FROM personal_info
      WHERE 1 = 1`;

    const bindVars: { [key: string]: string } = {};
    searchTerms.forEach((term, index) => {
      query += `
        AND (LOWER(first_name) LIKE LOWER(:searchTerm${index})
             OR LOWER(surname) LIKE LOWER(:searchTerm${index})
             OR LOWER(middle_name) LIKE LOWER(:searchTerm${index})
             OR LOWER(other_names) LIKE LOWER(:searchTerm${index}))`;
      bindVars[`searchTerm${index}`] = `%${term}%`;
    });

    const result: Oracledb.Result<any> = await connection.execute(query, bindVars, {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

      const array:any[] = []

      const data = result.rows
  
      if(data){ 
        if(Array.isArray(data)){
          data.forEach(item=>{
            if(item?.PERSONNEL_NO !== localUser){
              const {RNUM, ID,  ...rest} = item;
            return array.push(rest)
            }
          })
          return {
             total:countResult?.rows[0]?.TOTAL,
            data:array            
          };
        }
      return data;
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

async queryRunner(script:string){
  console.log(script)
  let connection =  await connectToDB();
  
  try {

      const result:any = await connection.execute(script, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
      const data = result.rows;

      const array:any[] = []
  
      if(data){ 
        if(Array.isArray(data)){
          data.forEach(item=>{
            const {RNUM, ID,  ...rest} = item;
            return array.push(rest)
          })
          return {
             total:result?.rows?.length,
            data:array            
          };
        }
      return data;
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

async findPersonnelAge(age:string){
  let connection =  await connectToDB();
  
  try {

      // Calculate birth date range based on the provided age
      const ageInNumber = Number(age);
      const today: Date = new Date();
      const birthDateTo: Date = new Date(today.getFullYear() - ageInNumber, today.getMonth(), today.getDate());
      const birthDateFrom: Date = new Date(birthDateTo.getFullYear() - 1, birthDateTo.getMonth(), birthDateTo.getDate());

    const countSQL =`
    SELECT count(*) as total
    FROM personal_info
    WHERE date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(today)}', 'YYYY-MM-DD')
  `

    const countResult:any = await connection.execute(countSQL, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

      const sql = `SELECT *
      FROM personal_info
      WHERE date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(today)}', 'YYYY-MM-DD')`
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
      const data = result.rows;

      const array:any[] = []
  
      if(data){ 
        if(Array.isArray(data)){
          data.forEach(item=>{
            const {RNUM, ID,  ...rest} = item;
            return array.push(rest)
          })
          return {
             total:countResult?.rows[0]?.TOTAL,
            data:array            
          };
        }
      return data;
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


async findPersonnelAgePaginated({age, endRow, startRow}:{age:number, startRow:string, endRow:string}, localUser:string){
  let connection =  await connectToDB();
  
  try {

      // Calculate birth date range based on the provided age
      const ageInNumber = Number(age);
      const today: Date = new Date();
      const birthDateTo: Date = new Date(today.getFullYear() - ageInNumber, today.getMonth(), today.getDate());
      const birthDateFrom: Date = new Date(birthDateTo.getFullYear() - 1, birthDateTo.getMonth(), birthDateTo.getDate());

    const countSQL =`
    SELECT count(*) as total
    FROM personal_info
    WHERE date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(today)}', 'YYYY-MM-DD')
  `

    const countResult:any = await connection.execute(countSQL, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });

      const sql = `SELECT *
      FROM (
        SELECT p.*, ROWNUM AS rnum
        FROM personal_info p
        WHERE p.date_of_birth BETWEEN TO_DATE('${formatDateToString(birthDateFrom)}', 'YYYY-MM-DD') AND TO_DATE('${formatDateToString(today)}', 'YYYY-MM-DD')
          AND ROWNUM <= ${endRow}
      )
      WHERE rnum >= ${startRow}`
      const result:any = await connection.execute(sql, [], {outFormat: Oracledb.OUT_FORMAT_OBJECT, autoCommit:true });
      const data = result.rows;

      const array:any[] = []
  
      if(data){ 
        if(Array.isArray(data)){
          data.forEach(item=>{
            if(item?.PERSONNEL_NO !== localUser){
              const {RNUM, ID,  ...rest} = item;
            return array.push(rest)
            }
          })
          return {
          //   total:countResult?.rows[0]?.TOTAL,
            data:array            
          };
        }
      return data;
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

export default new UserManagementRepository()