'use client'
import { StarIcon, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // Safety check for rating
    const ratingCount = product.rating?.length || 0;
    const averageRating = ratingCount > 0
        ? product.rating.reduce((acc, curr) => acc + curr.rating, 0) / ratingCount
        : 0;
    const rating = Math.round(averageRating);

    return (
        <Link
            href={`/product/${product.id}`}
            className='group bg-surface rounded-2xl border border-secondary/10 p-4 hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300 ease-out flex flex-col w-full sm:w-[280px] hover:-translate-y-1'
        >
            <div className='relative aspect-square rounded-xl overflow-hidden mb-4 flex items-center justify-center bg-white/50'>
                <Image
                    width={500}
                    height={500}
                    className='w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2'
                    src={product.images[0]}
                    alt={product.name}
                />

                {/* Overlay Action Button */}
                <div className='absolute bottom-3 right-3 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                    <span className='bg-primary text-primary-foreground p-3 rounded-full flex shadow-lg hover:bg-primary/90'>
                        <ShoppingBag size={18} />
                    </span>
                </div>
            </div>

            <div className='space-y-2 px-1'>
                <p className='font-medium text-text-main group-hover:text-primary transition-colors truncate text-base'>{product.name}</p>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon
                                key={index}
                                size={14}
                                className={`${index < rating ? "fill-secondary text-secondary" : "fill-secondary/20 text-secondary/20"}`}
                            />
                        ))}
                        <span className='text-xs text-text-muted ml-2'>({ratingCount})</span>
                    </div>
                </div>

                <div className='flex items-center justify-between pt-2'>
                    <p className='text-lg font-bold text-text-main font-serif'>{currency}{product.price}</p>
                    <p className='text-xs font-medium text-success bg-white border border-secondary/10 px-2 py-1 rounded-full'>In Stock</p>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard