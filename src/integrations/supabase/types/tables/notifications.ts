export interface NotificationsTable {
  Row: {
    notification_id: string
    user_id: string | null
    title: string
    message: string
    read: boolean
    date: string
  }
  Insert: {
    notification_id?: string
    user_id?: string | null
    title: string
    message: string
    read?: boolean
    date?: string
  }
  Update: {
    notification_id?: string
    user_id?: string | null
    title?: string
    message?: string
    read?: boolean
    date?: string
  }
}