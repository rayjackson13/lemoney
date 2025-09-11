<script lang="ts">
  import ContextMenu from '$components/common/ContextMenu/ContextMenu.svelte'
  import { categories } from '$stores/categories'
  import { transactionTypes } from '$stores/transactionTypes'
  import type { Option, Transaction } from '$types/forms'
  import type { Position } from '$types/global'
  import { parseDateFromISOString } from '$utils/dates'
  import clsx from 'clsx'
  import { format } from 'date-fns'
  import { ru } from 'date-fns/locale'

  type Props = {
    dateISO: string
    disableHover?: boolean
    transactions: Transaction[]
  }

  const { dateISO, disableHover, transactions }: Props = $props()
  let ctxMenuPosition = $state<Position | null>(null)
  let highlightId = $state<string | null>(null)
  const date = parseDateFromISOString(dateISO)
  const formatter = Intl.NumberFormat('ru', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

  function getTransactionType(transaction: Transaction): Option | null {
    return transactionTypes.find((type) => type.value === transaction.type) ?? null
  }

  function getCategory(transaction: Transaction): string | null {
    return $categories.find((cat) => cat.value === transaction.category)?.name ?? null
  }

  const closeMenu = () => {
    ctxMenuPosition = null
    highlightId = null
  }

  const onContextMenu = (ev: MouseEvent) => {
    if (disableHover) return

    ev.preventDefault()

    if (ctxMenuPosition) {
      closeMenu()
      return
    }

    highlightId = (ev.currentTarget as HTMLElement).getAttribute('data-id')
    ctxMenuPosition = {
      x: ev.clientX,
      y: ev.clientY,
    }
  }
</script>

<div class="flex min-w-0 flex-col select-none">
  <div class="px-4 py-1 text-xs leading-[16px] opacity-70">
    {date ? format(date, 'd MMMM', { locale: ru }) : '<дата не указана>'}
  </div>

  {#each transactions as item (item.id)}
    {@const ribbonColor = getTransactionType(item)?.ribbon ?? '--color-gray-300'}
    {@const sign = item.type === 'Income' ? '+' : '-'}

    <div
      class={clsx(
        'flex h-10 items-center gap-2 px-4 py-1 transition-colors duration-50',
        !disableHover && 'hover:bg-gray-100',
        highlightId === item.id && 'bg-gray-100',
      )}
      oncontextmenu={onContextMenu}
      data-id={item.id}
      role="listitem"
    >
      <div
        class={clsx(
          `h-full w-0 translate-z-0 rounded border-l-2  backface-hidden`,
          `border-${ribbonColor}`,
        )}
      ></div>

      <div class="flex h-8 min-w-0 flex-1 flex-col overflow-hidden">
        <p class="overflow-hidden text-sm leading-[1.2] text-ellipsis whitespace-nowrap">
          {item.description || '<нет описания>'}
        </p>

        <span class="text-xs leading-[1.2] opacity-70">
          {getCategory(item) ?? '<без категории>'}
        </span>
      </div>

      <p class={clsx('text-sm', item.type === 'Income' && 'text-green-600')}>
        {sign}{formatter.format(item.amount ?? 0)} &#x20BD;
      </p>
    </div>
  {/each}
</div>

<ContextMenu close={closeMenu} isOpen={!!ctxMenuPosition} mousePosition={ctxMenuPosition} />
