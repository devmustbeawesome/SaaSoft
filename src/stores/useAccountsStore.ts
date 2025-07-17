import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Account, Marker } from '@/types/Account'

export const useAccountsStore = defineStore('accounts', () => {
  const STORAGE_KEY = 'accounts-data'
  const accounts = ref<Account[]>([])
  let nextId = 1

  // Инициализация из localStorage
  const initFromStorage = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed.accounts)) {
          accounts.value = parsed.accounts
          nextId = Math.max(...accounts.value.map((a) => a.id), 0) + 1
        }
      } catch (e) {
        console.error('Ошибка загрузки аккаунтов', e)
        accounts.value = []
      }
    }
  }

  // Добавление аккаунта
  const addAccount = (login: string, password: string, marker: Marker[] = []): Account => {
    const newAccount: Account = {
      id: nextId++,
      login,
      marker,
      type: 'local',
      password,
    }

    accounts.value.push(newAccount)
    return newAccount
  }

  // Обновление аккаунта
  const updateAccount = (updates: Account) => {
    const index = accounts.value.findIndex((a) => a.id === updates.id)
    if (index !== -1) {
      const account = accounts.value[index]
      accounts.value[index] = { ...account, ...updates }
    }
  }

  // Удаление аккаунта
  const deleteAccount = (id: number) => {
    accounts.value = accounts.value.filter((a) => a.id !== id)
  }

  // Автосохранение
  watch(
    accounts,
    (newVal) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accounts: newVal,
          nextId,
        }),
      )
    },
    { deep: true },
  )

  initFromStorage()

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
  }
})
