import type { FolderFileType, FolderItemType } from "../types/components/modal";
import type { HandleLocalStorageDataType } from "../types/services";
import { deleteDataFromLocalStorage, getDataFromLocalStorage, setDataInLocalStorage, type LocalStorageKeyTypes } from "./auth";

type FoldersType = "prompts" | "folders"

const handleDataInLocalStorage = async ({data, foldersWindow, operationType}:HandleLocalStorageDataType) => {
    let foldersDataKey = (foldersWindow.type === "chats" ? "folders" : "prompts") as LocalStorageKeyTypes;
    const nestedFoldersLength = foldersWindow.folders.length;
    let currentFolderId = nestedFoldersLength === 0 ? "root" : foldersWindow.folders[nestedFoldersLength-1].id;

    let persistedData = (await getDataFromLocalStorage(foldersDataKey, currentFolderId)) as FolderFileType;

    if(operationType === "addItems"){
      persistedData.items = [...(data as FolderItemType[]), ...persistedData.items]
    }else if(operationType === "editFolder"){
      persistedData.info.title = data as string;
      const currentFolderParentId = nestedFoldersLength <= 1 ? "root" : foldersWindow.folders[nestedFoldersLength-2].id;
      let parentPersistedData = (await getDataFromLocalStorage(foldersDataKey, currentFolderParentId)) as FolderFileType;

      parentPersistedData.items = parentPersistedData.items.map((it) => {
        let obj = {...it};
        if(it.isFolder && foldersWindow.folders[nestedFoldersLength-1].id == it.id){
          obj["title"] = data as string;
        }
        return obj; 
      })
      
      setDataInLocalStorage({key: foldersDataKey, data:parentPersistedData, id: currentFolderParentId})
    }else if(operationType === "deleteItems"){
      let filteredItems = persistedData.items.filter((it) => (data as string[]).includes(it.id as string || it.conversationId));
      filteredItems = filteredItems.filter((it) => it.isFolder);
      await Promise.all(filteredItems.map((it) => deleteItemsRecoversively({folderId: it.id as string, folderType: foldersDataKey as FoldersType })));

      persistedData.items = persistedData.items.filter((it) => !(data as string[]).includes(it.id as string || it.conversationId));
    }else if(operationType === "editPrompt"){
      persistedData.items = persistedData.items.map((it) => {
        let obj = {...it};
        if(it.id === (data as FolderItemType).id){
          obj["title"] = data as string;
          obj["content"] = data as string;
          obj["updatedAt"] = Date.now();
        }
        return obj; 
      })
    }

    setDataInLocalStorage({key: foldersDataKey, data:persistedData, id: currentFolderId})
  }

  const deleteItemsRecoversively = async ({ folderId, folderType }:{folderType: FoldersType, folderId: string}) => {
    let persistedData = (await getDataFromLocalStorage(folderType, folderId)) as FolderFileType;
    let filteredItems = persistedData?.items?.filter((it) => it.isFolder) || [];
    await Promise.all(filteredItems.map((it) => deleteItemsRecoversively({folderId: it.id as string, folderType: folderType })));
    await deleteDataFromLocalStorage(folderType, folderId);
  }

  type HandlePromptCommandType = {
    operationType: "deleteItems" | "addItems" | "editItem"
    data: FolderItemType[] | FolderItemType | string[]
  }

  const handleDataOfPromptCommand = async ({ data, operationType }:HandlePromptCommandType) => {
    let persistedData = ((await getDataFromLocalStorage("prompts")) || []) as FolderItemType[];
    if(operationType === "addItems"){
      persistedData.push(...(data as FolderItemType[]));
    }else if(operationType === "deleteItems"){
      persistedData = persistedData.filter((it) => !(data as string[]).includes(it.id as string));
    }else if(operationType === "editItem"){
      persistedData = persistedData.map((it) => {
        if((data as FolderItemType).id == it.id){
          return data as FolderItemType
        }
        return {...it};
      })
    }

    setDataInLocalStorage({data: persistedData, key: "prompts"});
  }

  export {
    handleDataInLocalStorage,
    handleDataOfPromptCommand
  }