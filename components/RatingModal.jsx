'use client'

import { Star } from 'lucide-react';
import React, { useState } from 'react'
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/nextjs';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addRating } from '@/lib/features/rating/ratingSlice';

const RatingModal = ({ ratingModal, setRatingModal }) => {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const { getToken } = useAuth();
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if (rating < 0 || rating > 5) {
            return toast('Please select a rating');
        }
        if (review.length < 5) {
            return toast('write a short review');
        }

        try {
            const token = await getToken();

            const { data } = await axios.post('/api/rating', {
                rating,
                productId: ratingModal.productId,
                orderId: ratingModal.orderId,
                review,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            dispatch(addRating(data.rating));
            toast.success('Rating added successfully');
            setRatingModal(null);
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message);
        }
    }

    return (
        <div className='fixed inset-0 z-120 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'>
            <div className='bg-surface p-8 rounded-2xl shadow-xl w-full max-w-sm relative border border-secondary/10'>
                <button onClick={() => setRatingModal(null)} className='absolute top-4 right-4 text-text-muted hover:text-text-main hover:rotate-90 transition duration-300'>
                    <XIcon size={24} />
                </button>
                <h2 className='text-2xl font-serif font-medium text-text-main mb-6 text-center'>Rate Product</h2>
                <div className='flex items-center justify-center mb-6 gap-2'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-9 cursor-pointer transition-colors ${rating > i ? "text-secondary fill-secondary" : "text-secondary/20 fill-secondary/10"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-4 border border-secondary/20 rounded-xl mb-6 focus:outline-none focus:border-secondary bg-background text-text-main resize-none transition shadow-sm'
                    placeholder='Write your review (optional)'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button onClick={e => toast.promise(handleSubmit(), { loading: 'Submitting...' })} className='w-full bg-primary text-primary-foreground py-3.5 rounded-full hover:bg-primary/90 transition shadow-lg shadow-primary/20 font-medium active:scale-95'>
                    Submit Rating
                </button>
            </div>
        </div>
    )
}

export default RatingModal