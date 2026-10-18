/* Small helpers shared by the website and the resume/CV pages. */
(function () {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function esc(text) {
    return String(text == null ? "" : text).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  // "2024-03" -> "Mar 2024", "2021" -> "2021", "present" -> "Present"
  function fmtDate(value) {
    if (!value) return "";
    const v = String(value).trim();
    if (v.toLowerCase() === "present") return "Present";
    const m = v.match(/^(\d{4})-(\d{1,2})$/);
    return m ? `${MONTHS[+m[2] - 1]} ${m[1]}` : v;
  }

  function fmtRange(start, end) {
    const a = fmtDate(start), b = fmtDate(end);
    return a && b ? `${a} – ${b}` : a || b;
  }

  // "https://www.linkedin.com/in/x/" -> "linkedin.com/in/x"
  function prettyUrl(url) {
    return String(url || "").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  }

  window.Util = { esc, fmtDate, fmtRange, prettyUrl };
})();
