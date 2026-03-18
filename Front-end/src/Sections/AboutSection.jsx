import React, { useState, useEffect } from 'react'
import { getAbout } from '../api/aboutApi'

const AboutSection = () => {
    const [loading, setLoading] = useState(true)
    const [aboutData, setAboutData] = useState('')

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const data = await getAbout()
                setAboutData(data.description)
            } catch (error) {
                console.error('Error fetching about data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAboutData()
    }, [])

    if (loading) {
        return (
            <section id="about" className="min-h-screen bg-section-primary flex items-center justify-center text-white">
                Loading...
            </section>
        )
    }

    return (
        <section id='about' className='min-h-screen bg-section-primary text-white flex flex-col items-center pt-15'>
            <div className='container mx-auto px-4 md:px-8 w-full'>
                <div className='text-center mb-12 relative '>
                    <h2 className='text-4xl lg:text-5xl font-bold mb-4'>
                        About <span className='text-primary'>Me</span>
                    </h2>
                </div>

                <div className='max-w-3xl mx-auto'>
                    {/* Text */}
                    <div className='text-center'>
                        <p className='text-description text-lg leading-relaxed mb-6 whitespace-pre-wrap'>
                            {aboutData}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection
