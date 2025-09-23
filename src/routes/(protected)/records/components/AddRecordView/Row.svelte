<script lang="ts">
  import Autocomplete from '$components/common/Autocomplete/Autocomplete.svelte'
  import DatePicker from '$components/common/DatePicker/DatePicker.svelte'
  import type { Transaction } from '$types/forms'
  import { fly } from 'svelte/transition'
  import { categories } from '$stores/categories'
  import NumberInput from '$components/common/NumberInput/NumberInput.svelte'
  import { transactionTypes } from '$stores/transactionTypes'

  type Props = {
    index: number
    record: Transaction
    removeRecord: (index: number) => void
  }

  let { index, record = $bindable(), removeRecord }: Props = $props()
</script>

<div
  class="AddRecordForm-recordRow flex items-center gap-1 px-4"
  in:fly={{ x: 16, duration: 150 }}
  data-index={index}
>
  <DatePicker bind:value={record.date} />

  <Autocomplete options={transactionTypes} placeholder="Тип" bind:value={record.type} />

  <NumberInput
    placeholder="0"
    classes={{ input: 'AddRecordForm-amountInput' }}
    maxValue={999_999_999}
    bind:value={record.amount}
  />

  <input class="Input flex-1" type="text" placeholder="Описание" bind:value={record.description} />

  {#if !record.type || ['Expense', 'ExpensePlanned'].includes(record.type)}
    <Autocomplete
      classes={{ root: 'w-45' }}
      options={$categories}
      placeholder="Категория"
      bind:value={record.category}
    />
  {/if}

  <button
    class="IconButton"
    aria-label="Удалить строку"
    type="button"
    onclick={() => removeRecord(index)}
    tabindex="-1"
  >
    <i class="fas fa-xmark pt-[1px] text-sm"></i>
  </button>
</div>
