/**
 * Форматирует цену для отображения на сайте.
 * 80 -> "80€", 39.9 -> "39.90€"
 * Принимает как число (новый формат из БД), так и строку на всякий случай
 * (защита на переходный период, если где-то останутся старые данные).
 */
export function formatPrice(price: number | string | null | undefined): string {
  const num =
    typeof price === 'number'
      ? price
      : parseFloat(String(price ?? '0').replace(/[^0-9.]/g, '')) || 0;

  return Number.isInteger(num) ? `${num}€` : `${num.toFixed(2)}€`;
}

/**
 * Превращает цену (число или старую строку с €) в чистое число для расчётов.
 */
export function parsePrice(price: number | string | null | undefined): number {
  if (typeof price === 'number') return price;
  return parseFloat(String(price ?? '0').replace(/[^0-9.]/g, '')) || 0;
}