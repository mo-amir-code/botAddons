import { httpAxios } from "../axios"

const fetchFolders = async () => {
  try {
    const res = await httpAxios.get(`/`)
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

export { fetchFolders }
