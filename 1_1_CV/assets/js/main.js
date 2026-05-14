document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".calculate-period").forEach(item => {
    const rawText = item.textContent.trim();
    const [from, till] = rawText.split("-").map(item => item.trim());
    const fromDate = parseDate(from);
    const tillDate = parseDate(till);
    const diffText = formatDiff(fromDate, tillDate);
    const spanEl = document.createElement("span");
    spanEl.textContent = diffText;
    item.appendChild(spanEl);
  });
});

const parseDate = (str) => {
  if (str == "now") {
    return new Date();
  }
  if (!str || !str.includes("/")) {
    return null;
  }
  const [month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, 1);
}

function formatDiff(start, end) {
  if (!start || !end) {
    return `1mo.`
  }
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return `${months}mo.`;
  }

  if (months === 0) {
    return `${years}yr.`;
  }

  return `${years}yr. ${months}mo.`;
}