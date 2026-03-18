import API_URL from './config';

// Send contact message
export const sendContactMessage = async (contactData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send message');
    return data;
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
};

// Send OTP
export const sendOTP = async (email) => {
  try {
    const response = await fetch(`${API_URL}/contact/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
    return data;
  } catch (error) {
    throw error;
  }
};
