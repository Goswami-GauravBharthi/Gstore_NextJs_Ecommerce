
'use client'
import { assets } from '@/assets/assets'
import { ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/lib/framermotionAnimation'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='mx-6'>
            <motion.div
                variants={staggerContainer(0.2, 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'
            >
                {/* Main Hero Card */}
                <motion.div
                    variants={fadeIn('right', 0.2)}
                    className='relative flex-1 flex flex-col bg-surface rounded-3xl xl:min-h-100 group border border-secondary/10 overflow-hidden shadow-sm'
                >
                    <div className='absolute inset-0 bg-gradient-to-br from-white/40 to-secondary/5 pointer-events-none'></div>
                    <div className='p-5 sm:p-16 relative z-10'>
                        <motion.div variants={fadeIn('down', 0.3)} className='inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm text-primary pr-4 p-1 rounded-full text-xs sm:text-sm border border-secondary/20 shadow-sm w-fit'>
                            <span className='bg-primary px-3 py-1 max-sm:ml-1 rounded-full text-primary-foreground text-xs font-medium'>NEWS</span> Free Shipping on Orders Above ₹499! <ChevronRightIcon className='group-hover:ml-2 transition-all text-secondary' size={16} />
                        </motion.div>
                        <motion.h2 variants={fadeIn('up', 0.4)} className='text-3xl sm:text-5xl leading-[1.2] my-5 font-serif font-medium text-text-main max-w-xs sm:max-w-md'>
                            Timeless essentials for <span className="text-secondary italic">conscious living.</span>
                        </motion.h2>
                        <motion.div variants={fadeIn('up', 0.5)} className='text-text-muted text-sm font-medium mt-4 sm:mt-8'>
                            <p>Starts from</p>
                            <p className='text-3xl text-primary font-serif'>{currency}4.90</p>
                        </motion.div>
                        <motion.button variants={fadeIn('up', 0.6)} className='bg-primary text-primary-foreground text-sm py-3 px-8 sm:py-4 sm:px-10 mt-6 sm:mt-10 rounded-full hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition shadow-lg shadow-primary/10'>
                            Explore Collection
                        </motion.button>
                    </div>
                    <motion.div variants={fadeIn('left', 0.6)} className="absolute bottom-0 right-0 h-full w-full pointer-events-none">
                        <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm mix-blend-multiply opacity-90' src={assets.hero_model_img} alt="Hero Model" />
                    </motion.div>
                </motion.div>

                {/* Side Cards */}
                <motion.div variants={fadeIn('left', 0.4)} className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-text-muted'>

                    {/* Card 1 */}
                    <div className='flex-1 relative bg-surface border border-secondary/10 rounded-3xl overflow-hidden shadow-sm group'>
                        <div className='absolute inset-0 bg-gradient-to-br from-white/30 to-secondary/5 pointer-events-none'></div>
                        <div className='flex items-center justify-between p-6 sm:px-10 h-full relative z-10'>
                            <div className='text-text-main font-medium font-serif z-10'>
                                <p className='text-lg'>Classic Headers</p>
                                <p className='text-3xl sm:text-4xl text-secondary'>50% Off</p>
                                <button className='text-xs text-primary underline mt-2 hover:text-primary/80 transition'>Shop Now</button>
                            </div>
                            <Image className='max-w-28 sm:max-w-40 mix-blend-multiply group-hover:scale-105 transition duration-500' src={assets.hero_product_img1} priority alt="Headphones" />
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className='flex-1 relative bg-surface border border-secondary/10 rounded-3xl overflow-hidden shadow-sm group'>
                        <div className='absolute inset-0 bg-gradient-to-br from-white/30 to-secondary/5 pointer-events-none'></div>
                        <div className='flex items-center justify-between p-6 sm:px-10 h-full relative z-10'>
                            <div className='text-text-main font-medium font-serif z-10'>
                                <p className='text-lg'>Premium VR</p>
                                <p className='text-3xl sm:text-4xl text-secondary'>30% Off</p>
                                <button className='text-xs text-primary underline mt-2 hover:text-primary/80 transition'>Shop Now</button>
                            </div>
                            <Image className='max-w-28 sm:max-w-40 mix-blend-multiply group-hover:scale-105 transition duration-500' src={assets.hero_product_img2} priority alt="VR Headset" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero
