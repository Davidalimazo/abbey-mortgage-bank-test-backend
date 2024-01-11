export interface UpdateType {
    bank:{
    number?: string;
    address?: string;
    name?: string;
    bankName?: string;
    remarks?: string | undefined;
    },
    children:{
    dateOfBirth?: Date;
    firstName?: string;
    gender?: "Male" | "Female";
    }[],

    nextofKin:{
    phoneNumber?: string;
    email?: string;
    address?: string;
    fullName?: string;
    relationship?: string;
    confirmationAuthority?: string;
    }[],
    personalInfo:{
        dateOfBirth?: Date;
        firstName?: string;
        initial?: string;
        middleName?: string;
        surName?: string;
        phoneNumber?: string;
        email?: string;
        otherNames?: string | undefined;
        address?: string;
	    nationality?: string;
        rank?: string,
        gender?: "Male" | "Female",
        bloodGroup?: string,
        lga?: string,
        geoPoliticalZone?: string,
        state?: string,
        maritalStatus?: string,
        religion?: string
    }
}