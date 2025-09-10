import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import axios from "axios";


type Contact = {
  name: string;
  phone: string;
};

const contacts: Contact[] = [
  { name: 'Maidenhead Town', phone: '01628-675-911' },
  { name: 'Lesley Monaghan (Club Secretary)', phone: '07848-919-010' },
  { name: "Kim Eales (Ladies' Captain)", phone: '07887-848-447' },
  { name: "Tim Eales (Men's Captain)", phone: '07766-130-664' },
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

type Status = {
  success: boolean;
  message: string;
} | null;

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState<Status>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
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
        setStatus({ success: true, message: data.message || "Message sent successfully!" });
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
      <SEO
        title="ContactUsPage – Maidenhead Town Bowls Club"
        description="Provides Contact details and Contact form."
      />
      {/* Left Column */}
      <div className="w-full md:w-1/2 flex justify-center h-full px-4 bg-white/70 rounded-md shadow-lg my-6 mx-4 md:mx-8">
        <div className="max-w-2xl w-full space-y-4 text-lg text-left p-4 text-black">
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
              <tr className="bg-white/70 border-b border-black">
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
            For friendly match enquiries, please contact one of the Club Captains.
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
      <div className="w-full md:w-1/2 flex justify-center h-full px-4 bg-white/70 rounded-md shadow-lg mx-4 md:mx-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl p-8"
        >
          <h2 className="text-2xl font-semibold text-center text-black mb-6">
            Contact Us
          </h2>

          {/* Name Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/2">
              <label className="block text-black">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 bg-white rounded"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-black">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 bg-white rounded"
              />
            </div>
          </div>

          {/* Email and Phone Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/2">
              <label className="block text-black">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 bg-white rounded"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-black">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 bg-white rounded"
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="mb-6">
            <label className="block text-black">Message</label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 bg-white rounded resize-none"
            />
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