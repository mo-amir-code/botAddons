import { SERVER_ORIGIN } from "@/config/constants"
import axios from "axios"

const httpAxios = axios.create({
  baseURL: `${SERVER_ORIGIN}/api/v1`,
  withCredentials: true
})

export { httpAxios }
