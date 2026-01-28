'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL;
    const { getToken } = useAuth();

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } })
            setDashboardData(data.dashboardData)

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.error || error.message)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-text-muted">
            <h1 className="text-3xl font-serif text-text-main">Admin <span className="text-primary font-medium">Dashboard</span></h1>

            {/* Cards */}
            <div className="flex flex-wrap gap-5 my-8 mt-6">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-8 border border-secondary/10 bg-white/40 p-5 px-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col gap-2 text-sm">
                                <p className="text-text-muted font-medium uppercase tracking-wide text-xs">{card.title}</p>
                                <b className="text-3xl font-serif font-medium text-text-main">{card.value}</b>
                            </div>
                            <card.icon size={50} className="w-12 h-12 p-3 text-secondary bg-secondary/10 rounded-full" />
                        </div>
                    ))
                }
            </div>

            {/* Area Chart */}
            <div className="bg-white/40 border border-secondary/10 rounded-2xl p-6 shadow-sm">
                <OrdersAreaChart allOrders={dashboardData.allOrders} />
            </div>
        </div>
    )
}