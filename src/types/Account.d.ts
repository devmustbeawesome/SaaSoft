export type AccountTypes = 'ldap' | 'local'

// Общие свойства для всех аккаунтов
type BaseAccount = {
  id: number
  marker: string[]
  login: string
  type: AccountTypes
}

// Уточняем тип в зависимости от `type`:
export type Account =
  | (BaseAccount & { type: 'ldap'; password: null }) // LDAP: пароль всегда null
  | (BaseAccount & { type: 'local'; password: string }) // Local: пароль обязателен
