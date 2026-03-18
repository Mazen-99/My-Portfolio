import React, { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import { getProjects } from '../api/projectApi'

const ProjectsSection = () => {

    const [projects, setProjects] = useState([])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects()
                setProjects(data)
            } catch (error) {
                console.error('Error fetching projects:', error)
            }
        }

        fetchProjects()
    }, [])

    if (!projects || projects.length === 0) {
        return (
            <section id='projects' className='min-h-screen bg-section-primary text-white flex flex-col items-center pt-15'>
                <div className='container mx-auto px-4 md:px-8 w-full'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl lg:text-5xl font-bold mb-4'>
                            My <span className='text-primary'>Projects</span>
                        </h2>
                        <p className='text-description text-lg'>
                            A selection of my recent work and side projects
                        </p>
                    </div>
                </div>
                <p className='text-center text-gray-500'>No projects available at the moment.</p>
            </section>
        )
    }

    return (
        <section id='projects' className='min-h-screen bg-section-primary text-white flex flex-col items-center py-15'>
            <div className='container mx-auto px-4 md:px-8 w-full'>
                <div className='text-center mb-16'>
                    <h2 className='text-4xl lg:text-5xl font-bold mb-4'>
                        My <span className='text-primary'>Projects</span>
                    </h2>
                    <p className='text-description text-lg'>
                        A selection of my recent work and side projects
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProjectsSection
