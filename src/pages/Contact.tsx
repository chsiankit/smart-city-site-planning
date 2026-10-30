import React, { useState } from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { Badge } from '../components/common/Badge';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { data } = useProjectData();
  const contact = data.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'fallback_mailto'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formspreeEndpoint = (import.meta as any).env?.VITE_FORMSPREE_ENDPOINT || '';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!formspreeEndpoint) {
      // Truthful fallback: No fake success! Launch mailto client
      setStatus('fallback_mailto');
      const mailtoUrl = `mailto:${contact.primaryEmail}?subject=${encodeURIComponent(
        `[Smart City Project Inquiry] ${formData.subject}`
      )}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
      window.location.href = mailtoUrl;
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Failed to submit form to server.');
        setStatus('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error encountered during submission.');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Project Inquiries
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact & Academic Endorsement
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Reach out to the project development team or academic advisor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information Sidecard */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional Affiliation
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">Department:</strong>
                  <span>{contact.department}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">Institution:</strong>
                  <span>{contact.institution}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">Primary Email:</strong>
                  <a
                    href={`mailto:${contact.primaryEmail}`}
                    className="text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    {contact.primaryEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 space-y-2">
            <h4 className="font-bold text-teal-800 dark:text-teal-300">
              Form Submission Mode
            </h4>
            <p className="leading-relaxed">
              {formspreeEndpoint
                ? 'Direct API dispatch configured via Formspree.'
                : 'Formspree endpoint not set; submissions automatically open your desktop email client with pre-filled parameters.'}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Send an Inquiry or Feedback
          </h2>

          {status === 'success' && (
            <div className="p-4 rounded-2xl bg-teal-50 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200 border border-teal-300 dark:border-teal-700 flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <p className="text-xs">
                Your message was successfully submitted! The team will respond via email.
              </p>
            </div>
          )}

          {status === 'fallback_mailto' && (
            <div className="p-4 rounded-2xl bg-sky-50 text-sky-900 dark:bg-sky-950/60 dark:text-sky-200 border border-sky-300 dark:border-sky-700 flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
              <p className="text-xs">
                Opened your email client with your pre-filled inquiry. You can also directly write to{' '}
                <strong className="underline">{contact.primaryEmail}</strong>.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 rounded-2xl bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-300 dark:border-rose-700 flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <p className="text-xs">Submission failed: {errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className={`w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border ${
                    errors.name
                      ? 'border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-teal-500'
                  } focus:outline-none`}
                />
                {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@institution.edu"
                  className={`w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border ${
                    errors.email
                      ? 'border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-teal-500'
                  } focus:outline-none`}
                />
                {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Autodesk Forma & Revit Evaluation Inquiry"
                className={`w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border ${
                  errors.subject
                    ? 'border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-teal-500'
                } focus:outline-none`}
              />
              {errors.subject && <p className="text-[10px] text-rose-500 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message Content *
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Detail your inquiry regarding site boundary data, Revit BIM files, or Forma analysis models..."
                className={`w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border ${
                  errors.message
                    ? 'border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-teal-500'
                } focus:outline-none`}
              />
              {errors.message && <p className="text-[10px] text-rose-500 mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'submitting' ? 'Submitting...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
