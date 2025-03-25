import { FOLDERS_KEY } from "./keys.js";
import { GetFolderRedisKeyType } from "./types.js";


const getFolderRedisKey = ({userId, type, root}:GetFolderRedisKeyType) => {
    let key = FOLDERS_KEY.replace("{userId}", userId).replace( "{type}", type);
    if(root) key = key.replace("{root}", root);
    return key
}

export {
    getFolderRedisKey
}