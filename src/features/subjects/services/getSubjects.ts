import { SUBJECTS_DATA } from "../constants/constants";

export const getSubjects = async (): Promise<
  { title: string; url: string }[]
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(SUBJECTS_DATA);
    }, 100);
  });
};
