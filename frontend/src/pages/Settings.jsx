import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { User, Sun, Moon, CheckCircle2, Save, LogOut, Clock, Calendar, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { isDark, setTheme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    course: user?.course || '',
    semester: user?.semester || 1,
    academicYear: user?.academicYear || '2025-2026',
    dailyStudyTime: user?.dailyStudyTime || 180,
    examDate: user?.examDate
      ? new Date(user.examDate).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' || name === 'dailyStudyTime' ? Number(value) : value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);
      await updateProfile(formData);
      setSuccessMsg('Academic settings updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <PageLayout
      title="Settings & Preferences"
      subtitle="Manage your student profile, daily study time, exam schedule, visual theme, and account."
    >
      <div className="max-w-3xl space-y-6">
        {/* Profile & Study Goals Card */}
        <Card title="Student Profile & Study Schedule" subtitle="Update your academic details and daily focus limits" icon={User}>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Degree / Program
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Semester
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
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-primary-600 dark:text-primary-400" />
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-primary-600 dark:text-primary-400" />
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

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" icon={Save} loading={saving}>
                Save Profile & Schedule
              </Button>
            </div>
          </form>
        </Card>

        {/* Theme Preferences Card */}
        <Card title="Visual Theme" subtitle="Switch between Indigo Light Mode and Slate Dark Mode" icon={Palette}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-text dark:text-darkSurface-text">
                Indigo & Slate Color Scheme
              </h4>
              <p className="text-xs text-text-muted dark:text-darkSurface-muted mt-0.5">
                Crisp light mode or deep indigo-slate dark mode for comfortable reading and study sessions.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-2.5 rounded-xl border flex items-center space-x-2 text-xs font-semibold transition-colors ${
                  !isDark
                    ? 'border-primary bg-lavender-soft/40 text-primary-700 font-bold shadow-xs'
                    : 'border-border dark:border-darkSurface-border text-text-muted hover:bg-lavender-light/40 dark:hover:bg-darkSurface-elevated'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light ☀</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-2.5 rounded-xl border flex items-center space-x-2 text-xs font-semibold transition-colors ${
                  isDark
                    ? 'border-primary bg-primary-950/80 text-lavender font-bold shadow-xs'
                    : 'border-border dark:border-darkSurface-border text-text-muted hover:bg-lavender-light/40 dark:hover:bg-darkSurface-elevated'
                }`}
              >
                <Moon className="w-4 h-4 text-primary-400" />
                <span>Dark 🌙</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Account / Logout Card */}
        <Card title="Account Security" subtitle="End your session safely">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-text dark:text-darkSurface-text">
                Signed in as {user?.email}
              </h4>
              <p className="text-xs text-text-muted dark:text-darkSurface-muted mt-0.5">
                Logout to protect your session and study materials.
              </p>
            </div>

            <Button
              variant="outline"
              icon={LogOut}
              onClick={handleLogout}
              className="text-rose-600 dark:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800"
            >
              Log Out
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Settings;
