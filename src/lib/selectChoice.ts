import { SelectionItem, SelectionOptions, createSelection } from "bun-promptx";

export function selectChoice(
  choices: (string | SelectionItem)[],
  options?: SelectionOptions,
  exit: () => undefined = () => {}
) {
  const { selectedIndex, error } = createSelection(
    [
      ...choices.map((k) => (typeof k === "string" ? { text: k } : k)),
      { text: "exit" },
    ],
    options
  );

  if (selectedIndex === null || selectedIndex >= choices.length) {
    return exit();
  }

  if (error) {
    if (error.toLowerCase() == "cancelled") {
      return exit();
    } else {
      throw new Error(error);
    }
  }

  return selectedIndex;
}
