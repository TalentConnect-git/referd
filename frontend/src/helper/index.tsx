import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const goToHome = (router: AppRouterInstance) => {
  router.replace("/");
};

export const navigate = (
  router: AppRouterInstance,
  path: string
) => {
  router.replace(path);
};

export const navigatePush = (
  router: AppRouterInstance,
  path: string
) => {
  router.push(path);
};