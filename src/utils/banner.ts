import { BannerConfig } from '../types/banner-config';

export const getBannerConfig = (): BannerConfig | undefined => {
  const message = process.env.INFO_BANNER_MESSAGE;
  if (!message) return undefined;

  return {
    message,
    linkText: process.env.INFO_BANNER_LINK_TEXT,
    modalTitle: process.env.INFO_BANNER_MODAL_TITLE,
    modalBody: process.env.INFO_BANNER_MODAL_BODY,
    modalSectionTitle: process.env.INFO_BANNER_MODAL_SECTION_TITLE,
    modalP1: process.env.INFO_BANNER_MODAL_P1,
    modalP2: process.env.INFO_BANNER_MODAL_P2,
    modalP3: process.env.INFO_BANNER_MODAL_P3,
  };
};
