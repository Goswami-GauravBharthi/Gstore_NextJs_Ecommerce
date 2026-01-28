'use client'

const Loading = () => {

    return (
        <div className='flex items-center justify-center h-screen bg-background'>
            <div className='w-11 h-11 rounded-full border-3 border-secondary/20 border-t-primary animate-spin text-primary'></div>
        </div>
    )
}

export default Loading