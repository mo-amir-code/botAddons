import { SERVER_ORIGIN } from "@/config/constants"
import axios from "axios"

const httpAxios = axios.create({
  baseURL: SERVER_ORIGIN,
  withCredentials: true
})

export { httpAxios }
