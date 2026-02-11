import { useLanguage } from "../context/LanguageContext";

export const responseHelper = () => {
  const { language } = useLanguage();

  const getMessageFromResponse = (response) => {
    return response?.message ? (response.message[language] || response.message.en) : "No message provided";
  };

  const getDataFromResponse = (response) => response?.data || null;

  const isSuccessResponse = (response) => response?.success === true;

  return { getMessageFromResponse, getDataFromResponse, isSuccessResponse };
};