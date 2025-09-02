<script lang="ts">
  import Autocomplete from '$components/common/Autocomplete/Autocomplete.svelte'
  import DatePicker from '$components/common/DatePicker/DatePicker.svelte'
  import MoneyInput from '$components/common/MoneyInput/MoneyInput.svelte'
  import type { Option, Transaction } from '$types/forms'
  import { fly } from 'svelte/transition'

  type Props = {
    index: number
    record: Transaction
    removeRecord: (index: number) => void
  }

  let { index, record = $bindable(), removeRecord }: Props = $props()

  const entryTypes: Option[] = [
    { name: 'Расход', value: 'Expense', ribbon: 'bg-red-300' },
    { name: 'Доход', value: 'Income', ribbon: 'bg-green-300' },
    { name: 'План', value: 'ExpensePlanned', ribbon: 'bg-red-300' },
    { name: 'Инвестиции', value: 'Investment', ribbon: 'bg-violet-300' },
    { name: 'Сбережения', value: 'Savings', ribbon: 'bg-amber-300' },
  ]

  const categories: Option[] = [
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
</script>

<div
  class="flex items-center gap-1 px-4"
  transition:fly={{ x: 16, duration: 150 }}
  data-index={index}
>
  <DatePicker bind:value={record.date} />

  <Autocomplete options={entryTypes} placeholder="Тип" bind:value={record.type} />

  <MoneyInput bind:value={record.amount} />

  <input class="Input flex-1" type="text" placeholder="Описание" bind:value={record.description} />

  <Autocomplete
    classes="w-45"
    options={categories}
    placeholder="Категория"
    bind:value={record.category}
  />

  <button
    class="IconButton"
    aria-label="Удалить строку"
    type="button"
    onclick={() => removeRecord(index)}
  >
    <i class="fas fa-xmark pt-[1px] text-sm"></i>
  </button>
</div>
