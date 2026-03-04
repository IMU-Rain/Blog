import MaxMessage from "@/components/MaxMessage";

const SUCCESS_COLOR = "#2f7ccf";
const ERROR_COLOR = "#cf4d63";

const pickServerMessage = (error: any) => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  const message = error?.response?.data?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  return "";
};

export const getErrorMessage = (
  error: unknown,
  fallback = "操作失败，请稍后重试",
) => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  if (!error) {
    return fallback;
  }
  const serverMessage = pickServerMessage(error);
  if (serverMessage) {
    return serverMessage;
  }
  const message = (error as any)?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  return fallback;
};

export const showSuccessMessage = (
  message: string,
  icon = "mdi:check-circle-outline",
) => {
  MaxMessage({
    message,
    icon,
    color: SUCCESS_COLOR,
  });
};

export const showErrorMessage = (
  message: string,
  icon = "solar:danger-triangle-outline",
) => {
  MaxMessage({
    message,
    icon,
    color: ERROR_COLOR,
    duration: 2600,
  });
};
