import { useExtension } from "@/contexts/extensionContext"
import { httpAxios } from "@/utils/services/axios"
import { fetchFolders } from "@/utils/services/queries/folder"
import type { FolderItemType } from "@/utils/types/components/modal"
import type { FetchFoldersQueryType } from "@/utils/types/services/queries"
import { useEffect, useState } from "react"

import Button from "../buttons/Button"
import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"
import { useLanguage } from "@/contexts/languageContext"

type SelectedItemType = {
  id: string
  isFolder: boolean
}

const Prompts = () => {
  const [selectedItemsId, setSelectedItemsId] = useState<SelectedItemType[]>([])
  const [results, setResults] = useState<FolderItemType[]>([])
  const { folderAllFiles, foldersWindow, dispatch, currentFolderInfo } =
    useExtension()
  const { t } = useLanguage();

  const handleSelectItems = ({
    isAllSelect,
    id
  }: {
    isAllSelect?: boolean
    id: string
  }) => {
    let updatedSelectedItemsId = [...selectedItemsId]
    if (isAllSelect) {
      updatedSelectedItemsId = results.map((item) => {
        return {
          isFolder: item.isFolder,
          id: item.id
        }
      }) as SelectedItemType[]
      setSelectedItemsId(updatedSelectedItemsId)
      return
    } else if (isAllSelect === false) {
      setSelectedItemsId([])
      return
    }

    const isExist = updatedSelectedItemsId.find((cId) => cId.id == id)

    if (isExist) {
      updatedSelectedItemsId = updatedSelectedItemsId.filter(
        (cId) => cId.id !== id
      )
    } else {
      updatedSelectedItemsId.push({
        id,
        isFolder: results.find((it) => it.id == id).isFolder
      })
    }

    setSelectedItemsId(updatedSelectedItemsId)
  }

  const isSelected = (id: string) => {
    return selectedItemsId.find((cId) => cId.id === id) ? true : false
  }

  const handleQuery = (query: string) => {
    setResults(
      folderAllFiles.items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  const handleDelete = async () => {
    try {
      await httpAxios.delete("/folder", {
        data: {
          ids: selectedItemsId.filter((it) => it.isFolder).map((it) => it.id),
          folderId: currentFolderInfo?.id,
          promptIds: selectedItemsId
            .filter((it) => !it.isFolder)
            .map((it) => it.id),
          type: "prompts"
        }
      })
      let newFolderAllFiles = { ...folderAllFiles }
      newFolderAllFiles.items = newFolderAllFiles.items.filter(
        (item) =>
          !selectedItemsId.some(
            (it) => it.id == item.conversationId || item.id == it.id
          )
      )
      dispatch({ type: "FOLDER_ALL_FILES", payload: newFolderAllFiles })
      setSelectedItemsId([])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchNow = async () => {
      try {
        let obj: FetchFoldersQueryType = { type: "prompts" }
        if (foldersWindow.folders.length) {
          obj["id"] = foldersWindow.folders[foldersWindow.folders.length - 1].id
        }
        const res = await fetchFolders(obj)
        let data = res.data.data
        dispatch({ type: "FOLDER_ALL_FILES", payload: data })
        dispatch({ type: "CURRENT_FOLDER_INFO", payload: data?.info })
      } catch (error) {
        console.error(error)
      }
    }

    fetchNow()
  }, [foldersWindow])

  useEffect(() => {
    setResults(folderAllFiles.items)
    setSelectedItemsId([])
  }, [folderAllFiles])

  return (
    <div>
      <SearchField placeholder={t("searchFolder")} func={handleQuery} />
      <SelectAll
        isChecked={
          selectedItemsId.length === folderAllFiles.items.length &&
          folderAllFiles.items.length > 0
        }
        selectedConversations={selectedItemsId.length}
        func={handleSelectItems}
      />

      <ul className="mt-2 overflow-height">
        {results?.map(({ id, title, updatedAt, isFolder, content }) => (
          <Item
            key={id}
            id={id}
            isSelected={isSelected}
            onChatSelectChange={handleSelectItems}
            title={title}
            update_time={updatedAt ? updatedAt : undefined}
            itemType={isFolder ? "folder" : "prompt"}
            modalType="prompts"
            content={content}
          />
        ))}
      </ul>

      <div className="pt-4 flex items-center justify-end">
        <Button
          title={t("delete")}
          func={handleDelete}
          icon="delete"
          isEnabled={selectedItemsId.length !== 0}
        />
      </div>
    </div>
  )
}

export default Prompts
