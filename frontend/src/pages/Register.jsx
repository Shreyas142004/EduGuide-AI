import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import { Sparkles, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    course: '',
    semester: 1,
    academicYear: '2025-2026',
    dailyStudyTime: 120, // 2 hours default
    examDate: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' || name === 'dailyStudyTime' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background dark:bg-darkSurface text-text dark:text-darkSurface-text transition-colors py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg bg-surface dark:bg-darkSurface-card border border-border dark:border-darkSurface-border rounded-3xl p-8 shadow-xl">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-lavender-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-text dark:text-darkSurface-text">
            Create Student Profile
          </h1>
          <p className="text-xs text-text-muted dark:text-darkSurface-muted mt-1">
            Personalize your weakness analysis, study allocation, and AI tutoring
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password (min. 6 characters) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-3 pr-10 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                title={showPassword ? 'Hide password' : 'View password'}
                aria-label={showPassword ? 'Hide password' : 'View password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Degree / Course
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. MCA, B.Tech"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <input
                type="number"
                name="semester"
                min="1"
                max="12"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="2025-2026"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Available Study Time
              </label>
              <select
                name="dailyStudyTime"
                value={formData.dailyStudyTime}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="60" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">1 Hour (60 min)</option>
                <option value="120" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">2 Hours (120 min)</option>
                <option value="180" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">3 Hours (180 min)</option>
                <option value="240" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">4 Hours (240 min)</option>
                <option value="300" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">5+ Hours (300 min)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Exam Date
              </label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={UserPlus}
            className="w-full justify-center py-2.5 mt-2"
          >
            Create Profile & Enter Dashboard
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted dark:text-darkSurface-muted">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-primary-600 dark:text-lavender hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
