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


export function toArray(value?: string[] | string): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function formatDateRange(start?: string, end?: string, isCurrent?: boolean) {
  if (!start && !end && !isCurrent) return '';
  return `${start || ''}${start ? ' - ' : ''}${isCurrent ? 'Present' : end || ''}`;
}

export function getDescription(description?: string | string[]) {
  if (Array.isArray(description)) return description.join(', ');
  return description || '';
}