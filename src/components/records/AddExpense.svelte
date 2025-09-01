<script lang="ts">
  import DatePicker from '$components/common/DatePicker/DatePicker.svelte'
  import MoneyInput from '$components/common/MoneyInput/MoneyInput.svelte'
</script>

<div class="Card">
  <div class="Card-header items-center justify-between">
    <p class="text-sm leading-[16px] font-medium">Добавить транзакцию</p>

    <div class="flex items-center gap-1">
      <span class="Hotkey">Ctrl+N</span>
      <button class="IconButton" aria-label="Добавить строку">
        <i class="fas fa-plus h-4 w-4! text-sm leading-4!"></i>
      </button>
    </div>
  </div>

  <div class="flex items-center gap-1 px-4 py-2">
    <DatePicker />

    <MoneyInput />

    <input class="Input flex-1" type="text" placeholder="Описание" />

    <button class="IconButton" aria-label="Удалить строку">
      <i class="fas fa-xmark pt-[1px] text-sm"></i>
    </button>
  </div>

  <div class="Card-footer justify-end">
    <span class="Hotkey">Ctrl+Enter</span>

    <button class="Button-dark">
      <i class="fas fa-check h-[14px] w-[14px]! text-[12px]"></i>
      <span class="pb-[1px]">Добавить</span>
    </button>
  </div>
</div>
