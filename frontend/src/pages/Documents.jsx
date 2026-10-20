import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import DocumentUploader from '../components/documents/DocumentUploader';
import DocumentList from '../components/documents/DocumentList';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import documentService from '../services/documentService';
import performanceService from '../services/performanceService';
import { UploadCloud, Layers } from 'lucide-react';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [docsRes, subsRes] = await Promise.all([
        documentService.getDocuments(),
        performanceService.getSubjects(),
      ]);

      if (docsRes.success) setDocuments(docsRes.documents || []);
      if (subsRes.success) setSubjects(subsRes.subjects || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadSuccess = async (formData) => {
    try {
      const res = await documentService.uploadDocument(formData);
      toast.success('Document uploaded and indexed successfully!');
      await loadData();
      setIsUploadModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document');
    }
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document and remove its embeddings from the vector store?')) {
      try {
        await documentService.deleteDocument(id);
        setDocuments(documents.filter((d) => d._id !== id));
        toast.success('Document removed from library and vector store');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete document');
      }
    }
  };

  return (
    <PageLayout
      title="Study Documents & Materials"
      subtitle="Upload notes, PDFs, or lecture slides. The Python NLP service automatically chunks, generates embeddings, and indexes them into FAISS."
      actions={
        <Button
          variant="primary"
          icon={UploadCloud}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      }
    >
      {loading ? (
        <Loader message="Loading academic documents and vector status..." />
      ) : (
        <div className="space-y-6">
          <DocumentList
            documents={documents}
            subjects={subjects}
            onDelete={handleDeleteDocument}
            onUploadClick={() => setIsUploadModalOpen(true)}
          />

          {/* Upload Modal */}
          <Modal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            title="Upload Academic Material"
            maxWidth="max-w-xl"
          >
            <DocumentUploader
              subjects={subjects}
              onUploadSuccess={handleUploadSuccess}
            />
          </Modal>
        </div>
      )}
    </PageLayout>
  );
};

export default Documents;
