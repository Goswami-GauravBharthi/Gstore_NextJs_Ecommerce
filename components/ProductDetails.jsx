'use client'
import { addToCart } from '@/lib/features/cart/cartSlice';
import { CreditCardIcon, EarthIcon, StarIcon, TagIcon, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, zoomIn } from '@/lib/framermotionAnimation';
import Counter from './Counter';

const ProductDetails = ({ product }) => {

    const [mainImage, setMainImage] = useState(product?.images?.[0]);

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const dispatch = useDispatch();
    const router = useRouter();

    const cart = useSelector(state => state.cart.cartItems);

    useEffect(() => {
        if (product?.images?.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    const addToCartHandler = () => {
        dispatch(addToCart({ productId: product.id }));
    }

    if (!product) return null;

    // Calculate rating
    const ratingCount = product.rating?.length || 0;
    const averageRating = ratingCount > 0
        ? product.rating.reduce((acc, curr) => acc + curr.rating, 0) / ratingCount
        : 0;


    return (
        <div className='flex flex-col md:flex-row gap-10 bg-white/50 backdrop-blur-sm  rounded-3xl '>
            {/* Image Section */}
            <motion.div
                variants={fadeIn('right', 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className='flex-1 flex flex-col gap-4'
            >
                <div className='relative flex items-center justify-center bg-surface/30 border border-secondary/10 rounded-2xl p-10 h-96 w-full overflow-hidden shadow-inner'>
                    <motion.div key={mainImage} variants={zoomIn(0.1, 0.4)} initial="hidden" animate="show">
                        <Image width={500} height={500} src={mainImage} alt={product.name || "product"} className='object-contain max-h-80 w-auto mix-blend-multiply drop-shadow-md' priority />
                    </motion.div>
                </div>
                <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-none'>
                    {
                        product.images.map((img, index) => (
                            <motion.div variants={fadeIn('up', 0.1 * index)} key={index} onClick={() => setMainImage(img)} className={`cursor-pointer p-3 rounded-xl border transition-all duration-300 flex-shrink-0 w-20 h-20 bg-surface/50 flex items-center justify-center hover:border-primary/30 ${mainImage === img ? 'border-primary shadow-sm bg-white' : 'border-secondary/10'}`}>
                                <Image width={100} height={100} src={img} alt="thumb" className='object-contain w-full h-full mix-blend-multiply' />
                            </motion.div>
                        ))
                    }
                </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
                variants={staggerContainer(0.1, 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className='flex-1 flex flex-col gap-4'
            >
                <motion.h1 variants={fadeIn('up', 0.2)} className='text-3xl md:text-4xl font-serif font-medium text-text-main'>{product.name}</motion.h1>

                <motion.div variants={fadeIn('up', 0.3)} className='flex items-center gap-2'>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={18} className={`${index < Math.round(averageRating) ? 'text-secondary fill-secondary' : 'text-secondary/20 fill-secondary/10'}`} />
                        ))}
                    </div>
                    <span className='text-text-muted text-sm'>({ratingCount} Reviews)</span>
                </motion.div>

                <motion.div variants={fadeIn('up', 0.4)} className='flex items-end gap-3'>
                    <p className='text-3xl font-serif font-medium text-text-main'>{currency}{product.offerPrice || product.price}</p>
                    {product.offerPrice && <p className='text-xl text-text-muted line-through font-sans font-normal opacity-60 mb-1'>{currency}{product.price}</p>}
                </motion.div>

              

                {product.offerPrice && (
                    <motion.div variants={fadeIn('up', 0.6)} className='bg-success/10 px-4 py-2 rounded-full w-fit mb-4 mt-2 border border-success/20 flex items-center gap-2'>
                        <TagIcon size={16} className='text-success' />
                        <p className='text-success text-sm font-medium'>You save {currency}{product.price - product.offerPrice}</p>
                    </motion.div>
                )}

                <motion.div variants={fadeIn('up', 0.7)} className='flex items-center gap-6 my-4'>
                    {
                        cart[product.id] && (
                            <div className="flex items-center gap-3 bg-surface/50 border border-secondary/20 rounded-full px-4 py-1.5">
                                <Counter productId={product.id} />
                            </div>
                        )
                    }
                </motion.div>

                <motion.div variants={fadeIn('up', 0.8)} className='flex gap-4'>
                    <button onClick={() => !cart[product.id] ? addToCartHandler() : router.push('/cart')} className='flex-1 bg-primary text-primary-foreground py-3.5 px-6 rounded-full hover:bg-primary/90 active:scale-95 transition shadow-lg shadow-primary/20 font-medium tracking-wide'>
                        {!cart[product.id] ? 'Add to Cart' : 'View Cart'}
                    </button>
                    <button className='bg-surface border border-secondary/20 p-3.5 rounded-full text-secondary hover:text-primary hover:border-primary/50 transition shadow-sm'>
                        <StarIcon size={24} />
                    </button>
                </motion.div>

                <hr className='border-secondary/10 my-4' />

                <motion.div variants={staggerContainer(0.1, 0.9)} className='grid grid-cols-2 gap-4 text-sm'>
                    <div className='flex items-center gap-3 text-text-muted'><div className="p-2 bg-surface rounded-full"><EarthIcon className="text-secondary" size={18} /></div> Free Shipping</div>
                    <div className='flex items-center gap-3 text-text-muted'><div className="p-2 bg-surface rounded-full"><CreditCardIcon className="text-secondary" size={18} /></div> Secure Payment</div>
                    <div className='flex items-center gap-3 text-text-muted'><div className="p-2 bg-surface rounded-full"><UserIcon className="text-secondary" size={18} /></div> 2 Year Warranty</div>
                </motion.div>

            </motion.div>
        </div>
    )
}

export default ProductDetails