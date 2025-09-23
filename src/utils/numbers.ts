const tokenize = (text: string): (string | number)[] => {
  const tokens: (string | number)[] = []
  let word = ''

  for (const char of text) {
    if (['+', '-'].includes(char)) {
      if (word) {
        tokens.push(Number(word))
        word = ''
      }
      tokens.push(char)
    } else {
      word += char
    }
  }

  if (word) tokens.push(Number(word))

  return tokens
}

export const evaluateNumString = (
  text: string,
  maxValue = Number.MAX_SAFE_INTEGER,
): number | null => {
  const tokens = tokenize(text)
  if (tokens.length === 0) return null

  let result = 0
  let expectingNumber = true
  let currentSign = 1

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (expectingNumber) {
      if (typeof token === 'number') {
        result += currentSign * token
        expectingNumber = false
        currentSign = 1
      } else if ((token === '+' || token === '-') && i === 0) {
        currentSign = token === '+' ? 1 : -1
      } else {
        throw new Error('Ошибка синтаксиса')
      }
    } else {
      if (token === '+' || token === '-') {
        expectingNumber = true
        currentSign = token === '+' ? 1 : -1
      } else {
        throw new Error('Ошибка синтаксиса')
      }
    }
  }

  if (result < 0) {
    throw new Error('Сумма не может быть отрицательной')
  }

  if (result > maxValue) {
    throw new Error(`Сумма не может превышать ${maxValue}`)
  }

  return result
}
