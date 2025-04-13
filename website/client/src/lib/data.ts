import deepSearchImg from "@/assests/search.png";
import manageChatsImg from "@/assests/manage-chats.png";
import manageFoldersImg from "@/assests/manage-folders.png";
import managePromptsImg from "@/assests/manage-prompts.png";
import languageImg from "@/assests/language.png";
import quickPromptsImg from "@/assests/quick-prompts.png";

const allFeatures = [
  {
    title: "Deep Search – Find Conversations Instantly",
    content1:
      "Easily find any past conversation using Deep Search. Just type in a keyword, topic, or phrase, and your relevant chats will appear instantly.",
    content2:
      "Enable Exact Match for precise results. Click to open a chat or use Ctrl + Click to open it in a new tab without losing your current page.",
    img: deepSearchImg,
  },
  {
    title: "Manage Chats – Perform Bulk Actions Easily",
    content1:
      "Select multiple chats and delete, archive, or unarchive them in one go. No more handling conversations one by one.",
    content2:
      "Keep your history tidy and organized with just a few clicks. Perfect for cleaning up or grouping old conversations.",
    img: manageChatsImg,
  },
  {
    title: "Manage Folders – Organize Chats Your Way",
    content1:
      "Group your chats into folders by topics like Work, Study, or Personal. You can even create subfolders for more structure.",
    content2:
      "Rename or delete folders anytime. Easily access and manage your chats just the way you like.",
    img: manageFoldersImg,
  },
  {
    title: "Manage Prompts – Save & Reuse Frequently Used Text",
    content1:
      "Save your favorite prompts into folders for quick reuse. Perfect for prompts you use often.",
    content2:
      "Edit, rename, or delete prompts anytime. Stay organized and save time while chatting.",
    img: managePromptsImg,
  },
  {
    title: "Quick Access Prompts – Insert Prompts Instantly",
    content1:
      "Type // to instantly bring up your saved prompts right in the input field. Use //title to search by name.",
    content2:
      "Navigate with arrow keys and hit Tab to insert a prompt quickly. It’s fast and super efficient.",
    img: quickPromptsImg,
  },
  {
    title: "Multi-Language Support – Use ChatGPT in Your Preferred Language",
    content1:
      "Choose from 10 languages to chat comfortably. Just head to Settings and pick your favorite.",
    content2:
      "Switch languages anytime with one click. Make ChatGPT feel more personal and accessible.",
    img: languageImg,
  },
];



export {
    allFeatures
}
