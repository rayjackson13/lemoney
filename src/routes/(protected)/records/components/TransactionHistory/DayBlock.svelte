<script lang="ts">
  import ContextMenu from '$components/common/ContextMenu/ContextMenu.svelte'
  import { categories } from '$stores/categories'
  import { editTransaction } from '$stores/editTransaction'
  import { transactionTypes } from '$stores/transactionTypes'
  import type { ContextMenuOption, Option, Transaction } from '$types/forms'
  import type { Position } from '$types/global'
  import { parseDateFromISOString } from '$utils/dates'
  import { FirebaseController } from '$utils/firebase/FirebaseController'
  import { isTouchDevice } from '$utils/platform/getOS'
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
  let selectedId = $state<string | null>(null)
  let touchTimer: ReturnType<typeof setTimeout>
  let shouldIgnoreClicks = false
  const date = parseDateFromISOString(dateISO)
  const formatter = Intl.NumberFormat('ru', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

  function getTransactionType(transaction: Transaction): Option | null {
    return transactionTypes.find((type) => type.value === transaction.type) ?? null
  }

  function getCategory(transaction: Transaction): string | null {
    if (transaction.type && ['Expense', 'ExpensePlanned'].includes(transaction.type)) {
      return $categories.find((cat) => cat.value === transaction.category)?.name ?? null
    }

    return getTransactionType(transaction)?.name ?? null
  }

  const closeMenu = () => {
    ctxMenuPosition = null
    selectedId = null
  }

  const openContextMenu = (target: HTMLElement | null, position: Position) => {
    if (!target) return

    selectedId = target.getAttribute('data-id')
    ctxMenuPosition = position
  }

  const onTouchMove = () => {
    clearTimeout(touchTimer)
  }

  const onTouchEnd = (ev: TouchEvent) => {
    if (shouldIgnoreClicks) ev.preventDefault()
    clearTimeout(touchTimer)
    shouldIgnoreClicks = false
  }

  const onTouchStart = (ev: TouchEvent) => {
    console.log('touch', ev.currentTarget, ev)
    if (!ev.targetTouches.length) return

    const target: HTMLElement = ev.currentTarget as HTMLElement
    const touch: Touch = ev.targetTouches[0]

    touchTimer = setTimeout(() => {
      shouldIgnoreClicks = true
      openContextMenu(target, { x: touch.clientX, y: touch.clientY })
    }, 200)
  }

  const onContextMenu = (ev: MouseEvent) => {
    if (disableHover || isTouchDevice()) {
      ev.preventDefault()
      return
    }

    ev.preventDefault()

    if (ctxMenuPosition) {
      closeMenu()
      return
    }

    openContextMenu(ev.currentTarget as HTMLElement, { x: ev.clientX, y: ev.clientY })
  }

  const removeTransaction = async (): Promise<void> => {
    if (!selectedId) return

    try {
      FirebaseController.removeTransaction(selectedId)
    } catch (e) {
      console.error(e)
    }
  }

  const onEditTransaction = async (): Promise<void> => {
    if (!selectedId) return

    const tx = transactions.find((item) => item.id === selectedId)
    if (!tx) return

    editTransaction.set(tx)
  }

  const contextMenuOptions: ContextMenuOption[] = [
    {
      icon: 'fas fa-pencil',
      name: 'Изменить',
      onClick: onEditTransaction,
    },
    {
      icon: 'fas fa-close',
      name: 'Удалить',
      onClick: removeTransaction,
    },
  ]
</script>

<div class="flex min-w-0 select-none flex-col">
  <div class="px-4 py-1 text-xs leading-[16px] opacity-70">
    {date ? format(date, 'd MMMM', { locale: ru }) : '<дата не указана>'}
  </div>

  {#each transactions as item (item.id)}
    {@const ribbonColor = getTransactionType(item)?.ribbon ?? '--color-gray-300'}
    {@const sign = item.type === 'Income' ? '+' : '-'}

    <div
      class={clsx(
        'duration-50 flex h-10 items-center gap-2 px-4 py-1 transition-colors',
        !disableHover && 'hover:bg-gray-100',
        selectedId === item.id && 'bg-gray-100',
      )}
      oncontextmenu={onContextMenu}
      ontouchstart={onTouchStart}
      ontouchend={onTouchEnd}
      ontouchmove={onTouchMove}
      data-id={item.id}
      role="listitem"
    >
      <div
        class={clsx(
          `translate-z-0 backface-hidden h-full w-0 rounded  border-l-2`,
          `border-${ribbonColor}`,
        )}
      ></div>

      <div class="flex h-8 min-w-0 flex-1 flex-col overflow-hidden">
        <p class="overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-[1.2]">
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

<ContextMenu
  {closeMenu}
  isOpen={!!ctxMenuPosition}
  mousePosition={ctxMenuPosition}
  options={contextMenuOptions}
/>
