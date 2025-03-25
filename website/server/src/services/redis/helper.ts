import { FOLDERS_KEY, PROMPTS_KEY } from "./keys.js";
import { GetFolderRedisKeyType } from "./types.js";


const getFolderRedisKey = ({userId, type, root}:GetFolderRedisKeyType) => {
    let key = FOLDERS_KEY.replace("{userId}", userId).replace( "{type}", type);
    if(root) key = key.replace("{root}", root);
    return key
}

const getPromptRedisKey = ({userId }:{userId:string}) => {
    let key = PROMPTS_KEY.replace("{userId}", userId)
    return key
}

export {
    getFolderRedisKey,
    getPromptRedisKey
}