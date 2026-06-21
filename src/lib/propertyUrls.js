export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPropertySlug(property = {}) {
  if (property.slug) return property.slug;
  const name = property.name || "";
  const location = property.location || "";
  const combined = [name, location].filter(Boolean).join(" ");
  if (!combined.toLowerCase().includes("pune")) {
    return slugify(combined + " pune");
  }
  return slugify(combined);
}

export function getPropertyUrl(property = {}) {
  return `/properties/${getPropertySlug(property)}`;
}

export function getIdFromPropertyParam(param = "") {
  const value = String(param);
  const match = value.match(/[a-f\d]{24}$/i);
  return match ? match[0] : value;
}

