<script setup lang="ts">
import { computed } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { useAccountsStore } from '@/stores/useAccountsStore'
import type { Account, AccountType } from '@/types/Account'
import { ElMessage } from 'element-plus'

const store = useAccountsStore()

// Преобразование для отображения
const displayAccounts = computed(() => {
  return store.accounts.map((account) => ({
    ...account,
    markersText: account.marker.map((m) => m.text).join('; '),
  }))
})

const addEmptyAccount = () => {
  store.addAccount('', '', [])
}

const updateAccount = (account: Account & { markersText?: string }) => {
  try {
    store.updateAccount(account)
    ElMessage.success('Аккаунт обновлён')
  } catch (error) {
    ElMessage.error('Ошибка при обновлении')
    console.error(error)
  }
}

const updateMarkers = (account: Account & { markersText?: string }) => {
  const markers =
    account.markersText
      ?.split(';')
      .map((m) => m.trim())
      .filter((m) => m.length > 0)
      .map((m) => ({ text: m })) || []

  store.updateAccount({
    ...account,
    marker: markers,
  })
}

const handleTypeChange = (account: Account, newType: AccountType) => {
  if (newType === 'ldap') {
    account.password = null
  } else if (!account.password) {
    account.password = ''
  }
  account.type = newType
  updateAccount(account)
}

const deleteAccount = (account: Account) => {
  store.deleteAccount(account.id)
  ElMessage.success('Аккаунт удалён')
}
const spanMethod = ({
  row,
  columnIndex,
}: {
  row: Account & { markersText?: string }
  columnIndex: number
}) => {
  if (row.type === 'ldap' && columnIndex === 2) {
    return { rowspan: 1, colspan: 2 } // Объединяем столбцы "Тип" и "Пароль"
  }
  if (row.type === 'ldap' && columnIndex === 3) {
    return { rowspan: 0, colspan: 0 } // Скрываем ячейку "Пароль"
  }
  return { rowspan: 1, colspan: 1 }
}
</script>

<template>
  <div class="account-manager">
    <div class="table_legend">
      <span style="font-size: 2rem">Учетные записи</span>
      <el-button @click="addEmptyAccount" :icon="Plus"></el-button>
    </div>
    <el-table :data="displayAccounts" style="width: 100%" :span-method="spanMethod">
      <el-table-column label="Метки" prop="markers">
        <template #default="{ row }">
          <el-input
            v-model="row.markersText"
            @blur="() => updateMarkers(row)"
            placeholder="Метки через ;"
          />
        </template>
      </el-table-column>
      <el-table-column label="Тип" width="150" prop="type">
        <template #default="{ row }">
          <el-select
            v-model="row.type"
            @change="(val: AccountType) => handleTypeChange(row, val)"
            style="width: 100%"
          >
            <el-option label="LDAP" value="ldap" />
            <el-option label="Local" value="local" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="login" label="Логин">
        <template #default="{ row }">
          <el-input
            v-model="row.login"
            @blur="() => updateAccount(row)"
            placeholder="Введите логин"
          />
        </template>
      </el-table-column>

      <el-table-column label="Пароль" width="200" prop="password">
        <template #default="{ row }">
          <el-input
            v-if="row.type === 'local'"
            v-model="row.password"
            type="password"
            show-password
            @blur="() => updateAccount(row)"
            placeholder="Введите пароль"
          />
        </template>
      </el-table-column>

      <el-table-column width="120" prop="action">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="deleteAccount(row)" :icon="Delete" circle />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.account-manager {
  padding: 20px;
}
.table_legend {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
}

.toolbar {
  margin-bottom: 20px;
}
</style>
