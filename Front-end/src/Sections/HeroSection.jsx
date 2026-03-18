import React, { useState, useEffect } from 'react'
import { FaWhatsapp, FaLinkedin, FaFacebook, FaGithub } from 'react-icons/fa'
import { getAbout } from '../api/aboutApi'
import { downloadCV } from '../api/cvApi'
import { TypeAnimation } from 'react-type-animation'
import Toast from '../components/Toast'

const HeroSection = () => {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [titles, setTitles] = useState([])
  const [socials, setSocials] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const ensureAbsoluteUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return url;
    }
    return `https://${url}`;
  };

  const handleDownloadCV = async () => {
    try {
      const file = await downloadCV()

      const url = window.URL.createObjectURL(file)
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', 'Mazen Ahmed CV.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      if (error.status === 404) {
        setToast({
          show: true,
          message: 'The CV document is currently being updated or is temporarily unavailable. Please try again in a moment.',
          type: 'error'
        });
        return
      }
      setToast({ show: true, message: 'An unexpected error occurred while retrieving the CV.', type: 'error' });
    }
  }


  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await getAbout()
        setName(data.name)
        setBio(data.bio)
        setTitles(data.titles || [])
        setSocials(data.socials)
      } catch (error) {
        console.error('Failed to load about data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAbout()
  }, [])

  if (loading) {
    return (
      <section id="hero" className="min-h-screen bg-section-primary flex items-center justify-center text-white text-3xl font-bold uppercase tracking-tighter">
        L O A D I N G . . .
      </section>
    )
  }

  return (
    <section
      id="hero"
      className="min-h-screen bg-section-primary text-white flex items-center justify-center pb-15"
    >
      <div className="container mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

          {/* Left Content */}
          <div className='md:block flex flex-col items-center justify-center w-full'>
            <p className="text-gray-400 text-md mb-2">Hello There</p>

            <h1 className="text-5xl lg:text-6xl font-bold mb-3 text-center md:text-left md:whitespace-nowrap">
              I'm <span className="text-primary">{name}</span>
            </h1>

            {/* Typing Animation */}
            {titles.length > 0 && (
              <div className="text-2xl lg:text-3xl font-semibold text-primary mb-5 md:mb-10">
                <TypeAnimation
                  sequence={titles.flatMap(title => [title, 2000])}
                  speed={50}
                  repeat={Infinity}
                />
              </div>
            )}

            {/* bio */}
            <p className="text-description text-lg leading-snug mb-8 max-w-lg">
              {bio}
            </p>

            {/* Social Icons */}
            {socials && (
              <div className="flex gap-6 mb-8">
                {socials.whatsapp && (
                  <a href={`https://wa.me/${socials.whatsapp}`} target="_blank" rel="noreferrer" className="text-primary hover:scale-125 transition-transform duration-300">
                    <FaWhatsapp size={28} />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={ensureAbsoluteUrl(socials.linkedin)} target="_blank" rel="noreferrer" className="text-primary hover:scale-125 transition-transform duration-300">
                    <FaLinkedin size={28} />
                  </a>
                )}
                {socials.facebook && (
                  <a href={ensureAbsoluteUrl(socials.facebook)} target="_blank" rel="noreferrer" className="text-primary hover:scale-125 transition-transform duration-300">
                    <FaFacebook size={28} />
                  </a>
                )}
                {socials.github && (
                  <a href={ensureAbsoluteUrl(socials.github)} target="_blank" rel="noreferrer" className="text-primary hover:scale-125 transition-transform duration-300">
                    <FaGithub size={28} />
                  </a>
                )}
              </div>
            )}

            <button
              onClick={handleDownloadCV}
              className="bg-primary hover:bg-section-primary hover:text-primary border border-primary text-white font-black px-12 py-4 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer active:scale-95 uppercase tracking-widest text-sm">
              Download CV
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end mt-10 lg:mt-0">
            <i className="devicon-react-original text-primary text-[300px] md:text-[380px] spin-continuous"></i>
          </div>

        </div>
      </div>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </section>
  )
}

export default HeroSection
