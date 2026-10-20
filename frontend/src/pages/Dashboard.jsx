import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import OverallScoreCard from '../components/dashboard/OverallScoreCard';
import WeakSubjectCard from '../components/dashboard/WeakSubjectCard';
import SubjectPerformanceCard from '../components/dashboard/SubjectPerformanceCard';
import StudyRecommendation from '../components/dashboard/StudyRecommendation';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import performanceService from '../services/performanceService';
import studyPlanService from '../services/studyPlanService';
import documentService from '../services/documentService';
import quizService from '../services/quizService';
import { Plus, UploadCloud, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewRes, planRes, docsRes, quizHistRes] = await Promise.all([
        performanceService.getOverview().catch(() => ({ success: false })),
        studyPlanService.getStudyPlan().catch(() => ({ success: false })),
        documentService.getDocuments().catch(() => ({ success: false })),
        quizService.getQuizHistory().catch(() => ({ success: false })),
      ]);

      if (overviewRes.success) {
        setAnalysis(overviewRes.analysis);
      }

      if (planRes.success && planRes.studyPlan) {
        setStudyPlan(planRes.studyPlan);
      }

      if (docsRes.success) {
        setDocuments(docsRes.documents || []);
      }

      // Build unified recent activities
      const acts = [];
      (docsRes.documents || []).slice(0, 3).forEach((d) => {
        acts.push({
          type: 'document',
          title: `Uploaded ${d.originalName}`,
          subtitle: `${d.subjectId?.name || 'Subject'} • ${d.pageCount} pages indexed`,
          time: new Date(d.uploadedAt).toLocaleDateString(),
        });
      });

      (quizHistRes.attempts || []).slice(0, 3).forEach((q) => {
        acts.push({
          type: 'quiz',
          title: `Completed ${q.subjectId?.name || 'Subject'} Quiz`,
          subtitle: `Score: ${q.percentage}% (${q.score}/${q.totalQuestions})`,
          time: new Date(q.completedAt).toLocaleDateString(),
        });
      });

      setRecentActivities(acts);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleSession = async (sessionId, completed) => {
    if (!studyPlan) return;
    try {
      const res = await studyPlanService.updateSessionStatus(studyPlan._id, sessionId, completed);
      if (res.success) {
        setStudyPlan(res.studyPlan);
      }
    } catch (err) {
      console.error('Session update error:', err);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Loader message="Loading personalized academic dashboard..." />
      </PageLayout>
    );
  }

  const overallScore = analysis?.overallScore || 0;
  const counts = analysis?.counts || { high: 0, medium: 0, low: 0 };
  const allSubjects = analysis?.allSubjects || [];
  const highestWeakSubject = analysis?.highPriority?.[0] || null;

  return (
    <PageLayout
      title={`Good day, ${user?.name || 'Student'} 👋`}
      subtitle="Here is your active academic status, weakness prioritization, and daily study schedule."
      actions={
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={UploadCloud}
            onClick={() => navigate('/documents')}
          >
            Upload Notes
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/performance')}
          >
            Add Performance
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top 2 Hero Cards: Overall Score & Highest Priority Weakness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverallScoreCard
            overallScore={overallScore}
            counts={counts}
            totalSubjects={allSubjects.length}
          />
          <WeakSubjectCard weakSubject={highestWeakSubject} />
        </div>

        {/* Middle Section: Chart & Today's Study Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart data={allSubjects} />
          <StudyRecommendation
            studyPlan={studyPlan}
            onToggleSession={handleToggleSession}
          />
        </div>

        {/* Bottom Section: Subject Summary & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubjectPerformanceCard subjects={allSubjects} />
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
