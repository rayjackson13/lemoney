<script lang="ts">
  import Autocomplete from '$components/common/Autocomplete/Autocomplete.svelte'
  import DatePicker from '$components/common/DatePicker/DatePicker.svelte'
  import MoneyInput from '$components/common/MoneyInput/MoneyInput.svelte'
  import type { Option, Transaction } from '$types/forms'
  import { fly } from 'svelte/transition'
  import { categories } from '$stores/categories'

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
</script>

<div
  class="AddRecordForm-recordRow flex items-center gap-1 px-4"
  in:fly={{ x: 16, duration: 150 }}
  data-index={index}
>
  <DatePicker bind:value={record.date} />

  <Autocomplete options={entryTypes} placeholder="Тип" bind:value={record.type} />

  <MoneyInput placeholder="Сумма" bind:value={record.amount} />

  <input class="Input flex-1" type="text" placeholder="Описание" bind:value={record.description} />

  <Autocomplete
    classes={{ root: 'w-45' }}
    options={$categories}
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
