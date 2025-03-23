import { BOTADDONS_DOMAIN_ROOT, ENVIRONMENT } from "../../config/constants.js";
import { GetDomainRootType } from "../../types/middleware/index.js";

const getDomainRoot = ({ origin, forCookie = false }: GetDomainRootType) => {
  switch (origin) {
    case "https://chatgpt.com":
      return "chatgpt.com";
    case "https://claude.ai":
      return "claude.ai";
    default:
      return ENVIRONMENT === "development"
        ? forCookie
          ? "localhost"
          : "website"
        : "botaddons.com";
  }
};

const getCookieDomain = () => ENVIRONMENT === "production" ?  "." + BOTADDONS_DOMAIN_ROOT : "localhost";

export { getDomainRoot, getCookieDomain };
