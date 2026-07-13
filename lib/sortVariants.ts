// Стандартный порядок размеров — единая точка правды для всего сайта.
// Используется и в админке (ProductModal), и на странице товара (ProductClient),
// чтобы порядок был одинаковым и предсказуемым независимо от того,
// в каком физическом порядке Postgres вернул строки из product_variants.
const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2XL', '3XL', '4XL', 'OS'];

export function sortVariants(variants: any[]): any[] {
  if (!Array.isArray(variants)) return [];

  return [...variants].sort((a, b) => {
    const sizeA = String(a.size || '').toUpperCase().trim();
    const sizeB = String(b.size || '').toUpperCase().trim();
    const idxA = SIZE_ORDER.indexOf(sizeA);
    const idxB = SIZE_ORDER.indexOf(sizeB);

    // Если оба размера есть в стандартном списке — сортируем по нему
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    // Известный размер всегда идёт раньше неизвестного (например, числового — 38, 39, 40 для обуви)
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    // Оба неизвестны (например, размеры обуви) — сортируем по числу/алфавиту
    const numA = parseFloat(sizeA);
    const numB = parseFloat(sizeB);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return sizeA.localeCompare(sizeB);
  });
}