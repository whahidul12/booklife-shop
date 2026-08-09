import { PROMO_BANNERS } from "../utils/constants";

export const getPromoBanners = async () => {
  return new Promise<typeof PROMO_BANNERS>((resolve) => {
    setTimeout(() => {
      resolve(PROMO_BANNERS);
    }, 50);
  });
};
