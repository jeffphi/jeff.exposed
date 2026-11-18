const cheerio = require("cheerio");

const SOURCE_URL = "https://www.sbnature.org/visit/calendar/?category=6";
const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

// Labels look like "Monday, December 7" with no year; roll into next
// year if that date has already passed relative to `now`.
function resolveDate(label, now) {
  const match = label.match(/([A-Za-z]+)\s+(\d{1,2})\s*$/);
  if (!match) return null;
  const monthIndex = MONTHS.indexOf(match[1].toLowerCase());
  if (monthIndex === -1) return null;
  const day = parseInt(match[2], 10);

  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let date = new Date(Date.UTC(now.getUTCFullYear(), monthIndex, day));
  if (date < today) {
    date = new Date(Date.UTC(now.getUTCFullYear() + 1, monthIndex, day));
  }
  return date;
}

exports.handler = async function () {
  try {
    const res = await fetch(SOURCE_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; jeff.exposed sb-fun page)",
      },
    });
    if (!res.ok) {
      throw new Error(`sbnature.org responded ${res.status}`);
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    const now = new Date();

    const events = [];
    $("#calendar-events > .event").each((_, el) => {
      const node = $(el);
      const titleLink = node.find(".title a").first();
      const title = titleLink.text().trim();
      const href = titleLink.attr("href");
      if (!title || !href) return;

      const labelNode = node.find(".label").first().clone();
      labelNode.find(".ongoing").remove();
      const label = labelNode.text().trim();
      const date = resolveDate(label, now);

      const time = node.find(".time").first().text().replace(/–/g, "-").trim();
      const description = node.find(".description").first().text().trim();

      events.push({
        title,
        url: new URL(href, "https://www.sbnature.org").toString(),
        dateLabel: label,
        date: date ? date.toISOString() : null,
        time,
        description,
      });
    });

    events.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
      body: JSON.stringify({ source: SOURCE_URL, events }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify({ source: SOURCE_URL, events: [], error: String(err.message || err) }),
    };
  }
};
