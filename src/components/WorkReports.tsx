import { useState } from 'react';
import { FileText, Plus, Trash2, Send, CheckCircle, Clock, AlertCircle, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { WorkReport, TaskItem } from '../types';
import { getWorkReports, saveWorkReport } from '../store';
import { formatDate, getCurrentDateString, generateId } from '../utils';

export default function WorkReports() {
  const [reports, setReports] = useState<WorkReport[]>(getWorkReports());
  const [showForm, setShowForm] = useState(false);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(getCurrentDateString());
  
  // Form state
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: generateId(), description: '', status: 'completed', hours: 1 },
  ]);
  const [summary, setSummary] = useState('');
  const [challenges, setChallenges] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');

  const addTask = () => {
    setTasks([...tasks, { id: generateId(), description: '', status: 'pending', hours: 1 }]);
  };

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const updateTask = (id: string, field: keyof TaskItem, value: string | number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSubmit = () => {
    if (!summary.trim()) {
      alert('Please add a work summary');
      return;
    }

    const validTasks = tasks.filter(t => t.description.trim());
    if (validTasks.length === 0) {
      alert('Please add at least one task');
      return;
    }

    const report: WorkReport = {
      id: `report-${Date.now()}`,
      date: selectedDate,
      tasks: validTasks,
      summary,
      challenges,
      tomorrowPlan,
      submittedAt: new Date().toISOString(),
    };

    saveWorkReport(report);
    setReports(getWorkReports());
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setTasks([{ id: generateId(), description: '', status: 'completed', hours: 1 }]);
    setSummary('');
    setChallenges('');
    setTomorrowPlan('');
  };

  const totalHours = tasks.reduce((sum, t) => sum + Number(t.hours), 0);
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daily Work Reports</h2>
          <p className="text-slate-500 mt-1">Submit and track your daily work activities</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            showForm 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
          }`}
        >
          {showForm ? (
            <>Cancel</>
          ) : (
            <>
              <Plus size={18} />
              New Report
            </>
          )}
        </button>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-purple-500" />
              Submit Daily Work Report
            </h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Date Selection */}
            <div>
              <label className="text-sm font-medium text-slate-700">Report Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 w-full md:w-64 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
              />
            </div>

            {/* Tasks Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-700">Tasks Completed</label>
                <span className="text-xs text-slate-400">Total: {totalHours}h • {completedTasks}/{tasks.length} completed</span>
              </div>
              
              <div className="space-y-3">
                {tasks.map((task, idx) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs text-slate-400 mt-2.5 w-5">{idx + 1}.</span>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                      <input
                        type="text"
                        value={task.description}
                        onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                        placeholder="Task description..."
                        className="md:col-span-6 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                      />
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, 'status', e.target.value)}
                        className="md:col-span-3 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                      >
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="pending">Pending</option>
                      </select>
                      <div className="md:col-span-2 flex items-center gap-1">
                        <input
                          type="number"
                          value={task.hours}
                          onChange={(e) => updateTask(task.id, 'hours', parseFloat(e.target.value) || 0)}
                          min="0.5"
                          max="12"
                          step="0.5"
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                        />
                        <span className="text-xs text-slate-400">h</span>
                      </div>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="md:col-span-1 p-2 text-slate-400 hover:text-red-500 transition-colors"
                        disabled={tasks.length <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={addTask}
                className="mt-3 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                <Plus size={16} />
                Add Task
              </button>
            </div>

            {/* Summary */}
            <div>
              <label className="text-sm font-medium text-slate-700">Work Summary *</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of today's work activities..."
                rows={3}
                className="mt-1 w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 resize-none"
              />
            </div>

            {/* Challenges */}
            <div>
              <label className="text-sm font-medium text-slate-700">Challenges / Blockers</label>
              <textarea
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Any challenges faced or blockers encountered (optional)..."
                rows={2}
                className="mt-1 w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 resize-none"
              />
            </div>

            {/* Tomorrow's Plan */}
            <div>
              <label className="text-sm font-medium text-slate-700">Tomorrow's Plan</label>
              <textarea
                value={tomorrowPlan}
                onChange={(e) => setTomorrowPlan(e.target.value)}
                placeholder="What do you plan to work on tomorrow? (optional)..."
                rows={2}
                className="mt-1 w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="px-5 py-2.5 text-sm text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
              >
                <Send size={16} />
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => {
          const isExpanded = expandedReport === report.id;
          const totalReportHours = report.tasks.reduce((sum, t) => sum + t.hours, 0);
          const completedCount = report.tasks.filter(t => t.status === 'completed').length;

          return (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Report Header */}
              <div 
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedReport(isExpanded ? null : report.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <FileText size={22} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{formatDate(report.date, 'EEEE, MMM dd, yyyy')}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-500" />
                        {completedCount}/{report.tasks.length} tasks
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} className="text-blue-500" />
                        {totalReportHours}h total
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {formatDate(report.submittedAt, 'MMM dd, h:mm a')}
                  </span>
                  {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  {/* Tasks */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Tasks</h4>
                    <div className="space-y-2">
                      {report.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                          {task.status === 'completed' ? (
                            <CheckCircle size={16} className="text-green-500 shrink-0" />
                          ) : task.status === 'in-progress' ? (
                            <Clock size={16} className="text-blue-500 shrink-0" />
                          ) : (
                            <AlertCircle size={16} className="text-slate-400 shrink-0" />
                          )}
                          <span className="text-sm text-slate-700 flex-1">{task.description}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            task.status === 'completed' ? 'bg-green-100 text-green-700' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-xs text-slate-400">{task.hours}h</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Summary</h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{report.summary}</p>
                  </div>

                  {/* Challenges */}
                  {report.challenges && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">Challenges</h4>
                      <p className="text-sm text-slate-600 bg-amber-50 p-3 rounded-lg">{report.challenges}</p>
                    </div>
                  )}

                  {/* Tomorrow's Plan */}
                  {report.tomorrowPlan && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">Tomorrow's Plan</h4>
                      <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">{report.tomorrowPlan}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {reports.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <FileText size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-700">No Reports Yet</h3>
          <p className="text-slate-400 mt-1">Submit your first daily work report to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Create Report
          </button>
        </div>
      )}
    </div>
  );
}
