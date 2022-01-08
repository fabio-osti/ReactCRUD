export function saltPass(unsaltPass: string, salt: string) {
	return CryptoJS.PBKDF2(unsaltPass, CryptoJS.enc.Base64.parse(salt), {
		keySize: 256 / 32,
		iterations: 2048,
	}).toString(CryptoJS.enc.Base64);
}

export interface IUser {
	username?: string
	email?: string
	password?: string
}
