import "dotenv/config";
import App from "./app";
import Launcher from "./utils/server/launcher";
import env from "./utils/validateEnv";
import authRouter from "./resources/users/router"
import authPersonnel from "./resources/personnel/router"
import personalInfo from "./resources/personal_info/router"
import accountDetails from "./resources/account_details/router"
import nextOfKinDetails from "./resources/next_of_kin/router"
import spouseDetails from "./resources/spouse/router"
import childrenDetails from "./resources/children/router"
import militaryDetails from "./resources/military_info/router"
import careerDetails from "./resources/career/router"
import promotionHistory from "./resources/promotion-history/router"
import promotion from "./resources/promotion/router"
import disciplinaryRecords from "./resources/disciplinary-records/router"
import terminationRecords from "./resources/termination/router"
import academicRecords from "./resources/academic/router"
import militaryQualification from "./resources/military-qualifications/router"
import proMembership from "./resources/professional-membership/router"
import awol from "./resources/awol/router"
import casaulty from "./resources/casaulty/router"
import language from "./resources/language/router"
import consultancy from "./resources/consultancy/router"
import promotionAttempt from "./resources/promotion-attempt/router"
import honours from "./resources/honours/router"
import operations from "./resources/operations/router"
import careerReview from "./resources/career-review/router"
import userManagement from "./resources/user-management/router"
import postingHistory from "./resources/posting-history/router"
import posting from "./resources/posting/router"
import settings from "./resources/settings/router"


const app = new App([{path:"auth", router:authRouter}, {path:"user-management", router:userManagement},{path:"personnel", router:authPersonnel}, {path:"settings", router:settings}, {path:"personal-info", router:personalInfo}, {path:"account-details", router:accountDetails}, {path:"next-of-kin", router:nextOfKinDetails}, {path:"spouse", router:spouseDetails}, {path:"children", router:childrenDetails}, {path:"military-info", router:militaryDetails}, {path:"career-info", router:careerDetails}, {path:"promotion", router:promotion}, {path:"promotion-history", router:promotionHistory}, {path:"disciplinary-records", router:disciplinaryRecords}, {path:"termination", router:terminationRecords}, {path:"academic", router:academicRecords}, {path:"military-qualifications", router:militaryQualification}, {path:"professional-membership", router:proMembership}, {path:"awol", router:awol}, {path:"casaulty", router:casaulty}, {path:"language", router:language}, {path:"promotion-attempt", router:promotionAttempt }, {path:"consultancy", router:consultancy}, {path:"honours", router:honours}, {path:"operations", router:operations}, {path:"career-review", router:careerReview}, {path:"posting-history", router:postingHistory}, {path:"posting", router:posting}]);
const PORT = Number(env.PORT);
const server = new Launcher(app.express, PORT);
server.initServer();