import { sendContactMessage, sendOTP } from '../api/contactApi'
import { useState, useEffect } from 'react'
import { FaPhone } from 'react-icons/fa'
import { FaEnvelope } from 'react-icons/fa'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { getAbout } from '../api/aboutApi'

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    })

    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitStatus, setSubmitStatus] = useState('')
    const [submitError, setSubmitError] = useState('')

    // Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (submitStatus) {
            const timer = setTimeout(() => {
                setSubmitStatus('')
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [submitStatus])

    useEffect(() => {
        if (submitError) {
            const timer = setTimeout(() => {
                setSubmitError('')
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [submitError])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Please enter your name'
        if (!formData.email.trim()) {
            newErrors.email = 'Please enter your email'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }
        if (!formData.message.trim()) newErrors.message = 'Please enter your message'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // المرحلة الأولى: الضغط على زر الإرسال يفتح مودال التأكيد
    const handleInitialSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            setShowConfirmModal(true)
        }
    }

    // المرحلة الثانية: إرسال كود التحقق
    const handleSendOTP = async () => {
        setLoading(true)
        setSubmitError('')
        try {
            await sendOTP(formData.email)
            setShowConfirmModal(false)
            setShowOtpModal(true)
        } catch (error) {
            setSubmitError(error.message || 'Failed to send verification code')
        } finally {
            setLoading(false)
        }
    }

    // المرحلة الثالثة: التحقق من الكود وإرسال الرسالة النهائية
    const handleVerifyAndSend = async (e) => {
        e.preventDefault()
        setLoading(true)
        setSubmitError('')
        try {
            await sendContactMessage({ ...formData, otp })
            setSubmitStatus('Message sent successfully! Thanks for your message.')
            setFormData({ name: '', email: '', message: '' })
            setOtp('')
            setShowOtpModal(false)
        } catch (error) {
            setSubmitError(error.message || 'Invalid verification code')
        } finally {
            setLoading(false)
        }
    }

    const [contactInfo, setContactInfo] = useState({ phone: '', email: '' })

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const data = await getAbout()
                setContactInfo({ phone: data.phone, email: data.email })
            } catch (err) {
                console.error('Error fetching contact info:', err)
            }
        }

        fetchAbout()
    }, [])

    return (
        <section id='contact' className='min-h-screen bg-section-secondary text-headline flex flex-col items-center relative'>
            <div className='container mx-auto px-5 py-5 w-full'>
                <div className='text-center mb-16'>
                    <h2 className='text-4xl lg:text-5xl font-bold mb-4'>
                        Get In <span className='text-primary'>Touch</span>
                    </h2>
                    <p className='text-description text-lg'>
                        Have a question or want to work together? Let's connect!
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto'>
                    {/* Contact Info */}
                    <div>
                        <h3 className='text-2xl font-bold mb-8 text-headline'>Contact Information</h3>

                        <div className='space-y-6'>
                            <div className='flex items-start gap-4'>
                                <div className='p-4 bg-section-primary rounded-lg text-primary'>
                                    <FaPhone size={24} />
                                </div>
                                <div>
                                    <h4 className='font-semibold text-lg mb-1 text-headline'>Phone</h4>
                                    <p className='text-description'>{contactInfo.phone || 'NAN'}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='p-4 bg-section-primary rounded-lg text-primary'>
                                    <FaEnvelope size={24} />
                                </div>
                                <div>
                                    <h4 className='font-semibold text-lg mb-1 text-headline'>Email</h4>
                                    <p className='text-description'>{contactInfo.email || 'NAN'}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='p-4 bg-section-primary rounded-lg text-primary'>
                                    <FaMapMarkerAlt size={24} />
                                </div>
                                <div>
                                    <h4 className='font-semibold text-lg mb-1 text-headline'>Location</h4>
                                    <p className='text-description'>Giza, Egypt</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <form onSubmit={handleInitialSubmit} className='space-y-6'>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className='block text-xs font-bold text-description uppercase tracking-widest'>Name</label>
                                    {errors.name && <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">{errors.name}</span>}
                                </div>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder='Your name'
                                    className={`w-full px-4 py-4 bg-section-primary border ${errors.name ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-headline placeholder-slate-500 focus:outline-none focus:border-primary transition duration-300 shadow-inner`}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className='block text-xs font-bold text-description uppercase tracking-widest'>Email</label>
                                    {errors.email && <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">{errors.email}</span>}
                                </div>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder='your@email.com'
                                    className={`w-full px-4 py-4 bg-section-primary border ${errors.email ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-headline placeholder-slate-500 focus:outline-none focus:border-primary transition duration-300 shadow-inner`}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className='block text-xs font-bold text-description uppercase tracking-widest'>Message</label>
                                    {errors.message && <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">{errors.message}</span>}
                                </div>
                                <textarea
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder='Your message here...'
                                    rows='5'
                                    className={`w-full px-4 py-4 bg-section-primary border ${errors.message ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-headline placeholder-slate-500 focus:outline-none focus:border-primary transition duration-300 shadow-inner resize-none`}
                                ></textarea>
                            </div>

                            <button
                                type='submit'
                                className='w-full bg-primary border-2 border-primary hover:bg-transparent text-white hover:text-primary font-bold py-4 rounded-xl transition-all duration-300 transform cursor-pointer uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40'
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-100 p-4 backdrop-blur-sm">
                    <div className="bg-section-primary p-8 rounded-2xl border border-slate-700 max-w-md w-full shadow-2xl text-headline">
                        <h3 className="text-2xl font-bold mb-4">Confirm Your Email</h3>
                        <p className="text-description mb-6">
                            Is <span className="text-primary font-semibold">{formData.email}</span> correct?
                            A 6-digit verification code will be sent to this address.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 transition duration-300 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition duration-300 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Yes, Correct'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-100 p-4 backdrop-blur-sm">
                    <div className="bg-section-primary p-8 rounded-2xl border border-slate-700 max-w-md w-full shadow-2xl text-headline">
                        <h3 className="text-2xl font-bold mb-2">Verify Email</h3>
                        <p className="text-description mb-6">Enter the 6-digit code sent to your email.</p>
                        <form onSubmit={handleVerifyAndSend}>
                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="000000"
                                className="w-full text-center text-3xl tracking-[10px] font-bold py-4 bg-section-secondary border border-slate-700 rounded-xl mb-6 focus:border-primary focus:outline-none text-headline"
                                required
                            />
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowOtpModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 transition duration-300 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition duration-300 cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Send'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Global Toasts */}
            {submitStatus && (
                <div className='fixed bottom-6 right-6 p-4 bg-green-500 text-white rounded-lg shadow-lg z-200 animate-bounce'>
                    {submitStatus}
                </div>
            )}
            {submitError && (
                <div className='fixed bottom-6 right-6 p-4 bg-red-500 text-white rounded-lg shadow-lg z-200'>
                    {submitError}
                </div>
            )}
        </section>
    )
}

export default ContactSection
