import { connectToDB } from "../../database/connecttodb";
import OracleDB from "oracledb"
import {v4 as uuid} from "uuid"
import { AllTableType, PersonalDetailType, SearchCriteria } from "./interface";
import { base64ToBuffer, removeBase64Prefix } from "../../utils/constants";
import NodeCache from 'node-cache';

const myCache = new NodeCache();



class PersonnelRepository{
    async uploadPersonnel(allTableDTO:AllTableType){

          let connection =  await connectToDB();

          try {
        
            for (const item of allTableDTO.personalDetailData) {

              const getPersonnel = await this.findUserByPersonalNo(`'${item["PERSONNEL NO"]}'`);

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
                  STATE,
                  PLACE_OF_BIRTH,
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
                  :STATE,
                  :PLACE_OF_BIRTH,
                  :LGA, 
                  :GEO_POLITICAL_ZONE,
                  :NATIONALITY,
                  :TELEPHONE_NO,
                  :PASSPORT_PHOTOGRAPH,
                  :PICTURE)`;
                
                const result = await connection.execute(sql, {
                  PERSONNEL_NO:item["PERSONNEL NO"],
                  RANK:item["RANK"],
                  SURNAME:item["SURNAME"],
                  FIRST_NAME:item["FIRST NAME"],
                  MIDDLE_NAME:item["MIDDLE NAME"],
                  OTHER_NAMES:item["OTHER NAMES"],
                  INITIALS:item["INITIALS"],
                  DATE_OF_BIRTH: item["DATE OF BIRTH"],
                  EMAIL:item["EMAIL ID"],
                  PHONE_NUMBER:item["PHONE NO"],
                  BLOOD_GROUP:item["BLOOD GROUP"],
                  MARITAL_STATUS:item["MARITAL STATUS"],
                  SEX:item["SEX"],
                  RELIGION:item["RELIGION"],
                  ADDRESS:item["ADDRESS"],
                  STATE:item["STATE"],
                  PLACE_OF_BIRTH: item["PLACE OF BIRTH"],
                  LGA:item["LGA"],
                  GEO_POLITICAL_ZONE:item["GEO-POLITICAL ZONE"],
                  NATIONALITY:item["NATIONALITY"],
                  TELEPHONE_NO:item["TELEPHONE NO"],
                  PASSPORT_PHOTOGRAPH:item["PASSPORT"] ? base64ToBuffer(item["PASSPORT"]) : null,
                  PICTURE:item["PICTURE"] ? base64ToBuffer(item["PICTURE"]) : null,
                }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });
                console.log(`Inserted: ${item["SURNAME"]} - ${item["PERSONNEL NO"]}`);
              }
            }

            for(const item of allTableDTO.accountDetails){

              const sql = `INSERT INTO ACCOUNT_DETAILS (
                PERSONNEL_NO,
                PERSONNEL_FULL_NAME,
                ACCOUNT_NUMBER,
                BANK_NAME,
                BANK_ADDRESS,
                REMARKS) VALUES ( 
                  :PERSONNEL_NO,
                  :PERSONNEL_FULL_NAME,
                  :ACCOUNT_NUMBER,
                  :BANK_NAME,
                  :BANK_ADDRESS,
                  :REMARKS)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    PERSONNEL_FULL_NAME:item["NAME"],
                    ACCOUNT_NUMBER:item["ACCOUNT NUMBER"],
                    BANK_NAME:item["BANK NAME"],
                    BANK_ADDRESS:item["BANK ADDRESS"],
                    REMARKS:item["REMARKS"],
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of [...allTableDTO.nextOfKin.nok1, ...allTableDTO.nextOfKin.nok2]){
              const sql = `INSERT INTO NEXT_OF_KIN (
                PERSONNEL_NO,
                FULL_NAME,
                RELATIONSHIP,
                PHONE_NUMBER,
                EMAIL,
                AUTHORITY_CONFIRMING_NOK) VALUES ( 
                  :PERSONNEL_NO,
                  :FULL_NAME,
                  :RELATIONSHIP,
                  :PHONE_NUMBER,
                  :EMAIL,
                  :AUTHORITY_CONFIRMING_NOK)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO:item["PERSONNEL NO"],
                    FULL_NAME:item["FULL NAME"],
                    RELATIONSHIP:item["RELATIONSHIP"],
                    PHONE_NUMBER:item["TELEPHONE NO"],
                    EMAIL:item["EMAIL ADDRESS"],
                    AUTHORITY_CONFIRMING_NOK:item["AUTHORITY CONFIRMING NOK"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.spouse){
              const sql = `INSERT INTO SPOUSE (
                PERSONNEL_NO,
                FIRST_NAME,
                MAIDEN_NAME,
                NATIONALITY) VALUES ( 
                  :PERSONNEL_NO,
                  :FIRST_NAME,
                  :MAIDEN_NAME,
                  :NATIONALITY)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO:item["PERSONNEL NO"],
                    FIRST_NAME:item["FIRST NAME"],
                    MAIDEN_NAME:item["MAIDEN NAME"],
                    NATIONALITY:item["NATIONALITY"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.children){
              const sql = `INSERT INTO CHILDREN (
                PERSONNEL_NO,
                FIRST_NAME,
                SEX,
                DATE_OF_BIRTH,
                REMARKS) VALUES ( 
                  :PERSONNEL_NO,
                  :FIRST_NAME,
                  :SEX,
                  :DATE_OF_BIRTH,
                  :REMARKS)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO:item["PERSONNEL NO"],
                    FIRST_NAME:item["FIRST NAME"],
                    SEX:item["SEX"],
                    DATE_OF_BIRTH: new Date(item["DATE OF BIRTH"]),
                    REMARKS:item["REMARKS"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.militaryDetailData){
              const sql = `INSERT INTO MILITARY_INFORMATION (
                PERSONNEL_NO,
                PERSONNEL_STATUS,
                EXTENSION_OF_SERVICE,
                AUTHORITY_FOR_EXTENSION_OF_SERVICE,
                UNIT,
                UNIT_COMMANDER,
                FORMATION,
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
                  const result = await connection.execute(sql, {
                          PERSONNEL_NO: item["PERSONNEL NO"],
                          PERSONNEL_STATUS: item["PERSONNEL STATUS"],
                          EXTENSION_OF_SERVICE: new Date(item["EXTENSION OF SERVICE"]),
                          AUTHORITY_FOR_EXTENSION_OF_SERVICE:item["AUTHORITY FOR EXTENSION OF SERVICE"],
                          UNIT: item["UNIT"],
                          UNIT_COMMANDER: item["UNIT COMMANDER"],
                          FORMATION: item["FORMATION"],
                          BRIGADE: item["BRIGADE"],
                          UNIT_LOCATION: item["UNIT LOCATION"],
                          STATE_UNIT_IS_LOCATED: item["STATE UNIT IS LOCATED"],
                          CORPS: item["CORPS"],
                          AUTHORITY_FOR_CHANGE_OF_CORPS:item["AUTHORITY FOR CHANGE OF CORPS"],
                          CHANGE_OF_CORPS_DATE: new Date(item["CHANGE OF CORPS DATE"]),
                          APPOINTMENT: item["APPOINTMENT"],
                          TYPE_OF_COMMISSION: item["TYPE OF COMMISSION"],
                          CONVERSION_OF_COMMISSION_AUTHORITY: item["CONVERSION OF COMMISSION AUTHORITY"],
                          ANTE_DATE_ON_COMMISSION: new Date(item["ANTE-DATE ON COMMISSION"]),
                          CONVERSION_DATE: new Date(item["CONVERSION DATE"]),
                          EFFECTIVE_DATE_OF_LAST_PROMOTION: new Date(item["EFFECTIVE DATE OF LAST PROMOTION"]),
                          LAST_PROMOTION_SIGNATURE_DATE: new Date(item["LAST PROMOTION SIGNATURE DATE"]),
                          DATE_OF_COMMISSION: new Date(item["DATE OF COMMISSION"]),
                          NEXT_DATE_OF_PROMOTION: new Date(item["NEXT DATE OF PROMOTION"]),
                          DATE_TAKEN_ON_STRENGTH_IN_PRESENT_UNIT: new Date(item["DATE TAKEN ON STRENGTH IN PRESENT UNIT"]),
                          POSTING_PROMULGATION: item["POSTING PROMULGATION"],
                          RUN_OUT_DATE: new Date(item["RUN OUT DATE"]),
                          DATE_OF_ENLISTMENT: new Date(item["DATE OF ENLISTMENT"]),
                          MERGER_OF_SERVICE_DATE: new Date(item["MERGER OF SERVICE DATE"]),
                          NDA_COURSE: item["NDA COURSE"],
                          STAFF_COLLEGE_COURSE: item["STAFF COLLEGE COURSE"],
                          NDA_GRADE: item["NDA GRADE"],
                          STAFF_COLLEGE: item["STAFF COLLEGE"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.career){
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
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    SERIAL: item["SERIAL"],
                    UNIT_FROM: item["UNIT FROM"],
                    UNIT_TO: item["UNIT TO"],
                    AUTHORITY: item["AUTHORITY"],
                    RECOMMENDATION_DATE: new Date(item["AUTHORITY"]),
                    REMARKS: item["REMARKS"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.promotionHistory){
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
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO:item["PERSONNEL NO"],
                    RANK: item["RANK"],
                    DATE_OF_LAST_PROMOTION: new Date(item["DATE OF LAST PROMOTION"]),
                    SENIORITY_ON_EACH_RANK: item["SENIORITY ON EACH RANK"],
                    AUTHORITY_ON_EACH_RANK: item["PROMOTION AUTHORITY FOR EACH RANK"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.discipline){

              const sql = `INSERT INTO DISCIPLINARY_RECORDS (
                PERSONNEL_NO,
                OFFENCE,
                REPORTING_AUTHORITY,
                TRYING_OFFICER,
                DATE_TRIED,
                EFFECTIVE_DATE,
                DISPOSE_DATE,
                DATE_ENTERED,
                VERDICT,
                PENALTY,
                REMARKS
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :OFFENCE,
                  :REPORTING_AUTHORITY,
                  :TRYING_OFFICER,
                  :DATE_TRIED,
                  :EFFECTIVE_DATE,
                  :DISPOSE_DATE,
                  :DATE_ENTERED,
                  :VERDICT,
                  :PENALTY,
                  :REMARKS)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    OFFENCE: item["OFFENCE"],
                    REPORTING_AUTHORITY: item["REPORTING AUTHORITY"],
                    TRYING_OFFICER: item["TRYING OFFICER"],
                    DATE_TRIED: new Date(item["DATE TRIED"]),
                    EFFECTIVE_DATE: new Date(item["EFFECTIVE DATE"]),
                    DISPOSE_DATE: new Date(item["DISPOSAL DATE"]),
                    DATE_ENTERED: new Date(item["DATE ENTERED"]),
                    VERDICT: item["VERDICT"],
                    PENALTY: item["PENALTY"],
                    REMARKS: item["REMARKS"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.termination){

              const sql = `INSERT INTO TERMINATE (
                PERSONNEL_NO,
                SOS_DATE,
                TERMINAL_DATE,
                EFFECTIVE_DATE,
                TYPE_OF_TERMINATE
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :SOS_DATE,
                  :TERMINAL_DATE,
                  :EFFECTIVE_DATE,
                  :TYPE_OF_TERMINATE)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    SOS_DATE: new Date(item["SOS DATE"]),
                    TERMINAL_DATE: new Date(item["TERMINAL DATE"]),
                    EFFECTIVE_DATE: new Date(item["EFFECTIVE DATE"]),
                    TYPE_OF_TERMINATE: item["TYPE OF TERMINATION"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.academic){

              const sql = `INSERT INTO ACADEMIC_QUALIFICATION (
                PERSONNEL_NO,
                SCHOOL_ATTENDED,
                CERTIFICATE_OBTAINED,
                ADDRESS,
                COURSE,
                AUTHORITY
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :SCHOOL_ATTENDED,
                  :CERTIFICATE_OBTAINED,
                  :ADDRESS,
                  :COURSE,
                  :AUTHORITY)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    SCHOOL_ATTENDED: item["SCHOOL ATTENDED"],
                    CERTIFICATE_OBTAINED: item["QUALIFICATION OBTAINED"],
                    ADDRESS: item["ADDRESS"],
                    COURSE: item["COURSE"],
                    AUTHORITY: item["AUTHORITY"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.militaryQualification){

              const sql = `INSERT INTO MILITARY_QUALIFICATION (
                PERSONNEL_NO,
                CERTIFICATE,
                GRADE,
                SCHOOL_NAME,
                SCHOOL_ADDRESS,
                AUTHORITY
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :CERTIFICATE,
                  :GRADE,
                  :SCHOOL_NAME,
                  :SCHOOL_ADDRESS,
                  :AUTHORITY)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    CERTIFICATE: item["COURSE ATTENDED"],
                    GRADE: item["GRADE"],
                    SCHOOL_NAME: item["NAME OF SCHOOL"],
                    SCHOOL_ADDRESS: item["LOCATION"],
                    AUTHORITY: item["AUTHORITY"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.professionalMembership){

              const sql = `INSERT INTO PROFESSIONAL_MEMBERSHIP (
                PERSONNEL_NO,
                CERTIFICATE,
                PROFESSIONAL_BODY,
                MEMBERSHIP_NO,
                STATUS,
                REGISTRATION_DATE,
                AUTHORITY
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :CERTIFICATE,
                  :PROFESSIONAL_BODY,
                  :MEMBERSHIP_NO,
                  :STATUS,
                  :REGISTRATION_DATE,
                  :AUTHORITY)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    CERTIFICATE: item["CERTIFICATE"],
                    PROFESSIONAL_BODY: item["PROFESSIONAL BODY"],
                    MEMBERSHIP_NO: item["MEMBERSHIP NO"],
                    STATUS: item["STATUS"] && item["STATUS"].toLowerCase() === "yes" ? 1 : 0 ,
                    REGISTRATION_DATE: new Date(item["REGISTRATION DATE"]),
                    AUTHORITY: item["AUTHORITY"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
    for(const item of allTableDTO.awol){

              const sql = `insert into awol (personnel_no, effective_date_of_awol, authority, effective_date_of_awol_cancellation, awol_cancellation_authority)
              VALUES('${item["PERSONNEL NO"]}', TO_DATE('${item["EFFECTIVE DATE OF AWOL"]}', 'DD-MM-YYYY'), '${item["AUTHORITY"]}', TO_DATE('${item["EFFECTIVE DATE OF AWOL CANCELLATION"]}', 'DD-MM-YYYY'), '${item["AWOL CANCELLATION AUTHORITY"]}')`;
                  const result = await connection.execute(sql, {}, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }

             for(const item of allTableDTO.casaulty){

              const sql = `INSERT INTO CASUALTY (
                PERSONNEL_NO,
                DATE_OF_DEATH,
                CAUSE_OF_DEATH,
                AUTHORITY,
                REMARKS
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :DATE_OF_DEATH,
                  :CAUSE_OF_DEATH,
                  :AUTHORITY,
                  :REMARKS)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    DATE_OF_DEATH: new Date(item["DATE OF DEATH"]),
                    CAUSE_OF_DEATH: item["CAUSE OF DEATH"],
                    AUTHORITY: item["AUTHORITY"],
                    REMARKS: item["REMARKS"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            for(const item of allTableDTO.language){

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
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    LANGUAGE1: item["LANGUAGE 1"],
                    LANGUAGE2: item["LANGUAGE 2"],
                    LANGUAGE3: item["LANGUAGE 3"],
                    LANGUAGE4: item["LANGUAGE 4"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }

            for(const item of allTableDTO.consultancy){

              const sql = `INSERT INTO CONSULTANCY (
                PERSONNEL_NO,
                TYPE_OF_CONSULTANCY,
                PROFESSION
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :TYPE_OF_CONSULTANCY,
                  :PROFESSION)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    TYPE_OF_CONSULTANCY: item["TYPE OF CONSULTANT"],
                    PROFESSION: item["PROFESSION"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }

            for(const item of allTableDTO.promotionAttempt){

              const sql = `INSERT INTO PROMOTION_ATTEMPT (
                PERSONNEL_NO,
                PROMOTION_ATTEMPT,
                ATTEMPT_DATE,
                AUTHORITY_DATE,
                AUTHORITY
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :PROMOTION_ATTEMPT,
                  :ATTEMPT_DATE,
                  :AUTHORITY_DATE,
                  :AUTHORITY)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    PROMOTION_ATTEMPT: item["PROMOTION ATTEMPT"],
                    ATTEMPT_DATE: new Date(item["ATTEMPT DATE"]),
                    AUTHORITY_DATE: new Date(item["AUTHORITY DATE"]),
                    AUTHORITY: item["AUTHORITY"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }

            for(const item of allTableDTO.honours){

              const sql = `INSERT INTO HONOURS_AND_AWARDS (
                PERSONNEL_NO,
                AWARD,
                AWARD_DATE,
                AUTHORITY
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :AWARD,
                  :AWARD_DATE,
                  :AUTHORITY)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    AWARD: item["AWARD"],
                    AWARD_DATE: new Date(item["AWARD DATE"]),
                    AUTHORITY: item["AUTHORITY"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }

            for(const item of allTableDTO.operation){

              const sql = `INSERT INTO OPERATIONS (
                PERSONNEL_NO,
                NAME_OF_OPERATION,
                START_DATE,
                END_DATE
                ) VALUES ( 
                  :PERSONNEL_NO,
                  :NAME_OF_OPERATION,
                  :START_DATE,
                  :END_DATE)`;
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    NAME_OF_OPERATION: item["NAME OF OPERATION"],
                    START_DATE: new Date(item["START DATE"]),
                    END_DATE: new Date(item["END DATE"])
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }

            for(const item of allTableDTO.careerReview){

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
                  const result = await connection.execute(sql, {
                    PERSONNEL_NO: item["PERSONNEL NO"],
                    RECOMMENDATION_DATE: new Date(item["RECOMMENDATION DATE"]),
                    AUTHORITY: item["AUTHORITY "],
                    STATUS: item["STATUS"]
                  }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true })
            }
            
            return "success";
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

    async createPersonalDetails(personalDetailDTO:PersonalDetailType){

        let connection =  await connectToDB();

    try {
        
      const sql = `INSERT INTO PERSONAL_INFO (
        PERSONNEL_NO,
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
        STATE,
        LGA,
        GEO_POLITICAL_ZONE,
        NATIONALITY,
        TELEPHONE_NO,
        PASSPORT_PHOTOGRAPH,
        PICTURE
      ) VALUES ( 
        :PERSONNEL_NO,
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
        :STATE,
        :LGA,
        :GEO_POLITICAL_ZONE,
        :NATIONALITY,
        :TELEPHONE_NO,
        :PASSPORT_PHOTOGRAPH,
        :PICTURE)`;
      
      const result = await connection.execute(sql, {
        PERSONNEL_NO:personalDetailDTO["PERSONNEL NO"],
        SURNAME:personalDetailDTO["SURNAME"],
        FIRST_NAME:personalDetailDTO["FIRST NAME"],
        MIDDLE_NAME:personalDetailDTO["MIDDLE NAME"],
        OTHER_NAMES:personalDetailDTO["OTHER NAMES"],
        INITIALS:personalDetailDTO["INITIALS"],
        DATE_OF_BIRTH:new Date(personalDetailDTO["DATE OF BIRTH"]),
        EMAIL:personalDetailDTO["EMAIL ID"],
        PHONE_NUMBER:personalDetailDTO["PHONE NO"],
        BLOOD_GROUP:personalDetailDTO["BLOOD GROUP"],
        MARITAL_STATUS:personalDetailDTO["MARITAL STATUS"],
        SEX:personalDetailDTO["SEX"],
        RELIGION:personalDetailDTO["RELIGION"],
        ADDRESS:personalDetailDTO["ADDRESS"],
        STATE:personalDetailDTO["STATE"],
        LGA:personalDetailDTO["LGA"],
        GEO_POLITICAL_ZONE:personalDetailDTO["GEO-POLITICAL ZONE"],
        NATIONALITY:personalDetailDTO["NATIONALITY"],
        TELEPHONE_NO:personalDetailDTO["TELEPHONE NO"],
        PASSPORT_PHOTOGRAPH: personalDetailDTO["PASSPORT"] ? personalDetailDTO["PASSPORT"] : "",
        PICTURE:personalDetailDTO["PICTURE"] ? personalDetailDTO["PICTURE"] : ""
      }, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });
      console.log(`Inserted: ${personalDetailDTO["SURNAME"]} - ${personalDetailDTO["FIRST NAME"]}`);
    
        return result.rows
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

    async findUserByPersonalNo(personalNo:string){
        let connection =  await connectToDB();
        console.log(personalNo)
        
        try {
            const sql = `SELECT * FROM PERSONAL_INFO WHERE PERSONNEL_NO = ${personalNo}`;
            const result:any = await connection.execute(sql, {}, {outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit:true });

            
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

async findPersonnelByCriteria(criteria:SearchCriteria, data:string){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM PERSONAL_INFO WHERE ${SearchCriteria[criteria]} = :1`;
      const result:any = await connection.execute(sql,[data], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
    
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
async getGeopoliticalZoneCount(){
  let connection =  await connectToDB();

  try {
    const sql = `select geo_political_zone, COUNT(*) AS zone_count
    FROM personal_info
    GROUP BY geo_political_zone
    order by 1 asc`;
    const result:any = await connection.execute(sql,[], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
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

async findPersonnelActiveNonActivePostingAndRetirementCount(){
  let connection =  await connectToDB();

    try {

      const totalSql = `select count(*) as total from personal_info`;
      const totalResult:any = await connection.execute(totalSql,[], {outFormat: OracleDB.OUT_FORMAT_OBJECT });

      const personnelstatusCountSql = `SELECT
      CASE 
        WHEN mi.personnel_status IN ('VOL RTD', 'DEAD', 'COMP RTD', 'DISS AND JAILED', 'DESERTER', 'AWOL/SOS') THEN 'NonActive'
        WHEN mi.personnel_status = 'ORGANIC' THEN 'Active'
      END AS status_category,
      pi.sex AS gender,
      COUNT(*) AS status_count
    FROM
      military_information mi
    JOIN
      personal_info pi ON mi.personnel_no = pi.personnel_no
    WHERE
      mi.personnel_status IN ('VOL RTD', 'DEAD', 'COMP RTD', 'ORGANIC', 'DISS AND JAILED', 'DESERTER', 'AWOL/SOS')
      AND pi.sex IN ('male', 'female')
    GROUP BY
      CASE 
        WHEN mi.personnel_status IN ('VOL RTD', 'DEAD', 'COMP RTD', 'DISS AND JAILED', 'DESERTER', 'AWOL/SOS') THEN 'NonActive'
        WHEN mi.personnel_status = 'ORGANIC' THEN 'Active'
      END,
      pi.sex`;
      const statusResult:any = await connection.execute(personnelstatusCountSql,[], {outFormat: OracleDB.OUT_FORMAT_OBJECT });

      const retirementSql = `SELECT
      COUNT(CASE WHEN pi.sex = 'male' THEN 1 END) AS male_count,
      COUNT(CASE WHEN pi.sex = 'female' THEN 1 END) AS female_count
  FROM
      personal_info pi
  JOIN
      military_information mi ON pi.personnel_no = mi.personnel_no
  WHERE
      (ROUND(MONTHS_BETWEEN(CURRENT_DATE, pi.date_of_birth) / 12) >= 65
          OR ROUND(MONTHS_BETWEEN(CURRENT_DATE, mi.date_of_enlistment) / 12) >= 35
          OR ROUND(MONTHS_BETWEEN(CURRENT_DATE, mi.date_of_commission) / 12) >= 35)
          AND mi.personnel_status = 'ORGANIC'
      AND pi.sex IN ('male', 'female')`;
      const retirementResult:any = await connection.execute(retirementSql,[], {outFormat: OracleDB.OUT_FORMAT_OBJECT });

      const retirementDataSql = `SELECT
      *
  FROM
      personal_info pi
  JOIN
      military_information mi ON pi.personnel_no = mi.personnel_no
  WHERE
      (ROUND(MONTHS_BETWEEN(CURRENT_DATE, pi.date_of_birth) / 12) >= 65
          OR ROUND(MONTHS_BETWEEN(CURRENT_DATE, mi.date_of_enlistment) / 12) >= 35
          OR ROUND(MONTHS_BETWEEN(CURRENT_DATE, mi.date_of_commission) / 12) >= 35)
          AND mi.personnel_status = 'ORGANIC'
      AND pi.sex IN ('male', 'female')`;
      const retirementDataResult:any = await connection.execute(retirementDataSql,[], {outFormat: OracleDB.OUT_FORMAT_OBJECT });


      const postingCountSql = `SELECT
      COUNT(CASE WHEN pi.sex = 'male' THEN 1 END) AS male_count,
      COUNT(CASE WHEN pi.sex = 'female' THEN 1 END) AS female_count
      FROM
          posting ph
      JOIN
          personal_info pi ON ph.personnel_no = pi.personnel_no`;
      const postingCount:any = await connection.execute(postingCountSql,[], {outFormat: OracleDB.OUT_FORMAT_OBJECT });

      const postingDataSql = `SELECT
      *
      FROM
          posting ph
      JOIN
          personal_info pi ON ph.personnel_no = pi.personnel_no`;
      const postingDataResult:any = await connection.execute(postingDataSql,[], {outFormat: OracleDB.OUT_FORMAT_OBJECT });

      return {
        statusCount: statusResult.rows,
        postingCount: {postingCount: postingCount.rows[0], data:postingDataResult.rows},
        retirementCount: {retirementCount:retirementResult.rows[0], data:retirementDataResult.rows},
        total:totalResult.rows[0]?.TOTAL
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

// async updatePassword(hash:string, userId:string){
//   let connection =  await connectToDB();
  
//   try {
//     const sql = `UPDATE Personnel_tbl SET user_password = :1, has_changed_password = :2 WHERE user_id = :3`;
//     const result: any = await connection.execute(sql, [hash, 1, userId], {autoCommit: true, outFormat: OracleDB.OUT_FORMAT_OBJECT});

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


async findAllPersonnel(localUser:string){
  let connection =  await connectToDB();
  
  try {
      const sql = `SELECT * FROM PERSONAL_INFO`;
      const result:any = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
      const rows:any = [];

      result.rows.forEach((data:any)=>{
        if(localUser !== data?.PERSONNEL_NO){
          const {PASSPORT_PHOTOGRAPH, PICTURE, ...rest} = data;
        rows.push(rest);
        }
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

async findPendingRetirementCount(){
  let connection =  await connectToDB();

    try {
      const sql = `SELECT
      COUNT(CASE WHEN pi.sex = 'male' THEN 1 END) AS male_count,
      COUNT(CASE WHEN pi.sex = 'female' THEN 1 END) AS female_count
  FROM
      personal_info pi
  JOIN
      military_information mi ON pi.personnel_no = mi.personnel_no
  WHERE
      (ROUND(MONTHS_BETWEEN(CURRENT_DATE + INTERVAL '6' MONTH, pi.date_of_birth) / 12) >= 65
          OR ROUND(MONTHS_BETWEEN(CURRENT_DATE + INTERVAL '6' MONTH, mi.date_of_enlistment) / 12) >= 35
          OR ROUND(MONTHS_BETWEEN(CURRENT_DATE + INTERVAL '6' MONTH, mi.date_of_commission) / 12) >= 35)
          AND mi.personnel_status = 'ORGANIC'
      AND pi.sex IN ('male', 'female')`;
      const result:any = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
  
      const sqlData = `SELECT
      *
  FROM
      personal_info pi
  JOIN
      military_information mi ON pi.personnel_no = mi.personnel_no
  WHERE
      (ROUND(MONTHS_BETWEEN(CURRENT_DATE + INTERVAL '6' MONTH, pi.date_of_birth) / 12) >= 65
          OR ROUND(MONTHS_BETWEEN(CURRENT_DATE + INTERVAL '6' MONTH, mi.date_of_enlistment) / 12) >= 35
          OR ROUND(MONTHS_BETWEEN(CURRENT_DATE + INTERVAL '6' MONTH, mi.date_of_commission) / 12) >= 35)
          AND mi.personnel_status = 'ORGANIC'
      AND pi.sex IN ('male', 'female')`;
      const resultData:any = await connection.execute(sqlData, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
  
      return {count:result.rows[0], data:resultData.rows}
      
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


async getAllPersonelMgntData(){
  let connection =  await connectToDB();


    try {
      const sql = `select pi.personnel_no, pi.surname, pi.first_name, pi.middle_name, pi.marital_status, pi.rank, pi.sex, mi.personnel_status, mi.date_of_enlistment from personal_info pi full outer join military_information mi on pi.personnel_no=mi.personnel_no`;

      const result = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });

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


async getAllPersonelMgntDataByQuery(startRow:number, endRow:number){
  let connection =  await connectToDB();

    try {
      const countSql = `select count(personnel_no) as total from personal_info`;

      const result:any = await connection.execute(countSql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });

      const sql = `SELECT *
      FROM (
        SELECT
          p.personnel_no,
          p.surname,
          p.first_name,
          p.middle_name,
          p.marital_status,
          p.rank,
          p.sex,
          mi.personnel_status,
          mi.date_of_enlistment,
          ROW_NUMBER() OVER (ORDER BY p.personnel_no) AS row_num
        FROM personal_info p
        JOIN military_information mi ON p.personnel_no = mi.personnel_no
      )
      WHERE row_num BETWEEN ${startRow} AND ${endRow}`;
      const res:any = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
  
      return {
        total:result.rows[0],
        record: res.rows
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


async getPersonelMgntData(personalNo:string){
  let connection =  await connectToDB();

    try {
      const sql = `select pi.personnel_no, pi.surname, pi.first_name, pi.middle_name, pi.marital_status, pi.rank, pi.sex, mi.personnel_status, 
      mi.date_of_enlistment from personal_info pi full outer join 
      military_information mi on pi.personnel_no=mi.personnel_no where mi.personnel_no=${personalNo}`;

      const result:any = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
     
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


async getRankCountData(){
  let connection =  await connectToDB();


    try {
      const sql = `select rank, count(rank) as "STRENGTH" from personal_info group by rank order by 2`;

      const result = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
      
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


async getActiveCorpsCountData(){
  let connection =  await connectToDB();

    try {
      const sql = `select corps, count(personnel_status) as "ACTIVE_COPRS" from military_information where personnel_status='ORGANIC' group by corps order by 2`;

      const result = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });
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


async getTypeOfCommissionCountData(){
  let connection =  await connectToDB();

    try {
      const sql = `select type_of_commission, count(type_of_commission) as "STRENGHT_BY_TYPE" from military_information group by type_of_commission order by 2`;

      const result = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });

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


async findNewCommissionedCount(){
  let connection =  await connectToDB();

    try {
      const sql = `SELECT
      COUNT(CASE WHEN p.sex = 'male' THEN 1 END) AS male_count,
      COUNT(CASE WHEN p.sex = 'female' THEN 1 END) AS female_count
  FROM
      military_information m
  JOIN
      personal_info p ON m.personnel_no = p.personnel_no
  WHERE
      EXTRACT(YEAR FROM m.date_of_commission) = EXTRACT(YEAR FROM SYSDATE)`;

      const result:any = await connection.execute(sql, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT });

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
}

export default new PersonnelRepository()