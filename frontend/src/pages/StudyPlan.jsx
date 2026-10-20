import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import StudyPlanComponent from '../components/studyplan/StudyPlan';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import studyPlanService from '../services/studyPlanService';
import { Sparkles, Mail, Check, AlertCircle, X } from 'lucide-react';

const StudyPlanPage = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [plan, setPlan] = useState(null);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const res = await studyPlanService.getStudyPlan();
      if (res.success && res.studyPlan) {
        setPlan(res.studyPlan);
      }
    } catch (err) {
      console.error('Study plan load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleGeneratePlan = async () => {
    try {
      setGenerating(true);
      setEmailError(null);
      const res = await studyPlanService.generatePlan();
      if (res.success) {
        setPlan(res.studyPlan);
        toast.success('Study plan generated and scheduled!');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to generate study plan.';
      toast.error(errMsg);
    } finally {
      setGenerating(false);
    }
  };

  const handleEmailPlan = async () => {
    try {
      setEmailing(true);
      setEmailStatus(null);
      setEmailError(null);
      const res = await studyPlanService.emailPlan();
      if (res.success) {
        const msg = res.message || 'Study plan sent to your email!';
        setEmailStatus(msg);
        toast.success(msg);
        setTimeout(() => setEmailStatus(null), 6000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to dispatch email.';
      setEmailError(msg);
      toast.error(msg, { duration: 6000, id: 'email-warning' });
    } finally {
      setEmailing(false);
    }
  };

  const handleToggleSession = async (sessionId, completed) => {
    if (!plan) return;
    try {
      const res = await studyPlanService.updateSessionStatus(plan._id, sessionId, completed);
      if (res.success) {
        setPlan(res.studyPlan);
      }
    } catch (err) {
      console.error('Session update error:', err);
    }
  };

  return (
    <PageLayout
      title="Personalized Study Plan"
      subtitle="Dynamically scheduled around your available study hours, emphasizing weak subjects (50%), moderate subjects (30%), and strong subjects (20%)."
      actions={
        <div className="flex items-center space-x-2.5">
          {emailStatus && (
            <span className="hidden sm:inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Check className="w-3.5 h-3.5 mr-1.5" /> {emailStatus}
            </span>
          )}
          {plan && (
            <Button
              variant="outline"
              icon={Mail}
              loading={emailing}
              onClick={handleEmailPlan}
            >
              Email Schedule
            </Button>
          )}
          <Button
            variant="primary"
            icon={Sparkles}
            loading={generating}
            onClick={handleGeneratePlan}
          >
            {plan ? 'Recalibrate Plan' : 'Generate Daily Plan'}
          </Button>
        </div>
      }
    >
      {/* Informative Email Error Banner if SMTP is unconfigured */}
      {emailError && (
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start justify-between shadow-xs">
          <div className="flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold">Email Service Notice</p>
              <p className="mt-0.5 text-amber-700 dark:text-amber-300/90">{emailError}</p>
              <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                Tip: To enable automatic emails, set <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/60 rounded font-mono">EMAIL_USER</code> and <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/60 rounded font-mono">EMAIL_PASS</code> (16-char Gmail App Password) in <code className="font-mono">backend/.env</code>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEmailError(null)}
            className="p-1 rounded-lg hover:bg-amber-200/50 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {loading ? (
        <Loader message="Loading your customized study schedule..." />
      ) : (
        <StudyPlanComponent
          plan={plan}
          loading={generating}
          onGeneratePlan={handleGeneratePlan}
          onToggleSession={handleToggleSession}
        />
      )}
    </PageLayout>
  );
};

export default StudyPlanPage;
