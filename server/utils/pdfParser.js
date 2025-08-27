// --- Robust time patterns that tolerate internal spaces like "6 .38 am" / "7. 40am" / "6.5 0 am"
const TIME_CORE = String.raw`(?:[01]?\d|2[0-3])\s*[.:]\s*(?:\d\s*\d|\d{1,2})`;  // hh[:.]mm (mm may have a space like "5 0")
const TIME_HH_AMPM = String.raw`(?:[1-9]|1[0-2])\s*(?:am|pm)`;

const TIME_RE = new RegExp(`(?:${TIME_CORE}\\s*(?:am|pm)?|${TIME_HH_AMPM})`, "i");
const TIME_GLOBAL_RE = new RegExp(`(?:${TIME_CORE}\\s*(?:am|pm)?|${TIME_HH_AMPM})`, "gi");

// Simple marker to find route headers (we'll extract the number using the next time token)
const ROUTE_MARKER_RE = /Route\s*No\.?/gi;

// Ignore tokens when they are lone "stops" (keep if part of a larger name)
const LONE_IGNORE = new Set(["ECR", "OMR"]);

function normalizeSpaces(s) {
  return s.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
}

// Fix common OCR/text errors and normalize stop names
function normalizeLocationName(name) {
  let s = name;

  // Common fixes
  s = s.replace(/\bA\s+ranganathan\b/gi, "Aranganathan");
  s = s.replace(/\bAa\s*di\b/gi, "Aadi");
  s = s.replace(/\bBaliaha\s+Garde\s*n\b/gi, "Baliaha Garden");

  // Ensure closing parenthesis if there's an unmatched "("
  if (s.includes("(") && !s.includes(")")) {
    s = s + ")";
  }

  // Trim spaces inside parentheses
  s = s.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");

  return normalizeSpaces(s);
}

/*
  Extracts date from header line like:
  "BUS ROUTES ON dd-mm-yyyy"  or
  "BUS ROUTES FROM dd-mm-yyyy"
 */
function parseDateFromHeader(text) {
  const m = text.match(/BUS\s*ROUTES\s*(?:ON|FROM)\s*([0-3]?\d)[-\/. ]([0-1]?\d)[-\/. ](20\d{2})/i);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const iso = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}T00:00:00`;
  return new Date(iso);
}

// Pre-normalize all time-like fragments
function preNormalizeTimes(raw) {
  let s = raw;

  // Join minute digits that are split by spaces: "6 .3 8" -> "6.38"
  s = s.replace(/(\d)\s*[.:]\s*(\d)\s*(\d)/g, "$1.$2$3");

  // Normalize dot separators: "7 .40" -> "7.40"
  s = s.replace(/(\d)\s*[.:]\s*(\d{1,2})/g, "$1.$2");

  // Remove space before am/pm
  s = s.replace(/(\d{1,2}[.:]\d{1,2})\s*(am|pm)/gi, "$1$2");
  s = s.replace(/(\b\d{1,2})\s*(am|pm)\b/gi, "$1$2");

  return s;
}

/*
  Normalize a matched time token to consistent string (hh:mmam / hham etc).
  Default to "am" if am/pm is missing (file is morning-only).
 */
function cleanAndNormalizeTime(timeStr) {
  let s = (timeStr || "").toLowerCase();
  s = s.replace(/\s+/g, "");
  s = s.replace(/\./g, ":");

  const m = s.match(/^([0-2]?\d):(\d{1,2})(am|pm)?$/);
  if (m) {
    let [, hh, mm, ap] = m;
    if (mm.length === 1) mm = "0" + mm;
    if (!ap) ap = "am";
    return `${hh}:${mm}${ap}`;
  }

  const h = s.match(/^([1-9]|1[0-2])(am|pm)?$/);
  if (h) {
    let [, hh, ap] = h;
    if (!ap) ap = "am";
    return `${hh}${ap}`;
  }

  return s;
}

function insertSpaceAfterTimes(s) {
  return s.replace(
    /(\b(?:[01]?\d|2[0-3])\s*[.:]\s*\d{1,2}\s*(?:am|pm)?|\b(?:[1-9]|1[0-2])\s*(?:am|pm)?)(?=[A-Za-z(])/gi,
    "$1 "
  );
}

/*
  Split whole document into route blocks using Route No. markers.
  Robust extraction of the route number: look for the first time token after the marker
  and take the substring in-between as the route-number text (strip spaces/leading zeros).
 */
function splitByRoutes(fullText) {
  const blocks = [];
  const markers = [];
  let m;
  ROUTE_MARKER_RE.lastIndex = 0;
  while ((m = ROUTE_MARKER_RE.exec(fullText)) !== null) {
    markers.push({ idx: m.index, len: m[0].length });
  }

  if (!markers.length) return [];

  for (let i = 0; i < markers.length; i++) {
    const startIdx = markers[i].idx;
    const markerEnd = startIdx + markers[i].len;

    TIME_GLOBAL_RE.lastIndex = markerEnd;
    const timeMatch = TIME_GLOBAL_RE.exec(fullText);

    let routeTextRaw = "";
    if (timeMatch && timeMatch.index > markerEnd) {
      routeTextRaw = fullText.slice(markerEnd, timeMatch.index);
    } else {
      routeTextRaw = fullText.slice(markerEnd, markerEnd + 12);
    }

    let routeTextClean = routeTextRaw.replace(/[^0-9A-Za-z\s]/g, "").trim();

    const rnMatch = routeTextClean.match(/^0*([1-9][0-9\s]*)([A-Za-z]?)?/);
    let routeNo = "";
    if (rnMatch) {
      routeNo = (rnMatch[1] || "").replace(/\s+/g, "");
      if (rnMatch[2]) routeNo += rnMatch[2].toUpperCase();
    } else {
      routeNo = routeTextClean.replace(/\s+/g, "");
    }

    const endIdx = i + 1 < markers.length ? markers[i + 1].idx : fullText.length;
    const blockText = fullText.slice(startIdx, endIdx).trim();

    if (routeNo) {
      blocks.push({ routeNo, text: blockText });
    }
  }

  return blocks;
}

/*
  Parse stops for one route block.
  Logic untouched.
*/
function parseStopsFromBlock(blockText) {
  let t = blockText.replace(/[\|\\/]+/g, " ");
  t = preNormalizeTimes(t);
  t = insertSpaceAfterTimes(t);
  t = normalizeSpaces(t);

  TIME_GLOBAL_RE.lastIndex = 0;
  const firstTime = TIME_GLOBAL_RE.exec(t);
  if (firstTime && firstTime.index > 0) {
    t = t.slice(firstTime.index);
  } else {
    t = t.replace(/Route\s*No\.?/i, "").trim();
  }

  t = t.replace(/\s*\[\d{7,}\]\s*$/, "");

  const collegeIndex = t.toLowerCase().lastIndexOf(" college");
  if (collegeIndex !== -1) {
    t = t.slice(0, collegeIndex + " college".length + 1).trim();
  }

  t = t.replace(TIME_GLOBAL_RE, (match) => cleanAndNormalizeTime(match));
  t = t.replace(/(\d{1,2}[:.]\d{2}\s*(?:am|pm)?)(?=[A-Za-z])/gi, "$1 ");

  const times = [];
  let match;
  TIME_GLOBAL_RE.lastIndex = 0;
  while ((match = TIME_GLOBAL_RE.exec(t)) !== null) {
    times.push({ time: match[0], idx: match.index });
  }
  if (!times.length) return [];

  const stops = [];
  for (let i = 0; i < times.length; i++) {
    const cur = times[i];
    const nextIdx = i + 1 < times.length ? times[i + 1].idx : t.length;

    let locationText = t.substring(cur.idx + cur.time.length, nextIdx);
    locationText = normalizeSpaces(locationText);
    locationText = locationText.replace(/^[\s,;:.()\-]+|[\s,;:.()\-]+$/g, "");
    locationText = locationText.split(/\bvia\b/i)[0].trim();
    locationText = locationText.replace(TIME_GLOBAL_RE, "").trim();

    const parts = locationText.split(/[;,]+/).map(p => p.trim()).filter(Boolean);

    for (const loc of parts) {
      if (!loc || /^\d+$/.test(loc)) continue;
      if (LONE_IGNORE.has(loc.toUpperCase())) continue;

      if (/Adyar Depot.*LB Road/i.test(loc)) {
        const sub1 = loc.replace(/\s*LB Road.*/i, "").trim();
        const sub2 = "LB Road";
        [sub1, sub2].forEach(sub => {
          const cleanLoc = normalizeLocationName(sub);
          if (cleanLoc.length > 1) {
            stops.push({ time: cleanAndNormalizeTime(cur.time), location: cleanLoc });
          }
        });
        continue;
      }

      const cleanLoc = normalizeLocationName(loc);
      if (cleanLoc.length > 1) {
        stops.push({ time: cleanAndNormalizeTime(cur.time), location: cleanLoc });
      }
    }
  }

  const seen = new Set();
  const uniqueStops = stops.filter(s => {
    const key = `${s.time}-${s.location.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniqueStops;
}

// --- Only this function changed to remove pdfjs-dist fallback ---
export async function parseBusPdf(buffer, fileName = "") {
  let textContent = "";
  try {
    const { default: pdfParse } = await import("pdf-parse");
    textContent = (await pdfParse(new Uint8Array(buffer))).text;
  } catch (err) {
    console.error("PDF parsing failed:", err);
    throw new Error("Failed to parse PDF. Ensure it is a valid PDF.");
  }

  if (!textContent.trim()) throw new Error("Empty PDF text");

  const fullText = textContent
    .split("\n")
    .map(l => l.replace(/\u00A0/g, " ").trim())
    .filter(Boolean)
    .join("\n");

  let routeDate = parseDateFromHeader(fullText) || new Date();
  routeDate.setHours(0, 0, 0, 0);

  const blocks = splitByRoutes(fullText);
  if (!blocks.length) throw new Error("No routes found");

  const routes = [];
  for (const { routeNo, text } of blocks) {
    const stops = parseStopsFromBlock(text);
    if (stops.length) {
      routes.push({ routeNo, date: routeDate, stops });
    }
  }

  return routes;
}

export async function saveParsedRoutesToDb(BusRouteModel, routes) {
  const bulk = BusRouteModel.collection.initializeUnorderedBulkOp();
  for (const r of routes) {
    bulk
      .find({ routeNo: r.routeNo, date: r.date })
      .upsert()
      .updateOne({ $set: { stops: r.stops } });
  }
  return await bulk.execute();
}

export function extractLocations(routes) {
  const set = new Set();
  routes.forEach(r => r.stops.forEach(s => set.add(s.location.trim())));
  return [...set].sort().map(name => ({ label: name, value: name }));
}
