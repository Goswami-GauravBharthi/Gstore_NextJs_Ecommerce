'use client'
import { StarIcon, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL

    // Safety check for rating
    const ratingCount = product.rating?.length || 0;
    const averageRating = ratingCount > 0
        ? product.rating.reduce((acc, curr) => acc + curr.rating, 0) / ratingCount
        : 0;
    const rating = Math.round(averageRating);

    return (
        <Link
            href={`/product/${product.id}`}
            className='group bg-white rounded-2xl border border-gray-100 p-3 hover:border-gray-200 hover:shadow-xl transition-all duration-300 ease-out flex flex-col w-full sm:w-[280px] hover:-translate-y-1'
        >
            <div className='relative aspect-square rounded-xl overflow-hidden mb-3 flex items-center justify-center '>
                <Image
                    width={500}
                    height={500}
                    className='w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500'
                    src={product.images[0]}
                    alt={product.name}
                />

                {/* Overlay Action Button (optional aesthetic touch) */}
                <div className='absolute bottom-3 right-3 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                    <span className='bg-black text-white p-2.5 rounded-full flex shadow-lg'>
                        <ShoppingBag size={18} />
                    </span>
                </div>
            </div>

            <div className='space-y-2 px-1'>
                <p className='font-medium text-gray-900 group-hover:text-amber-600 transition-colors truncate'>{product.name}</p>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon
                                key={index}
                                size={14}
                                className={`${index < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                            />
                        ))}
                        <span className='text-xs text-gray-400 ml-1'>({ratingCount})</span>
                    </div>
                </div>

                <div className='flex items-center justify-between pt-1'>
                    <p className='text-lg font-bold text-slate-900'>{currency}{product.price}</p>
                    <p className='text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full'>In Stock</p>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard