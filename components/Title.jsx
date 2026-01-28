'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeIn } from '@/lib/framermotionAnimation'

const Title = ({ title, description, href, visibleButton = true }) => {
    return (
        <motion.div
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className='flex max-sm:flex-col items-center justify-between mb-6'
        >
            <div className='flex flex-col gap-1 max-sm:items-center max-sm:text-center max-sm:mb-4'>
                <h2 className='text-3xl font-serif font-medium text-text-main'>{title}</h2>
                <p className='text-text-muted mt-3 hover:text-primary transition-colors max-w-xl leading-relaxed'>{description}</p>
            </div>
            {
                visibleButton && <Link href={href} className='text-primary font-medium hover:text-primary/70 transition flex items-center gap-1 group'>
                    View more <span className='group-hover:translate-x-1 transition-transform'>&rarr;</span>
                </Link>
            }
        </motion.div>
    )
}

export default Title