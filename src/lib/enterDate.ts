import { createPrompt } from "bun-promptx";

export function enterDate(prompt = "Enter date: ", fallback = new Date()) {
  const { value, error } = createPrompt(prompt);
  if (error) throw new Error(error);

  return value ? new Date(value) : fallback;
}
