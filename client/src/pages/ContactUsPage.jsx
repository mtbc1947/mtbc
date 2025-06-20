import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const contacts = [
  { name: 'Maidenhead Town', phone: '01628-675-911' },
  { name: 'Lesley Monaghan (Club Secretary)', phone: '07848-919-010' },
  { name: "Kim Eales (Ladies' Captain)", phone: '07887-848-4472' },
  { name: "Tim Eales (Men's Captain)", phone: '07766-130-664' },
];

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ success: true, message: 'Message sent successfully!' });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setStatus({ success: false, message: data.message || 'Something went wrong.' });
      }
    } catch {
      setStatus({ success: false, message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full overflow-y-auto">
      {/* Left Column */}
      <div className="w-full md:w-1/2 bg-amber-200 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-5 text-lg text-left text-black">
          <p className="font-semibold">
            You may contact us in a way that suits you: by calling the club directly using a phone number below,
            or you can directly contact one of the people shown. Alternatively, you may send an email using the
            mail link below, or send us a query using the form to the right, and someone will get back to you.
          </p>

          <p className="text-md underline text-blue-900 hover:text-blue-700">
            <Link to="/privacy">Click here to view the club's data privacy policy.</Link>
          </p>

          <table className="w-full border border-black text-sm">
            <thead>
              <tr className="bg-amber-300 border-b border-black">
                <th className="border-r border-black px-2 py-1 text-center">Name</th>
                <th className="px-2 py-1 text-left">Phone</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {contacts.map((contact, index) => (
                <tr key={index} className="border-t border-black">
                  <td className="border-r border-black px-2 py-1 text-center font-medium">
                    {contact.name}
                  </td>
                  <td className="px-2 py-1">{contact.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-lg">
            For friendly match enquiries, please contact one of the Club Captains shown on the{' '}
            <Link to="/officers" className="underline text-blue-900 hover:text-blue-700">Officers page</Link>.
          </p>
          <p className="text-lg">
            Or email us any time —{' '}
            <a
              href="mailto:maidenheadtownbc@gmail.com"
              className="underline text-blue-900 hover:text-blue-700"
            >
              maidenheadtownbc@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Right Column with Form */}
      <div className="w-full md:w-1/2 bg-blue-300 flex justify-center items-start p-6 md:p-12 pt-12 md:pt-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl p-8 bg-gray-500 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold text-center text-white mb-6">
            Contact Us
          </h2>

          {/* Name Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/2">
              <label className="block text-white">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-white">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Email and Phone Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/2">
              <label className="block text-white">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-white">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="mb-6">
            <label className="block text-white">Message</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>

          {status && (
            <p
              className={`mt-4 text-center font-medium ${
                status.success ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUsPage;
