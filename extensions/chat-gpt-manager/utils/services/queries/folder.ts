import type { FetchFoldersQueryType } from "@/utils/types/services/queries"
import { httpAxios } from "../axios"

const fetchFolders = async ({
  type,
  id
}: FetchFoldersQueryType): Promise<any> => {
  try {
    const res = await httpAxios.get(
      `/folder?type=${type}${id ? `&id=${id}` : ""}`
    )
    return res
  } catch (error) {
    console.error(error)
  }
}

export { fetchFolders }
