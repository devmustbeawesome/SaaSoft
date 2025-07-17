export type AccountType = 'ldap' | 'local'
export type Marker = { text: string }
// Общие свойства для всех аккаунтов
type BaseAccount = {
  id: number
  marker: Marker[]
  login: string
  type: AccountType
}

// Уточняем тип в зависимости от `type`:
export type Account =
  | (BaseAccount & { type: 'ldap'; password: null }) // LDAP: пароль всегда null
  | (BaseAccount & { type: 'local'; password: string }) // Local: пароль обязателен
