import slugify from 'slugify';
export default function makeSlug(title) {
  return slugify(title, { lower: true, strict: true });
}
