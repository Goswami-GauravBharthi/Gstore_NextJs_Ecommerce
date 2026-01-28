'use client'
import { XIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"
import { useDispatch } from "react-redux"
import axios from "axios"
import { addAddress } from "@/lib/features/address/addressSlice"

const AddressModal = ({ setShowAddressModal }) => {

    const { getToken } = useAuth();
    const dispath = useDispatch();

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    })

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = await getToken();
            const { data } = await axios.post("/api/address", { address }, { headers: { Authorization: `Bearer ${token}` } })

            dispath(addAddress(data.newAddress))
            toast.success("Address Added Successfully")
            setShowAddressModal(false)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={e => toast.promise(handleSubmit(e), { loading: 'Adding Address...' })} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm h-screen flex items-center justify-center p-4">
            <div className="flex flex-col gap-5 text-text-main w-full max-w-sm bg-surface p-8 rounded-2xl shadow-xl border border-secondary/10 relative">
                <h2 className="text-3xl font-serif">Add New <span className="font-semibold text-primary">Address</span></h2>
                <input name="name" onChange={handleAddressChange} value={address.name} className="p-3 px-4 outline-none border border-secondary/20 bg-background rounded-lg w-full focus:border-primary transition" type="text" placeholder="Enter your name" required />
                <input name="email" onChange={handleAddressChange} value={address.email} className="p-3 px-4 outline-none border border-secondary/20 bg-background rounded-lg w-full focus:border-primary transition" type="email" placeholder="Email address" required />
                <input name="street" onChange={handleAddressChange} value={address.street} className="p-3 px-4 outline-none border border-secondary/20 bg-background rounded-lg w-full focus:border-primary transition" type="text" placeholder="Street" required />
                <div className="flex gap-4">
                    <input name="city" onChange={handleAddressChange} value={address.city} className="p-3 px-4 outline-none border border-secondary/20 bg-background rounded-lg w-full focus:border-primary transition" type="text" placeholder="City" required />
                    <input name="state" onChange={handleAddressChange} value={address.state} className="p-3 px-4 outline-none border border-secondary/20 bg-background rounded-lg w-full focus:border-primary transition" type="text" placeholder="State" required />
                </div>
                <div className="flex gap-4">
                    <input name="zip" onChange={handleAddressChange} value={address.zip} className="p-3 px-4 outline-none border border-secondary/20 bg-background rounded-lg w-full focus:border-primary transition" type="number" placeholder="Zip code" required />
                    <input name="country" onChange={handleAddressChange} value={address.country} className="p-3 px-4 outline-none border border-secondary/20 bg-background rounded-lg w-full focus:border-primary transition" type="text" placeholder="Country" required />
                </div>
                <input name="phone" onChange={handleAddressChange} value={address.phone} className="p-3 px-4 outline-none border border-secondary/20 bg-background rounded-lg w-full focus:border-primary transition" type="text" placeholder="Phone" required />
                <button className="bg-primary text-primary-foreground text-sm font-medium py-3.5 rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20">SAVE ADDRESS</button>
                <XIcon size={24} className="absolute top-5 right-5 text-text-muted hover:text-text-main cursor-pointer hover:rotate-90 transition duration-300" onClick={() => setShowAddressModal(false)} />
            </div>
        </form>
    )
}

export default AddressModal