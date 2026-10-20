import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import SubjectTable from '../components/performance/SubjectTable';
import ScoreForm from '../components/performance/ScoreForm';
import WeaknessAnalysis from '../components/performance/WeaknessAnalysis';
import TopicPerformance from '../components/performance/TopicPerformance';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import performanceService from '../services/performanceService';
import { Plus, BarChart3 } from 'lucide-react';

const Performance = () => {
  const [loading, setLoading] = useState(true);
  const [performances, setPerformances] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerformance, setEditingPerformance] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [perfRes, subRes, overviewRes, topicsRes] = await Promise.all([
        performanceService.getPerformances(),
        performanceService.getSubjects(),
        performanceService.getOverview(),
        performanceService.getTopics(),
      ]);

      if (perfRes.success) setPerformances(perfRes.performances || []);
      if (subRes.success) setSubjects(subRes.subjects || []);
      if (overviewRes.success) setAnalysis(overviewRes.analysis);
      if (topicsRes.success) setTopics(topicsRes.allTopics || []);
    } catch (err) {
      console.error('Performance page data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveScore = async (data) => {
    try {
      let targetSubjectId = data.subjectId;

      if (!targetSubjectId && data.newSubjectName) {
        const subRes = await performanceService.createSubject(data.newSubjectName);
        if (subRes.success) {
          targetSubjectId = subRes.subject._id;
        }
      }

      await performanceService.upsertPerformance({
        subjectId: targetSubjectId,
        examScore: data.examScore,
        maxScore: data.maxScore,
        previousScore: data.previousScore,
        assignmentScore: data.assignmentScore,
        quizScore: data.quizScore,
      });

      setIsModalOpen(false);
      setEditingPerformance(null);
      toast.success('Academic performance recorded successfully!');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save academic performance');
    }
  };

  const handleEditClick = (p) => {
    setEditingPerformance(p);
    setIsModalOpen(true);
  };

  return (
    <PageLayout
      title="Academic Performance & Weakness Analysis"
      subtitle="Input exam and test scores. The algorithm computes priority classifications and maps topic-level accuracy."
      actions={
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingPerformance(null);
            setIsModalOpen(true);
          }}
        >
          Add / Update Score
        </Button>
      }
    >
      {loading ? (
        <Loader message="Analyzing academic scores and priorities..." />
      ) : (
        <div className="space-y-6">
          {/* Top Performance Table */}
          <SubjectTable
            performances={performances}
            onEditScore={handleEditClick}
          />

          {/* Visual Chart */}
          <PerformanceChart data={analysis?.allSubjects || []} />

          {/* Weakness Analysis & Topic Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeaknessAnalysis analysis={analysis} />
            <TopicPerformance topics={topics} />
          </div>

          {/* Score Form Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingPerformance(null);
            }}
            title={editingPerformance ? 'Update Subject Marks' : 'Enter Academic Performance'}
          >
            <ScoreForm
              subjects={subjects}
              initialData={editingPerformance}
              onSave={handleSaveScore}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingPerformance(null);
              }}
            />
          </Modal>
        </div>
      )}
    </PageLayout>
  );
};

export default Performance;
