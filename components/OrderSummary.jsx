'use client'
import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react'
import AddressModal from './AddressModal';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Protect, useAuth, useUser } from "@clerk/nextjs";
import axios from 'axios';
import { fetchCart } from '@/lib/features/cart/cartSlice';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/framermotionAnimation';


const OrderSummary = ({ totalPrice, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const { user } = useUser();
    const { getToken } = useAuth();

    const router = useRouter();
    const dispatch = useDispatch();

    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    const handleCouponCode = async (event) => {
        event.preventDefault();
        try {

            if (!user) {
                return toast.error("Please login to procced");
            }

            const token = await getToken();

            const { data } = await axios.post("/api/coupon", { code: couponCodeInput }, { headers: { Authorization: `Bearer ${token}` } })
            setCoupon(data.coupon);
            toast.success("Coupon applied successfully");

        } catch (error) {
            toast.error(error?.response?.data?.error || error.message);
        }

    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        try {

            if (!user) {
                return toast.error("Please login to procced");
            }
            if (!selectedAddress) {
                return toast.error("Please select an address");
            }
            const token = await getToken();

            const orderData = {
                addressId: selectedAddress.id,
                paymentMethod,
                couponCode: coupon ? coupon.code : null,
                items
            }



            const { data } = await axios.post("/api/orders", { orderData }, { headers: { Authorization: `Bearer ${token}` } })

            if (paymentMethod === "STRIPE") {
                window.location.href = data.session.url;
            } else {
                toast.success(data.message);
                router.push("/orders");
                dispatch(fetchCart());
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error || error.message);
        }
    }

    return (
        <motion.div
            variants={fadeIn('left', 0.2)}
            initial="hidden"
            animate="show"
            className='w-full max-w-lg lg:max-w-[340px] bg-surface/50 border border-secondary/10 text-text-muted text-sm rounded-xl p-7 backdrop-blur-sm mb-7' 
        >
            <h2 className='text-xl font-medium text-text-main font-serif'>Payment Summary</h2>
            <p className='text-text-muted/70 text-xs my-4'>Payment Method</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-primary' />
                <label htmlFor="COD" className='cursor-pointer text-text-main'>COD</label>
            </div>
            <div className='flex gap-2 items-center mt-2'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-primary' />
                <label htmlFor="STRIPE" className='cursor-pointer text-text-main'>Stripe Payment</label>
            </div>
            <div className='my-4 py-4 border-y border-secondary/10 text-text-muted/80'>
                <p className="mb-2">Address</p>
                {
                    selectedAddress ? (
                        <div className='flex gap-2 items-start justify-between bg-white/50 p-3 rounded-lg border border-secondary/10'>
                            <p className="text-text-main text-xs leading-relaxed">{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer text-secondary min-w-[18px]' size={18} />
                        </div>
                    ) : (
                        <div>
                            {
                                addressList?.length > 0 && (
                                    <select className='border border-secondary/20 bg-background p-2 w-full my-3 outline-none rounded text-text-main focus:border-secondary transition' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                        <option value="">Select Address</option>
                                        {
                                            addressList.map((address, index) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1 text-primary hover:text-primary/80 mt-1 font-medium transition' onClick={() => setShowAddressModal(true)} >Add Address <PlusIcon size={16} /></button>
                        </div>
                    )
                }
            </div>
            <div className='pb-4 border-b border-secondary/10'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-text-muted/80'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right text-text-main'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p><Protect plan={"plus"} fallback={`${currency}50`}>
                            Free
                        </Protect></p>
                        {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex justify-center gap-3 mt-4'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-secondary/20 p-2 rounded w-full outline-none bg-background text-text-main focus:border-secondary transition' />
                            <button className='bg-secondary text-white px-4 rounded hover:bg-secondary/90 active:scale-95 transition-all text-sm'>Apply</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-3 bg-success/10 p-2 rounded text-success border border-success/20'>
                            <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                            <p>{coupon.description}</p>
                            <XIcon size={16} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4 text-text-main font-serif'>
                <p className="text-lg">Total:</p>
                <p className='font-semibold text-lg text-right'>
                    <Protect plan={"plus"} fallback={`${currency}${coupon ? (totalPrice + 50 - (coupon.discount / 100 * totalPrice)).toFixed(2) : (totalPrice + 50).toLocaleString()}`}>
                        {currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : (totalPrice).toLocaleString()}
                    </Protect>
                </p>
            </div>
            <button onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'placing Order...' })} className='w-full bg-primary text-primary-foreground py-3 rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/20 font-medium'>Place Order</button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </motion.div>
    )
}

export default OrderSummary