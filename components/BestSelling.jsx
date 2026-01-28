'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { cardVariant, staggerContainer } from '@/lib/framermotionAnimation'

const BestSelling = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='Best Selling' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            <motion.div
                variants={staggerContainer(0.1, 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className='mt-12  grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'
            >
                {products.slice().sort((a, b) => b.rating.length - a.rating.length).slice(0, displayQuantity).map((product, index) => (
                    <motion.div variants={cardVariant} key={index} className='w-full sm:w-auto'>
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default BestSelling