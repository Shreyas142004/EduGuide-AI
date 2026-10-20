import React, { useState, useRef } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';

const DocumentUploader = ({ subjects = [], onUploadSuccess }) => {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?._id || (subjects.length === 0 ? 'NEW_SUBJECT' : ''));
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (selected) => {
    setError(null);
    setSuccessMsg(null);
    const validExtensions = ['pdf', 'docx', 'txt'];
    const ext = selected.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      setError('Please upload a PDF, DOCX, or TXT file.');
      return false;
    }
    if (selected.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB maximum limit.');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const chosenFile = e.target.files[0];
      if (validateFile(chosenFile)) {
        setFile(chosenFile);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    if (selectedSubject === 'NEW_SUBJECT' && !newSubjectName.trim()) {
      setError('Please enter a name for the new subject.');
      return;
    }

    if (!selectedSubject && !newSubjectName.trim()) {
      setError('Please select or specify the associated academic subject.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      if (selectedSubject && selectedSubject !== 'NEW_SUBJECT') {
        formData.append('subjectId', selectedSubject);
      }
      if (newSubjectName.trim()) {
        formData.append('newSubjectName', newSubjectName.trim());
      }
      if (newSubjectCode.trim()) {
        formData.append('newSubjectCode', newSubjectCode.trim());
      }

      await onUploadSuccess(formData);

      setSuccessMsg(`"${file.name}" uploaded and indexed successfully into vector store.`);
      setFile(null);
      setNewSubjectName('');
      setNewSubjectCode('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card title="Upload Study Document" subtitle="Add lecture notes, chapter summaries, or slides for AI RAG analysis">
      <form onSubmit={handleUploadSubmit} className="space-y-4">
        {/* Subject Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Associated Subject <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={uploading}
          >
            {subjects.length > 0 && (
              <option value="" className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">-- Choose Existing Subject --</option>
            )}
            {subjects.map((s) => (
              <option key={s._id} value={s._id} className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">
                {s.name} {s.code ? `(${s.code})` : ''}
              </option>
            ))}
            <option value="NEW_SUBJECT" className="bg-white dark:bg-[#111827] text-indigo-600 dark:text-indigo-400 font-semibold">
              + Create New Subject...
            </option>
          </select>
        </div>

        {/* New Subject Input if selected */}
        {(selectedSubject === 'NEW_SUBJECT' || subjects.length === 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                New Subject Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                disabled={uploading}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Subject Code (Optional)
              </label>
              <input
                type="text"
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                placeholder="e.g. CS501"
                disabled={uploading}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-primary bg-lavender-soft/30 dark:bg-primary-950/40'
              : 'border-border dark:border-darkSurface-border hover:border-primary-400 dark:hover:border-primary-600 bg-lavender-light/30 dark:bg-darkSurface/40'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-lavender-soft/40 dark:bg-primary-950/80 text-primary-600 dark:text-lavender flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text dark:text-darkSurface-text">
              {file ? file.name : 'Click to upload or drag & drop'}
            </p>
            <p className="text-xs text-text-muted dark:text-darkSurface-muted">
              Supported formats: PDF, DOCX, TXT (up to 25MB)
            </p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={uploading}
            disabled={!file || !selectedSubject || uploading}
            icon={UploadCloud}
          >
            {uploading ? 'Processing & Indexing...' : 'Upload & Process Document'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default DocumentUploader;
