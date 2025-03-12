import ae from "data-base64:@/assets/flags/ae.svg"
import au from "data-base64:@/assets/flags/au.svg"
import br from "data-base64:@/assets/flags/br.svg"
import cn from "data-base64:@/assets/flags/cn.svg"
import de from "data-base64:@/assets/flags/de.svg"
import fr from "data-base64:@/assets/flags/fr.svg"
import id from "data-base64:@/assets/flags/id.svg"
import jp from "data-base64:@/assets/flags/jp.svg"
import ru from "data-base64:@/assets/flags/ru.svg"
import us from "data-base64:@/assets/flags/us.svg"

const features = [
  {
    title: "Search History",
    slug: "search"
  },
  {
    title: "Manage Chats",
    slug: "chats"
  },
  {
    title: "Manage Folders",
    slug: "folders"
  },
  {
    title: "Manage Prompts",
    slug: "prompts"
  }
]
const languages = [
  {
    key: "en",
    name: "English", // Remains in English as it's the native name
    icon: us
  },
  {
    key: "ae",
    name: "العربية", // Arabic: "Arabic"
    icon: ae
  },
  {
    key: "au",
    name: "Australian English", // Remains in English as a variant, no distinct native name
    icon: au
  },
  {
    key: "cn",
    name: "中文", // Chinese: "Chinese"
    icon: cn
  },
  {
    key: "fr",
    name: "Français", // French: "French"
    icon: fr
  },
  {
    key: "jp",
    name: "日本語", // Japanese: "Japanese"
    icon: jp
  },
  {
    key: "ru",
    name: "Русский", // Russian: "Russian"
    icon: ru
  },
  {
    key: "br",
    name: "Português Brasileiro", // Brazilian Portuguese: "Brazilian Portuguese"
    icon: br
  },
  {
    key: "de",
    name: "Deutsch", // German: "German"
    icon: de
  },
  {
    key: "id",
    name: "Bahasa Indonesia", // Indonesian: "Indonesian Language"
    icon: id
  }
]

export { features, languages }
