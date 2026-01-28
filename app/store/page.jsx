'use client'
import { dummyStoreDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Dashboard() {


    const { getToken } = useAuth();
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Total Earnings', value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Total Ratings', value: dashboardData?.ratings?.length || 0, icon: StarIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/store/dashboard", { headers: { Authorization: `Bearer ${token}` } });

            setDashboardData(data.dashboardData);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error || error.message);

        }
        setLoading(false);
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-text-muted mb-28">
            <h1 className="text-3xl font-serif text-text-main">Seller <span className="text-primary font-medium">Dashboard</span></h1>

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

            <h2 className="text-2xl font-serif text-text-main mt-12 mb-6">Total Reviews</h2>

            <div className="mt-5 space-y-4">
                {
                    dashboardData?.ratings?.map((review, index) => (
                        <div key={index} className="flex max-sm:flex-col gap-5 sm:items-center justify-between p-6 border border-secondary/10 bg-surface/30 rounded-2xl text-sm text-text-muted max-w-4xl hover:shadow-sm transition-all">
                            <div>
                                <div className="flex gap-3">
                                    <Image src={review.user.image} alt="" className="w-10 aspect-square rounded-full border border-secondary/20 p-0.5 object-cover" width={100} height={100} />
                                    <div>
                                        <p className="font-medium text-text-main">{review.user.name}</p>
                                        <p className="font-light text-text-muted/70 text-xs">{new Date(review.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-text-muted max-w-xs leading-relaxed italic">"{review.review}"</p>
                            </div>
                            <div className="flex flex-col justify-between gap-6 sm:items-end">
                                <div className="flex flex-col sm:items-end">
                                    <p className="text-text-muted/60 text-xs uppercase tracking-wide">{review.product?.category}</p>
                                    <p className="font-medium text-text-main font-serif text-lg">{review.product?.name}</p>
                                    <div className='flex items-center gap-0.5 mt-1'>
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon key={index} size={15} className='text-transparent' fill={review.rating >= index + 1 ? "#8D7B68" : "#E5E7EB"} />
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => router.push(`/product/${review.product.id}`)} className="bg-white border border-secondary/10 px-5 py-2.5 hover:bg-surface rounded-full transition-all text-xs font-medium text-text-main shadow-sm hover:shadow">View Product</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}