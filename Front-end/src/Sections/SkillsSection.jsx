import { useEffect, useState } from 'react'
import SkillCard from '../components/SkillCard'
import { getAbout } from '../api/aboutApi'

const SkillsSection = () => {
    const [skills, setSkills] = useState([])

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await getAbout()
                setSkills(data.skills || [])
            } catch (error) {
                console.error('Error fetching skills:', error)
            }
        }

        fetchSkills()
    }, [])

    if (skills.length === 0) {
        return (
            <section
                id="skills"
                className="min-h-screen bg-section-secondary text-white flex flex-col items-center py-15"
            >
                <div className="container mx-auto px-4 md:px-8 w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                            My <span className="text-primary">Skills</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Here are some of the skills I have acquired over the years.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        <p className="text-center col-span-full text-gray-500">No skills available at the moment.</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section
            id="skills"
            className="min-h-screen bg-section-secondary text-white flex flex-col items-center py-15"
        >
            <div className="container mx-auto px-4 md:px-8 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        My <span className="text-primary">Skills</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Here are some of the skills I have acquired over the years.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {skills.map((skill, index) => (
                        <SkillCard key={index} skill={skill} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SkillsSection
