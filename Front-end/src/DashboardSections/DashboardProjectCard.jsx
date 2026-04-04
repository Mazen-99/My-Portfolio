import React, { useState, useEffect, useRef } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'

const DashboardProjectCard = ({ project, onEdit, onDelete }) => {
    const {
        title,
        description,
        image,
        techStack,
    } = project

    const [isActive, setIsActive] = useState(false)
    const timeoutRef = useRef(null)

    const clearTimer = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }

    const startTimer = () => {
        clearTimer()
        timeoutRef.current = setTimeout(() => {
            setIsActive(false)
        }, 10000)
    }

    const toggleActive = (e) => {
        // Prevent toggle if clicking on buttons
        if (e.target.closest('button')) return
        
        setIsActive(!isActive)
        if (!isActive) {
            startTimer()
        } else {
            clearTimer()
        }
    }

    useEffect(() => {
        return () => clearTimer()
    }, [])

    return (
        <div 
            onClick={toggleActive}
            className={`group relative w-full h-[400px] bg-section-primary rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/5 hover:border-primary/50 hover:shadow-primary/20 cursor-pointer ${isActive ? 'border-primary/50 shadow-primary/20' : ''}`}
        >
            {/* Image */}
            <div className='absolute inset-0 w-full h-full'>
                <img
                    src={image}
                    alt={title}
                    className={`w-full h-full transition-all duration-700 ease-out grayscale-20 group-hover:scale-110 group-hover:grayscale-0 ${isActive ? 'scale-110 grayscale-0' : ''}`}
                />
                {/* Overlay Vignette */}
                <div className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 opacity-60 group-hover:opacity-90 ${isActive ? 'opacity-90' : ''}`} />
            </div>

            {/* Content Overlay */}
            <div className={`absolute inset-0 p-8 flex flex-col transition-all duration-500 backdrop-blur-[2px] group-hover:opacity-100 group-hover:backdrop-blur-sm ${isActive ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'}`}>
                
                {/* Top Section: Title and Actions */}
                <div className={`flex justify-between items-start transition-transform duration-500 delay-75 group-hover:translate-y-0 ${isActive ? 'translate-y-0' : '-translate-y-4'}`}>
                    <h3 className='text-2xl font-bold text-white tracking-tight drop-shadow-lg max-w-[65%] uppercase'>
                        {title}
                    </h3>

                    <div className='flex gap-3 items-center'>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                            className='p-3 bg-blue-500/20 hover:bg-blue-500 rounded-2xl text-blue-400 hover:text-white transition-all duration-300 border border-blue-500/20 backdrop-blur-md group/btn shadow-lg'
                            title='Edit Project'
                        >
                            <FaEdit size={16} className='group-hover/btn:scale-110 transition-transform' />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(project); }}
                            className='p-3 bg-red-500/20 hover:bg-red-500 rounded-2xl text-red-400 hover:text-white transition-all duration-300 border border-red-500/20 backdrop-blur-md group/btn shadow-lg'
                            title='Delete Project'
                        >
                            <FaTrash size={16} className='group-hover/btn:scale-110 transition-transform' />
                        </button>
                    </div>
                </div>

                {/* Spacer */}
                <div className='flex-1' />

                {/* Bottom Content Area */}
                <div className={`transition-transform duration-500 delay-150 group-hover:translate-y-0 ${isActive ? 'translate-y-0' : 'translate-y-8'} max-h-[70%] flex flex-col justify-end`}>
                    
                    {/* Scrollable Description */}
                    <div className='overflow-y-auto pr-2 custom-scrollbar mb-4'>
                        <p className='text-gray-100 text-sm leading-relaxed drop-shadow-md whitespace-pre-wrap text-left'>
                            {description}
                        </p>
                    </div>

                    {/* Tech Stack */}
                    <div className='transition-transform duration-500 delay-200'>
                        {techStack?.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {techStack.map((tech, index) => (
                                    <span
                                        key={index}
                                        className='bg-primary/20 text-primary text-[10px] tracking-wider font-bold px-3 py-1 rounded-full border border-primary/30 backdrop-blur-sm uppercase'
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Initial State Hint */}
            <div className={`absolute bottom-0 left-0 right-0 h-1/4 bg-linear-to-t from-black/60 to-transparent transition-opacity duration-300 pointer-events-none group-hover:opacity-0 ${isActive ? 'opacity-0' : 'opacity-100'}`} />
        </div>
    )
}

export default DashboardProjectCard
