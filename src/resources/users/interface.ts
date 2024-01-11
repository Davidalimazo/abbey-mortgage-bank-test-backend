export interface UsersType {
    userId?:string;
    hasChangePassword?:boolean;
    firstName:string;
    surname:string;
    email:string;
    phoneNumber:string;
    password?:string;
    personnelNo:string;
    status:number;
    role: "ADMIN" | "A-USER" | "B-USER",
    userType: 'ADMIN' | 'OPERATOR' | 'SUPER ADMIN', 
}

export enum CriteriaSearchEnum {
    first_name = "first_name", 
    email = "email", 
    phone_number = "phone_number", 
    surname = "surname", 
    user_id = "user_id", 
    user_role = "user_role", 
    user_type = "user_type",
    has_changed_password = "has_changed_password"
}