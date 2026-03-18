require('dotenv').config();
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const OTP = require('../schemas/OTP');

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/contact/send-otp - Public endpoint to send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = generateOTP();

    // Save to DB (replaces existing if any for this email)
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verification Code for Contact Form',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p style="font-size: 18px;">Please use the following 6-digit code to verify your email address:</p>
          <div style="font-size: 32px; font-weight: bold; color: #2E86C1; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #888;">This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/contact - Public endpoint to send contact form (Verified)
exports.sendContact = async (req, res) => {
  try {
    const { name, email, message, otp } = req.body;

    // Validation
    if (!name || !email || !message || !otp) {
      return res
        .status(400)
        .json({ message: 'All fields including verification code are required' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📬 New Contact Form Submission from ${name}`,
      html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color: #333;">
      <h2 style="color: #2E86C1;">📩 New Contact Form Submission</h2>
      <hr style="border:none; border-top:2px solid #2E86C1; margin:10px 0;">
      <p><strong style="color:#555;">Name:</strong> ${name}</p>
      <p><strong style="color:#555;">Email:</strong> <a href="mailto:${email}" style="color:#2E86C1;">${email}</a></p>
      <p><strong style="color:#555;">Message:</strong></p>
      <div style="padding:10px; background:#f4f4f4; border-radius:5px; border:1px solid #ddd;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <hr style="border:none; border-top:1px solid #ddd; margin:10px 0;">
      <p style="font-size:12px; color:#888;">This email was sent from your Portfolio Contact Form.</p>
    </div>
  `,
    });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
