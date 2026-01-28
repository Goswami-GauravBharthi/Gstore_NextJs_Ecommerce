import React from 'react'
import Title from './Title'

const Newsletter = () => {
    return (
        <div className='flex flex-col items-center mx-4 my-36'>
            <Title title="Join Newsletter" description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week." visibleButton={false} />
            <div className='flex bg-surface text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-background ring-1 ring-secondary/20 shadow-md'>
                <input className='flex-1 pl-6 bg-transparent outline-none text-text-main placeholder:text-text-muted/60 lowercase' type="text" placeholder='enter your email address' />
                <button className='font-medium bg-primary text-primary-foreground px-8 py-3 rounded-full hover:scale-103 active:scale-95 transition hover:bg-primary/90 shadow-md shadow-primary/20'>Get Updates</button>
            </div>
        </div>
    )
}

export default Newsletter