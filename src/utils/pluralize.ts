export type Endings = {
  one: string
  few?: string
  many: string
}

/**
 * Возвращает правильное склонение слова в зависимости от числа.
 *
 * @param {number} n - Число, для которого необходимо подобрать окончание.
 * @param {Endings} endings - Объект с возможными окончаниями слов:
 *   - `one` — форма для чисел, оканчивающихся на 1 (кроме 11).
 *   - `few` — форма для чисел, оканчивающихся на 2-4 (кроме 12-14).
 *   - `many` — форма для остальных случаев (5-9, 0, 11-19).
 */
export const pluralize = (n: number, endings: Endings): string => {
  const lastDigit = n % 10
  const lastTwoDigits = n % 100

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return endings.one
  }

  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) {
    return endings.few ?? endings.many
  }

  return endings.many
}
