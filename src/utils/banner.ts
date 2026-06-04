import { BannerConfig } from '../types/banner-config';

export const getBannerConfig = (): BannerConfig | undefined => {
  const message = process.env.INFO_BANNER_MESSAGE;
  if (!message) return undefined;

  return {
    message,
    linkText: process.env.INFO_BANNER_LINK_TEXT,
    modalTitle: process.env.INFO_BANNER_MODAL_TITLE,
    modalContent: process.env.INFO_BANNER_MODAL_CONTENT,
  };
};
