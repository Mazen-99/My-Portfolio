import { useEffect, useState } from 'react'
import SkillCard from '../components/SkillCard'
import { getAbout } from '../api/aboutApi'
import { motion } from 'framer-motion'

const SkillsSection = () => {
    const [skills, setSkills] = useState([])
    const [groupedSkills, setGroupedSkills] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await getAbout()
                const allSkills = data.skills || []
                setSkills(allSkills)

                // Group skills by category
                const groups = allSkills.reduce((acc, skill) => {
                    const cat = skill.category || 'Other'
                    if (!acc[cat]) acc[cat] = []
                    acc[cat].push(skill)
                    return acc
                }, {})
                setGroupedSkills(groups)
            } catch (error) {
                console.error('Error fetching skills:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSkills()
    }, [])

    if (loading) return null;

    if (skills.length === 0) {
        return (
            <section id="skills" className="min-h-screen bg-section-secondary text-headline flex flex-col items-center">
                <div className="container mx-auto px-5 py-5 w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                            My <span className="text-primary">Skills</span>
                        </h2>
                        <p className="text-description text-lg">
                            An overview of my technical expertise and toolset.
                        </p>
                    </div>
                    <p className="text-center text-description py-10 italic">No skills identified yet.</p>
                </div>
            </section>
        )
    }

    return (
        <section id="skills" className="min-h-screen bg-section-secondary text-headline flex flex-col items-center">
            <div className="container mx-auto px-5 py-5 w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        My <span className="text-primary">Skills</span>
                    </h2>
                    <p className="text-description text-lg">
                        Organized by specialized domains and core competencies.
                    </p>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
                    {Object.entries(groupedSkills).map(([category, items], idx) => (
                        <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-section-primary/50 rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all duration-500 group"
                        >
                            {/* Category Header - Centered with lines on both sides */}
                            <div className="flex items-center gap-4 mb-10">
                                <div className="flex-1 h-px bg-white/10 group-hover:bg-primary/30 transition-colors" />
                                <div className="h-10 px-6 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/50 shrink-0">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">
                                        {category}
                                    </h3>
                                </div>
                                <div className="flex-1 h-px bg-white/10 group-hover:bg-primary/30 transition-colors" />
                            </div>

                            {/* Skills in Category */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {items.map((skill, index) => (
                                    <SkillCard key={index} skill={skill} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SkillsSection
