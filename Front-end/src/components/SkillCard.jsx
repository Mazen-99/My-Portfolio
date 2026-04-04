const SkillCard = ({ skill }) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-section-secondary rounded-lg border border-slate-700 hover:border-primary transition duration-300 hover:scale-105">
            <i className={`${skill.icon} text-7xl mb-4 text-headline`}></i>
            <p className="text-description font-semibold text-sm text-center">
                {skill.name}
            </p>
        </div>
    )
}

export default SkillCard
