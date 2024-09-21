export function base64ToImage(blobData: Buffer, filename?: string) {
	const blobToString: string = blobData.toString("base64");
	const base64Data = blobToString.replace(/^data:image\/\w+;base64,/, "");
	const buffer = Buffer.from(blobData).toString("base64");
	// const getPersonnel = filename.split("/")[1]
	// const filePath = path.join(__dirname, '..', '..', 'public', 'images', `${getPersonnel}.png`); // Adjust the path to your desired location

	// fs.writeFileSync(filePath, buffer, 'base64');

	return buffer;
}

export const addYearsToDate = (date: string | undefined, years: number) => {
	if (date) {
		const originalDate = new Date(date);
		const newDate = new Date(originalDate); // Create a new Date object to avoid mutating the original date
		newDate.setFullYear(originalDate.getFullYear() + years);
		return newDate;
	}
	return null;
};

// Function to convert Base64 to a buffer
export function base64ToBuffer(base64String: string) {
	const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
	const binaryString = Buffer.from(base64Data, "base64");
	return binaryString;
}

export function removeBase64Prefix(base64String: string | undefined) {
	const prefix = "data:image/png;base64,";

	if (!base64String) return "";

	if (base64String.startsWith(prefix)) {
		return base64String.substring(prefix.length);
	} else {
		return base64String; // Return the input string unchanged
	}
}

export function getDateFromAge(age: number): string {
	const today: Date = new Date();
	const birthYear: number = today.getFullYear() - age;
	const birthDate: Date = new Date(
		birthYear,
		today.getMonth(),
		today.getDate(),
	);

	// Format the date to 'yyyy-mm-dd'
	const formattedDate: string = birthDate.toISOString().split("T")[0];
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

export const convertToLowerCase = (data: string | null | undefined) => {
	if (!data) return "";
	return data.toLowerCase();
};
