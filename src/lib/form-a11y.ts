/**
 * Accessible field errors for the lead forms (conversion audit F9, 27 Nov 2026).
 *
 * Each invalid field gets aria-invalid and aria-describedby pointing at its error text,
 * the error text sits in an element with that id, and after a failed submit focus moves
 * to the first invalid field so keyboard and screen-reader users land on the problem.
 */

/** Props for an input, select or textarea whose error is shown in `<p id={`${id}-error`}>`. */
export function fieldA11y(id: string, error?: string) {
  return error
    ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` }
    : { "aria-invalid": undefined, "aria-describedby": undefined };
}

/** After React renders the errors, focus the first field marked invalid in `form`. */
export function focusFirstInvalid(form: HTMLFormElement | null): void {
  if (!form) return;
  requestAnimationFrame(() => {
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
}

/** "1 field needs attention." / "3 fields need attention." for the live summary. */
export function errorSummary(count: number): string {
  if (count <= 0) return "";
  return count === 1 ? "1 field needs attention." : `${count} fields need attention.`;
}
