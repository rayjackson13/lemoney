import type { Option } from '$types/forms'
import { writable } from 'svelte/store'

const defaultCategories: Option[] = [
  { name: 'Транспорт', value: 'transportation' },
  { name: 'Здоровье и уход', value: 'health' },
  { name: 'Образование', value: 'education' },
  { name: 'Развлечения', value: 'entertainment' },
  { name: 'Туризм и путешествия', value: 'tourism' },
  { name: 'Продукты и хозтовары', value: 'groceries' },
  { name: 'Рестораны и доставки', value: 'restaurants' },
  { name: 'Коммунальные услуги', value: 'public-utilities' },
  { name: 'Жилье, аренда, квартплата', value: 'rent' },
  { name: 'Интернет и связь', value: 'communications' },
  { name: 'Непредвиденное и ремонт', value: 'unexpected' },
  { name: 'Одежда и товары', value: 'goods' },
  { name: 'Цифровые покупки', value: 'digital-shopping' },
  { name: 'Кредит', value: 'loan' },
  { name: 'Крупные траты', value: 'large-expenses' },
  { name: 'Вредные привычки', value: 'bad-habits' },
  { name: 'Подарки', value: 'gifts' },
  { name: 'Автомобиль и бензин', value: 'car-expenses' },
  { name: 'Товары для бизнеса', value: 'business' },
].toSorted((a, b) => a.name.localeCompare(b.name))

export const categories = writable<Option[]>(defaultCategories)
