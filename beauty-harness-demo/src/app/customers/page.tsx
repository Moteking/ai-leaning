'use client'

import CustomerTable from '@/components/CustomerTable'

export default function CustomersPage() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-black text-primary">顧客リスト</h1>
        <p className="text-xs text-gray-400">AI分析付き顧客管理</p>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-[10px] text-red-400">HPB経由</p>
          <p className="text-2xl font-black text-red-600">3</p>
          <p className="text-[10px] text-red-400">名</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-[10px] text-green-400">自社予約</p>
          <p className="text-2xl font-black text-green-600">1</p>
          <p className="text-[10px] text-green-400">名</p>
        </div>
      </div>

      <CustomerTable />
    </div>
  )
}
