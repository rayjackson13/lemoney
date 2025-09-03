<script lang="ts">
  import type { Transaction } from '$types/forms'
  import { onMount } from 'svelte'
  import RecordRow from './Row.svelte'
  import { dateToISOString, parseDateFromISOString } from '$utils/dates'
  import { isValid } from 'date-fns'

  const getDefaultRecord = (): Transaction => ({
    amount: null,
    category: null,
    date: dateToISOString(new Date()),
    description: '',
    id: crypto.randomUUID(),
    type: 'Expense',
  })

  let records = $state<Transaction[]>([getDefaultRecord()])

  const addRecord = (): void => {
    records.push(getDefaultRecord())
  }

  const removeRecord = (index: number): void => {
    if (records.length > 1) {
      records.splice(index, 1)
      return
    }

    const { id } = records[0]
    records = [{ ...getDefaultRecord(), id }]
  }

  const isRowValid = (row: Transaction): boolean => {
    const date = parseDateFromISOString(row.date)
    return !!date && isValid(date) && row.amount !== null
  }

  const validate = (): Transaction[] => {
    return records.filter(isRowValid)
  }

  const onSubmit = async (ev?: SubmitEvent): Promise<void> => {
    ev?.preventDefault()

    const validRows = validate()
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(validRows),
      })
      records = [getDefaultRecord()]
    } catch (e) {
      console.error(e)
    }
  }

  const handleShortcuts = (ev: KeyboardEvent): void => {
    if (ev.altKey && ev.code === 'KeyN') {
      ev.preventDefault()
      addRecord()
      return
    }

    if (ev.ctrlKey && ev.code === 'Enter') {
      ev.preventDefault()
      onSubmit()
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleShortcuts, true)

    return () => {
      document.removeEventListener('keydown', handleShortcuts, true)
    }
  })
</script>

<form class="Card" onsubmit={onSubmit}>
  <div class="Card-header items-center justify-between">
    <p class="text-sm leading-[16px] font-medium">Добавить транзакцию</p>

    <div class="flex items-center gap-1">
      <span class="Hotkey">Alt+N</span>
      <button class="IconButton" aria-label="Добавить строку" type="button" onclick={addRecord}>
        <i class="fas fa-plus h-4 w-4! text-sm leading-4!"></i>
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-1 py-2">
    {#each records as record, index (record.id)}
      <RecordRow bind:record={records[index]} {index} {removeRecord} />
    {/each}
  </div>

  <div class="Card-footer justify-end">
    <span class="Hotkey">Ctrl+Enter</span>

    <button class="Button-dark" type="submit">
      <i class="fas fa-check h-[14px] w-[14px]! text-[12px]"></i>
      <span class="pb-[1px]">Добавить</span>
    </button>
  </div>
</form>
