import bcrypt from "bcrypt"
import { BCRYPT_SALT_ROUND } from "../../../config/constants.js"

const convertToHash = async (data: string): Promise<string> => {
    return await bcrypt.hash(data, BCRYPT_SALT_ROUND)
}

const compareHash = async (bufferString: string, plainText: string): Promise<boolean> => {
    return await bcrypt.compare(bufferString, plainText)
}


export {
    convertToHash,
    compareHash
}