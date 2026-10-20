export const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
// Content links must stay on the web; anything else becomes inert.
export const safeUrl = (value) =>
  /^https:\/\//i.test(String(value ?? "")) ? value : "#";
