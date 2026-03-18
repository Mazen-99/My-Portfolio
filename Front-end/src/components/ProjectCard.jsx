import React from 'react'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

const ProjectCard = ({ project }) => {
    const {
        title,
        description,
        image,
        techStack,
        liveUrl,
        githubUrl,
    } = project

    return (
        <div className='bg-section-primary rounded-xl overflow-hidden border border-slate-700 hover:border-primary transition duration-300'>
            {/* Image */}
            <div className='w-full h-64 overflow-hidden'>
                <img
                    src={image}
                    alt={title}
                    className='w-full h-full hover:scale-110 transition duration-300'
                />
            </div>

            {/* Content */}
            <div className='p-4'>
                <h3 className='text-2xl font-bold text-white mb-3'>{title}</h3>
                <p className='text-description text-sm mb-4 leading-relaxed whitespace-pre-wrap'>
                    {description}
                </p>

                {/* Tech Used */}
                {techStack?.length > 0 && (
                    <div className='mb-6'>
                        <p className='text-description font-semibold text-sm mb-2'>
                            Tech Used:
                        </p>
                        <div className='flex flex-wrap gap-2'>
                            {techStack.map((tech, index) => (
                                <span
                                    key={index}
                                    className='bg-section-secondary text-primary text-xs px-3 py-1 rounded-full'
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Links */}
                <div className='flex gap-4'>
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex-1 bg-primary hover:bg-primary text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition duration-300'
                        >
                            <FaExternalLinkAlt size={16} />
                            Live Demo
                        </a>
                    )}

                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex-1 bg-section-secondary hover:bg-slate-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 border border-slate-600 transition duration-300'
                        >
                            <FaGithub size={16} />
                            Code
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard
