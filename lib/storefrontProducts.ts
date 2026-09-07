export const PUBLIC_PRODUCT_FIELDS = `
  id,
  title,
  price,
  description,
  description_ua,
  category,
  status,
  images,
  position,
  color_variants
`;

export const PUBLIC_PRODUCT_WITH_VARIANTS_FIELDS = `
  ${PUBLIC_PRODUCT_FIELDS},
  product_variants (
    size,
    stock
  )
`;

export const ADMIN_PRODUCT_FIELDS = `
  ${PUBLIC_PRODUCT_FIELDS},
  is_active,
  product_variants (
    id,
    size,
    stock
  )
`;
