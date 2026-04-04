import React, { useState, useEffect } from 'react'
import { getServices } from '../api/serviceApi'
import DynamicIcon from '../components/DynamicIcon'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'

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

  if (loading) return null;

  return (
    <section id='services' className='min-h-screen bg-section-secondary text-headline flex flex-col items-center py-15'>
      <div className='container mx-auto px-4 md:px-8 w-full'>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
        >
          <h2 className='text-4xl lg:text-5xl font-bold mb-4'>
            My <span className='text-primary'>Services</span>
          </h2>
          <p className='text-description text-lg max-w-2xl mx-auto'>
            I offer a range of services to help bring your digital ideas to life
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {services.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className='bg-section-primary p-8 rounded-xl border border-slate-700 hover:border-primary transition duration-300 transform hover:scale-105 group'
            >
              <div className='mb-6 p-4 bg-section-secondary w-fit rounded-lg text-primary transition-transform group-hover:scale-110'>
                <DynamicIcon name={service.icon} size={40} />
              </div>
              <h3 className='text-2xl font-bold mb-4 text-headline'>{service.title}</h3>
              <p className='text-description leading-snug mb-8'>
                {service.description}
              </p>
              
              <div className='mt-auto pt-4'>
                <Link 
                  to="contact" 
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className='inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all duration-300 cursor-pointer'
                >
                  Contact Me
                  <span className='w-8 h-[2px] bg-primary group-hover:w-12 transition-all duration-300' />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center text-description italic py-10">
            Services are currently being updated. Please check back soon.
          </div>
        )}
      </div>
    </section>
  )
}

export default ServiceSection
