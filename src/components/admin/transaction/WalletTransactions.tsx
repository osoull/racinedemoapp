import { Transaction } from "@/types/investment"

interface WalletTransactionsProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
}

export function WalletTransactions({ transactions, isLoading }: WalletTransactionsProps) {
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!transactions || transactions.length === 0) {
    return <div>No transactions found.</div>
  }

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(transaction.created_at).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.user?.first_name} {transaction.user?.last_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
