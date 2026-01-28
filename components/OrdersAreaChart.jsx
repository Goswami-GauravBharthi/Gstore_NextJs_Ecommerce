'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function OrdersAreaChart({ allOrders }) {

    // Group orders by date
    const ordersPerDay = allOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0] // format: YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {})

    // Convert to array for Recharts
    const chartData = Object.entries(ordersPerDay).map(([date, count]) => ({
        date,
        orders: count
    }))

    return (
        <div className="w-full max-w-4xl h-[300px] text-xs font-sans">
            <h3 className="text-lg font-medium text-text-main mb-6 pt-2 text-right font-serif"> <span className='text-text-muted'>Orders /</span> Day</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#8D7B68" strokeOpacity={0.1} />
                    <XAxis dataKey="date" stroke="#5D5650" tick={{ fill: '#5D5650' }} tickLine={{ stroke: '#5D5650' }} />
                    <YAxis allowDecimals={false} stroke="#5D5650" tick={{ fill: '#5D5650' }} tickLine={{ stroke: '#5D5650' }} label={{ value: 'Orders', angle: -90, position: 'insideLeft', fill: '#5D5650' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FDFBF7', borderColor: '#8D7B68', color: '#2C1810', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="orders" stroke="#4A3728" fill="#8D7B68" fillOpacity={0.3} strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
