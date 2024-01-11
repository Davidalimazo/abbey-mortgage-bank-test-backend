
export interface AllTableType {
	personalDetailData: PersonalDetailType[];
	accountDetails: AccountDetailsType[];
	nextOfKin: {
		nok1: NextOfKinType[];
		nok2:  NextOfKinType[];
	};
	spouse: SpouseType[];
	children: ChildrenType[];
	militaryDetailData: MilitaryDetailType[];
	career: CareerType[];
	promotionHistory: PromotionHistoryType[];
	discipline: DisciplineType[];
	termination: TerminationType[];
	academic: AcademicType[];
	militaryQualification: MilitaryQualificationType[];
	professionalMembership: ProfessionalMembershipType[];
	awol: AwolType[];
	casaulty: CasaultyType[];
	language: LanguageType[];
	consultancy: ConsultancyType[];
	promotionAttempt: PromotionAttemptType[];
	operation: OperationType[];
	honours: HonoursType[];
	careerReview: CareerReviewType[];
}

export interface PersonalDetailType {
	"PERSONNEL NO": string;
	SURNAME: string;
	"FIRST NAME": string;
	"MIDDLE NAME": string;
	"OTHER NAMES": string;
	INITIALS: string;
	"DATE OF BIRTH": string;
	"EMAIL ID": string;
	"PHONE NO": string;
	"BLOOD GROUP": string;
	"MARITAL STATUS": string;
	"PLACE OF BIRTH":string;
	SEX: "Male" | "Female";
	RELIGION: "Christianity" | "Islam";
	ADDRESS: string;
	STATE: string;
	LGA: string;
	"GEO-POLITICAL ZONE": string;
	NATIONALITY: string;
	"TELEPHONE NO": string;
	PASSPORT?: string;
	PICTURE?: string;
	RANK:string;
}
 ;

export interface AccountDetailsType {
 
	"PERSONNEL NO": string;
	NAME: string;
	"ACCOUNT NUMBER": string;
	"BANK ADDRESS": string;
	REMARKS: string;
	"BANK NAME": string;
}
 ;

export interface NextOfKinType {
 
	"FULL NAME": string;
	RELATIONSHIP: string;
	"TELEPHONE NO": string;
	"EMAIL ADDRESS": string;
	ADDRESS: string;
	"AUTHORITY CONFIRMING NOK": string;
	"PERSONNEL NO": string;
}
 ;

export interface SpouseType {
 
	"FIRST NAME": string;
	"MAIDEN NAME": string;
	"PHONE NO": string;
	NATIONALITY: string;
	ADDRESS: string;
	REMARKS: string;
	"PERSONNEL NO": string;
}
 ;

export interface ChildrenType {
 
	"FIRST NAME": string;
	SEX: string;
	"DATE OF BIRTH": string;
	"PERSONNEL NO": string;
	REMARKS: string;
}
 ;

export interface MilitaryDetailType {
 
	"PERSONNEL NO": string;
	"PERSONNEL STATUS": string;
	"EXTENSION OF SERVICE": string;
	"AUTHORITY FOR EXTENSION OF SERVICE": string;
	UNIT: string;
	"UNIT COMMANDER": string;
	FORMATION: string;
	BRIGADE: string;
	"UNIT LOCATION": string;
	"STATE UNIT IS LOCATED": string;
	CORPS: string;
	"AUTHORITY FOR CHANGE OF CORPS": string;
	"CHANGE OF CORPS DATE": string;
	"CHANGE OF CORPS": string;
	APPOINTMENT: string;
	"TYPE OF COMMISSION": string;
	"CONVERSION OF COMMISSION AUTHORITY": string;
	"ANTE-DATE ON COMMISSION": string;
	"CONVERSION DATE": string;
	"EFFECTIVE DATE OF LAST PROMOTION": string;
	"LAST PROMOTION SIGNATURE DATE": string;
	"DATE OF COMMISSION": string;
	"NEXT DATE OF PROMOTION": string;
	"DATE TAKEN ON STRENGTH IN PRESENT UNIT": string;
	"POSTING PROMULGATION": string;
	"RUN OUT DATE": string;
	"DATE OF ENLISTMENT": string;
	"MERGER OF SERVICE DATE": string;
	"NDA COURSE": string;
	"STAFF COLLEGE COURSE": string;
	"NDA GRADE": string;
	"STAFF COLLEGE": string;
}
 ;

export interface CareerType {
 
	"PERSONNEL NO": string;
	"UNIT FROM": string;
	"SERIAL": string;
	"UNIT TO": string;
	NAME: string;
	RANK: string;
	"RECOMMENDATION DATE": string;
	REMARKS: string;
	AUTHORITY: string;
}
 ;

export interface PromotionHistoryType {
	"PERSONNEL NO": string;
	RANK: string;
	"DATE OF LAST PROMOTION": string;
	"SENIORITY ON EACH RANK": string;
	"PROMOTION AUTHORITY FOR EACH RANK": string;
}
 ;

export interface DisciplineType {
 
	"PERSONNEL NO": string;
	OFFENCE: string;
	"REPORTING AUTHORITY": string;
	"TRYING OFFICER": string;
	"DATE TRIED": string;
	"EFFECTIVE DATE": string;
	"DISPOSAL DATE": string;
	VERDICT: string;
	"DATE ENTERED": string;
	REMARKS: string;
	PENALTY: string;
}
 ;

export interface TerminationType {
 
	"PERSONNEL NO": string;
	"SOS DATE": string;
	"TERMINAL DATE": string;
	"EFFECTIVE DATE": string;
	"TYPE OF TERMINATION": string;
}
 ;

export interface AcademicType {
 
	"PERSONNEL NO": string;
	"SCHOOL ATTENDED": string;
	"QUALIFICATION OBTAINED": string;
	"DATE STARTED": string;
	"DATE ENDED": string;
	COURSE: string;
	ADDRESS: string;
	AUTHORITY: string;
}
 ;

export interface MilitaryQualificationType {
 
	"PERSONNEL NO": string;
	"COURSE ATTENDED": string;
	GRADE: string;
	"DATE STARTED": string;
	"DATE ENDED": string;
	"NAME OF SCHOOL": string;
	LOCATION: string;
	AUTHORITY: string;
}
 ;

export interface ProfessionalMembershipType {
 
	"PERSONNEL NO": string;
	CERTIFICATE: string;
	"PROFESSIONAL BODY": string;
	"MEMBERSHIP NO": string;
	"STATUS": string;
	"REGISTRATION DATE": string;
	AUTHORITY: string;
}
 ;

export interface AwolType {
 
	"PERSONNEL NO": string;
	"EFFECTIVE DATE OF AWOL": string;
	"AWOL AUTHORITY": string;
	"EFFECTIVE DATE OF AWOL CANCELLATION": string;
	"AWOL CANCELLATION AUTHORITY": string;
	AUTHORITY:String;
}
 ;

 export interface CasaultyType {
 
	"PERSONNEL NO": string;
	"DATE OF DEATH": string;
	"CAUSE OF DEATH": string;
	AUTHORITY: string;
	REMARKS: string;
}
 ;

export interface LanguageType {
 
	"PERSONNEL NO": string;
	"LANGUAGE 1": string;
	"LANGUAGE 2": string;
	"LANGUAGE 3": string;
	"LANGUAGE 4": string;
}
 ;

export interface ConsultancyType {
 
	"PERSONNEL NO": string;
	"TYPE OF CONSULTANT": string;
	PROFESSION: string;
}
 ;

export interface PromotionAttemptType {
 
	"PERSONNEL NO": string;
	"PROMOTION ATTEMPT": 23;
	"ATTEMPT DATE": string;
	"AUTHORITY DATE": string;
	AUTHORITY: string;
}
 ;

export interface OperationType {
 
	"PERSONNEL NO": string;
	"NAME OF OPERATION": string;
	"START DATE": string;
	"END DATE": string;
}
 ;

export interface HonoursType {
 
	"PERSONNEL NO": string;
	AWARD: string;
	"AWARD DATE": string;
	"AWARD ABBR": string;
	AUTHORITY: string;
}
 ;

export interface CareerReviewType {
 
	"PERSONNEL NO": string;
	"RECOMMENDATION DATE": string;
	"AUTHORITY ": string;
	STATUS: string;
}
 ;

 export enum SearchCriteria{
	PERSONNEL_NO="PERSONNEL_NO",
	SURNAME="SURNAME",
	FIRST_NAME="FIRST_NAME",
	MIDDLE_NAME = "MIDDLE_NAME",
	OTHER_NAMES = "OTHER_NAMES",
	INITIALS = "INITIALS",
	DATE_OF_BIRTH = "DATE_OF_BIRTH",
	EMAIL = "EMAIL",
	PHONE_NUMBER = "PHONE_NUMBER",
	BLOOD_GROUP = "BLOOD_GROUP",
	MARITAL_STATUS = "MARITAL_STATUS",
	SEX = "SEX",
	RELIGION = "RELIGION",
	ADDRESS = "ADDRESS",
	STATE = "STATE",
	LGA = "LGA",
	GEO_POLITICAL_ZONE = "GEO_POLITICAL_ZONE",
	NATIONALITY = "NATIONALITY",
	TELEPHONE_NO = "TELEPHONE_NO"
 }
