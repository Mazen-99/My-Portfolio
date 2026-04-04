import React, { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import { getProjects } from '../api/projectApi'
import { motion } from 'framer-motion'

const ProjectsSection = () => {

    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects()
                setProjects(data)
            } catch (error) {
                console.error('Error fetching projects:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    if (loading) return null;

    return (
        <section id='projects' className='min-h-screen bg-section-primary text-headline flex flex-col items-center pt-15'>
            <div className='container mx-auto px-4 md:px-8 w-full'>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='text-center mb-16'
                >
                    <h2 className='text-4xl lg:text-5xl font-bold mb-4'>
                        My <span className='text-primary'>Projects</span>
                    </h2>
                    <p className='text-description text-lg'>
                        A selection of my recent work and side projects
                    </p>
                </motion.div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    {projects.map((project, index) => (
                        <motion.div 
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </div>
            </div>
            {(!projects || projects.length === 0) && (
                <p className='text-center text-description py-20 italic opacity-60'>No projects available at the moment.</p>
            )}
        </section>
    )
}

export default ProjectsSection
