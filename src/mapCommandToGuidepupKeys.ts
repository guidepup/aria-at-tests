const toTitleCase = (key: string) =>
  key
    .trim()
    .split(" ")
    .map(
      (subKey) =>
        subKey.charAt(0).toUpperCase() + subKey.substring(1).toLowerCase()
    )
    .join("");

export const mapCommandToGuidepupKeys = (command: string) =>
  command
    .toLowerCase()
    // Handle commands that have an extra _ inside the key itself
    .replaceAll("page_down", "page down")
    .replaceAll("page_up", "page up")
    .replaceAll(/numpad_(\d+)/g, "numpad $1")
    // Handle abbreviations (mostly modifiers)
    .replaceAll("ctrl", "control")
    .replaceAll("opt", "option")
    .replaceAll("cmd", "command")
    .replaceAll("ins", "insert")
    .replaceAll("esc", "escape")
    .replaceAll("one", "digit1")
    .replaceAll("two", "digit2")
    .replaceAll("three", "digit3")
    .replaceAll("four", "digit4")
    .replaceAll("five", "digit5")
    .replaceAll("six", "digit6")
    .replaceAll("seven", "digit7")
    .replaceAll("eight", "digit8")
    .replaceAll("nine", "digit9")
    .split("_")
    .map((key) => toTitleCase(key));
