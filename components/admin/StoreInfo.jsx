'use client'
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"

const StoreInfo = ({ store }) => {
    return (
        <div className="flex-1 space-y-4 text-sm bg-surface/30 p-6 rounded-2xl border border-secondary/10">
            <Image width={100} height={100} src={store.logo} alt={store.name} className="max-w-20 max-h-20 object-contain shadow rounded-full max-sm:mx-auto border-2 border-secondary/20 bg-white" />
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <h3 className="text-2xl font-serif font-medium text-text-main"> {store.name} </h3>
                <span className="text-sm text-text-muted">@{store.username}</span>

                {/* Status Badge */}
                <span
                    className={`text-xs font-semibold px-4 py-1.5 rounded-full border ${store.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                        : store.status === 'rejected'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-green-50 text-green-800 border-green-200'
                        }`}
                >
                    {store.status}
                </span>
            </div>

            <p className="text-text-muted/80 my-5 max-w-2xl leading-relaxed">{store.description}</p>
            <div className="space-y-2 text-text-muted">
                <p className="flex items-center gap-3"> <MapPin size={18} className="text-secondary" /> {store.address}</p>
                <p className="flex items-center gap-3"><Phone size={18} className="text-secondary" /> {store.contact}</p>
                <p className="flex items-center gap-3"><Mail size={18} className="text-secondary" />  {store.email}</p>
            </div>

            <p className="text-text-main mt-6 pt-6 border-t border-secondary/10">Applied  on <span className="text-xs text-text-muted ml-1">{new Date(store.createdAt).toLocaleDateString()}</span> by</p>
            <div className="flex items-center gap-3 text-sm mt-3 bg-white/50 p-3 rounded-xl w-fit border border-secondary/10">
                <Image width={36} height={36} src={store.user.image} alt={store.user.name} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="text-text-main font-medium">{store.user.name}</p>
                    <p className="text-text-muted text-xs">{store.user.email}</p>
                </div>
            </div>
        </div>
    )
}

export default StoreInfo