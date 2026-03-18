import React, { useState, useEffect } from 'react'
import { getServices } from '../api/serviceApi'
import DynamicIcon from '../components/DynamicIcon'

const ServiceSection = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices()
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) {
    return (
      <section id='services' className='min-h-screen bg-section-secondary text-white flex flex-col items-center py-15'>
        <div className="animate-pulse text-primary font-bold tracking-widest uppercase">Initializing Ecosystem...</div>
      </section>
    )
  }

  return (
    <section id='services' className='min-h-screen bg-section-secondary text-white flex flex-col items-center py-15'>
      <div className='container mx-auto px-4 md:px-8 w-full'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl lg:text-5xl font-bold mb-4'>
            My <span className='text-primary'>Services</span>
          </h2>
          <p className='text-description text-lg max-w-2xl mx-auto'>
            I offer a range of services to help bring your digital ideas to life
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {services.map((service) => (
            <div
              key={service._id}
              className='bg-section-primary p-8 rounded-xl border border-slate-700 hover:border-primary transition duration-300 transform hover:scale-105 group'
            >
              <div className='mb-6 p-4 bg-section-secondary w-fit rounded-lg text-primary transition-transform group-hover:scale-110'>
                <DynamicIcon name={service.icon} size={40} />
              </div>
              <h3 className='text-2xl font-bold mb-4'>{service.title}</h3>
              <p className='text-description leading-snug'>
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center text-gray-500 italic py-10">
            Services are currently being updated. Please check back soon.
          </div>
        )}
      </div>
    </section>
  )
}

export default ServiceSection
