export const validateEmail = (value: string): string | null => {
  const email = value.trim();

  if (!email) {
    return "Enter your email address.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }

  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) {
    return "Enter a password.";
  }

  if (value.length < 8) {
    return "Use at least 8 characters.";
  }

  return null;
};

export const authErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error && "errors" in error) {
    const clerkError = error as { errors?: Array<{ message?: string }> };
    const clerkMessage = clerkError.errors?.[0]?.message;

    if (clerkMessage) {
      return clerkMessage;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
