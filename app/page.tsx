"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const home = () => {
    const router = useRouter()
    useEffect(() => { router.push("/dashboard") }, [])
    return (
        <div>

        </div>
    )
}

export default home
