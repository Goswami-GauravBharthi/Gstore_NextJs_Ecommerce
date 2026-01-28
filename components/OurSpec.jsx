'use client'
import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/lib/framermotionAnimation'

const OurSpecs = () => {

    return (
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <Title visibleButton={false} title='Our Specifications' description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." />

            <motion.div
                variants={staggerContainer(0.2, 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26'
            >
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            <motion.div
                                variants={fadeIn('up', 0.2)}
                                className='relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-2xl group bg-surface border-secondary/10 hover:border-secondary/30 transition-all hover:shadow-lg hover:shadow-secondary/5'
                                key={index}
                            >
                                <h3 className='text-text-main font-serif font-medium text-lg'>{spec.title}</h3>
                                <p className='text-sm text-text-muted mt-3 leading-relaxed'>{spec.description}</p>
                                <div className='absolute -top-5 text-primary-foreground size-12 flex items-center justify-center rounded-full group-hover:scale-110 transition shadow-lg shadow-primary/20 bg-primary'>
                                    <spec.icon size={20} />
                                </div>
                            </motion.div>
                        )
                    })
                }
            </motion.div>

        </div>
    )
}

export default OurSpecs