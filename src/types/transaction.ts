export interface Transaction {
  id: string
  amount: number
  type: string
  status: string
  created_at: string
  user: {
    first_name: string
    last_name: string
  }
  investment?: {
    amount: number
    project: {
      title: string
    }
  }
}