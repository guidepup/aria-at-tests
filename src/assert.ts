import { ScreenReader } from "@guidepup/guidepup";
import { test as playwrightTest } from "@playwright/test";
import { expect } from "@playwright/test";
import { annotate } from "./annotate";

/*
 * Explanation of the regular expression:
 *
 * stringToEscape.replace(
 *   /[|\\{}()[\]^$+*?.]/g,  // Match any of the special characters: | \ {} () [] ^ $ + * ? .
 *   "\\$&"                  // Replace with the escaped version of the matched character
 * ).replace(
 *   /-/g,                   // Match hyphens
 *   "\\x2d"                 // Replace with the escaped version of hyphen using hexadecimal representation
 * );
 *
 * This regex is used to escape special characters in a given string, making them safe
 * to be used as literals in a regular expression pattern. The first replace() call
 * escapes common regex special characters, and the second replace() call specifically
 * escapes hyphens using the hexadecimal representation "\\x2d".
 *
 * REF: https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
 */
const escapeStringForRegex = (stringToEscape: string): string =>
  stringToEscape.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");

/**
 * Explanation of the regular expression:
 *
 * (?:             // Start of a non-capturing group
 *   \s+           // Match one or more whitespace characters
 *   (?![.\s])     // Negative lookahead assertion for not followed by a period or whitespace
 *   [\w'\\x2d]+   // Match one or more occurrences of word characters, single quotes, or hyphens
 * )*              // End of the non-capturing group, allowing for zero or more occurrences
 * \s+             // Match one or more whitespace characters
 *
 * This regex allows for matching a sequence of words with special characters
 * (like single quotes and hyphens) separated by spaces, but not ending with
 * a period or whitespace. This sequence can appear multiple times in a sentence.
 */
const RE_ALLOW_INTERMEDIARY_WORDS = "(?:\\s+(?![.\\s])[\\w,'\\x2d]+)*\\s+";

/**
 * Explanation of the regular expression:
 *
 * '              // Matches the opening single quote
 * (              // Start of a capturing group
 *   [^']+        // Matches one or more characters that are not single quotes
 * )              // End of the capturing group
 * '              // Matches the closing single quote
 *
 * This regex captures a string enclosed in single quotes.
 */

/**
 * Explanation of the regular expression:
 *
 * \(           // Matches an opening parenthesis
 * '            // Matches an opening single quote
 *   ([^']+)    // Capturing group for one or more characters that are not a single quote
 * '            // Matches a closing single quote
 * \)           // Matches a closing parenthesis
 * |            // OR operator to match the following alternative
 * \(           // Matches an opening parenthesis
 *   ([^)]+)    // Capturing group for one or more characters that are not closing parenthesis
 * \)           // Matches a closing parenthesis
 * |            // OR operator to match the following alternative
 * '            // Matches an opening single quote
 *   ([^']+)    // Capturing group for one or more characters that are not a single quote
 * '            // Matches a closing single quote
 */
const RE_MATCH_TARGET_PHRASE = /\('([^']+)'\)|\(([^)]+)\)|'([^']+)'/;

// Some special cases where screen readers introduce spaces into role names
// which typically still convey the role.
const withRoleReplacements = (spokenPhrase: string): string =>
  spokenPhrase
    .replaceAll(/combo box/gi, "combobox")
    .replaceAll(/menu bar/gi, "menubar");

export async function assert({
  assertions,
  screenReader,
  test,
}: {
  assertions: string[];
  screenReader: ScreenReader;
  test: typeof playwrightTest;
}) {
  const spokenPhraseLog = await screenReader.spokenPhraseLog();

  for (const assertion of assertions) {
    const matches = assertion.match(RE_MATCH_TARGET_PHRASE);
    const phrase = (matches?.at(1) ?? matches?.at(2) ?? matches?.at(3))?.trim();

    if (!phrase) {
      annotate({
        test,
        warning: `Unable to perform assertion: "${assertion}"`,
      });

      continue;
    }

    const phraseRegex = phrase
      .split(" ")
      .map((word) => `\\b${escapeStringForRegex(word.trim())}\\b`)
      .join(RE_ALLOW_INTERMEDIARY_WORDS);

    const matchRegex = new RegExp(phraseRegex, "gi");

    console.log(`Performing assertion: "${assertion}"`);

    const found = !!spokenPhraseLog.find((spokenPhrase) =>
      matchRegex.test(withRoleReplacements(spokenPhrase))
    );

    if (!found) {
      console.log(
        `Assertion "${assertion}" failed. Unable to find phrase "${phrase}" in spoken phrase log.`
      );
    } else {
      console.log(`Assertion "${assertion}" succeeded.`);
    }

    expect
      .soft(
        found,
        `Assertion "${assertion}" failed. Unable to find phrase "${phrase}" in spoken phrase log.`
      )
      .toBeTruthy();
  }
}
