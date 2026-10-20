import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import ChatSidebar from '../components/chatbot/ChatSidebar';
import ChatWindow from '../components/chatbot/ChatWindow';
import Loader from '../components/common/Loader';
import chatService from '../services/chatService';
import performanceService from '../services/performanceService';
import documentService from '../services/documentService';

const AIChat = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "Explain this topic simply.",
    "Explain this as a 10-mark answer.",
    "Give me an example.",
    "Generate important questions.",
    "Create a quiz from this topic.",
    "What should I study today?",
    "What are my weak topics?",
  ]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      const [sessRes, subsRes, docsRes] = await Promise.all([
        chatService.getSessions(),
        performanceService.getSubjects(),
        documentService.getDocuments(),
      ]);

      if (subsRes.success) setSubjects(subsRes.subjects || []);
      if (docsRes.success) setDocuments(docsRes.documents || []);

      if (sessRes.success && sessRes.sessions?.length > 0) {
        setSessions(sessRes.sessions);
        const firstSession = sessRes.sessions[0];
        setCurrentSessionId(firstSession._id);
        await loadSessionMessages(firstSession._id);
      }
    } catch (err) {
      console.error('Chat load error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId) => {
    try {
      const res = await chatService.getSessionById(sessionId);
      if (res.success) {
        setMessages(res.messages || []);
        if (res.session?.subjectId) {
          setSelectedSubject(res.session.subjectId._id || res.session.subjectId);
        }
        if (res.session?.documentId) {
          setSelectedDocument(res.session.documentId._id || res.session.documentId);
        }
      }
    } catch (err) {
      console.error('Session messages load error:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSelectSession = (id) => {
    setCurrentSessionId(id);
    loadSessionMessages(id);
    setMobileSidebarOpen(false);
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setSelectedSubject(null);
    setSelectedDocument(null);
    setMobileSidebarOpen(false);
  };

  const handleDeleteSession = async (id) => {
    try {
      await chatService.deleteSession(id);
      setSessions(sessions.filter((s) => s._id !== id));
      if (currentSessionId === id) {
        handleNewChat();
      }
    } catch (err) {
      alert('Failed to delete chat session');
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Optimistically add user message
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await chatService.sendMessage({
        sessionId: currentSessionId,
        message: text,
        subjectId: selectedSubject,
        documentId: selectedDocument,
      });

      if (res.success) {
        if (!currentSessionId && res.sessionId) {
          setCurrentSessionId(res.sessionId);
          // Refresh sessions list
          const sRes = await chatService.getSessions();
          if (sRes.success) setSessions(sRes.sessions);
        }

        // Replace temp and append assistant message
        setMessages((prev) => [
          ...prev.filter((m) => m._id !== tempUserMsg._id),
          res.userMessage,
          res.assistantMessage,
        ]);

        if (res.suggestedQuestions) {
          setSuggestedPrompts(res.suggestedQuestions);
        }
      }
    } catch (err) {
      const errorMsg = {
        _id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error generating response: ${err.response?.data?.message || err.message || 'Please check that the Python NLP microservice is active.'}`,
        sources: [],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const activeSubjectName = subjects.find((s) => s._id === selectedSubject)?.name;
  const activeDocumentName = documents.find((d) => d._id === selectedDocument)?.originalName;

  return (
    <PageLayout
      title="AI Academic Assistant"
      subtitle="Context-aware study tutor powered by RAG and semantic vector search on your uploaded lecture notes."
    >
      {initialLoading ? (
        <Loader message="Loading academic chat session..." />
      ) : (
        <div className="relative h-[calc(100vh-10rem)] md:h-[calc(100vh-13.5rem)] min-h-[500px] flex bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs w-full min-w-0">
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            subjects={subjects}
            documents={documents}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            selectedDocument={selectedDocument}
            onSelectDocument={setSelectedDocument}
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />

          <ChatWindow
            messages={messages}
            loading={loading}
            onSendMessage={handleSendMessage}
            suggestedPrompts={suggestedPrompts}
            subjectName={activeSubjectName}
            documentName={activeDocumentName}
            onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
            onNewChat={handleNewChat}
          />
        </div>
      )}
    </PageLayout>
  );
};

export default AIChat;
