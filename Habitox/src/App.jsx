import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Plus, 
  Trash2, 
  Moon, 
  Scale, 
  Layout, 
  Calendar, 
  TrendingUp, 
  X,
  ClipboardList
} from 'lucide-react';

const App = () => {
  // --- State Management ---
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('rf_habits_css');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "8h Sleep", completed: false },
      { id: 2, name: "Morning Exercise", completed: true },
      { id: 3, name: "Read 10 Pages", completed: false }
    ];
  });

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('rf_todos_css');
    return saved ? JSON.parse(saved) : ["Prepare meal plan", "Review weekly goals"];
  });

  const [sleepData, setSleepData] = useState(() => {
    const saved = localStorage.getItem('rf_sleep_css');
    return saved ? JSON.parse(saved) : [6, 7.5, 8, 6.5, 7, 8, 7.2];
  });

  const [bmi, setBmi] = useState(() => {
    const saved = localStorage.getItem('rf_bmi_css');
    return saved ? JSON.parse(saved) : { score: null, category: "No data", color: '#94A3B8' };
  });

  const [newHabitName, setNewHabitName] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Persistence
  useEffect(() => {
    localStorage.setItem('rf_habits_css', JSON.stringify(habits));
    localStorage.setItem('rf_todos_css', JSON.stringify(todos));
    localStorage.setItem('rf_sleep_css', JSON.stringify(sleepData));
    localStorage.setItem('rf_bmi_css', JSON.stringify(bmi));
  }, [habits, todos, sleepData, bmi]);

  // --- Calculations ---
  const successRate = habits.length > 0 
    ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100) 
    : 0;

  const avgSleep = (sleepData.reduce((a, b) => a + b, 0) / sleepData.length).toFixed(1);

  // --- Handlers ---
  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    setHabits([...habits, { id: Date.now(), name: newHabitName, completed: false }]);
    setNewHabitName('');
    setIsModalOpen(false);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([newTodo, ...todos]);
    setNewTodo('');
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    const w = parseFloat(e.target.weight.value);
    const h = parseFloat(e.target.height.value) / 100;
    if (!w || !h) return;
    
    const score = (w / (h * h)).toFixed(1);
    let category = "Normal";
    let color = '#10B981'; // success

    if (score < 18.5) { category = "Underweight"; color = '#EF4444'; }
    else if (score >= 30) { category = "Obese"; color = '#EF4444'; }
    else if (score >= 25) { category = "Overweight"; color = '#FACC15'; }

    setBmi({ score, category, color });
    e.target.reset();
  };

  const logSleep = () => {
    const val = prompt("Hours of sleep last night?");
    if (val && !isNaN(val)) {
      setSleepData([...sleepData.slice(1), parseFloat(val)]);
    }
  };

  return (
    <div className="app-container">
      <style>{`
        :root {
          --primary: #1E3A8A;
          --success: #10B981;
          --inactive: #94A3B8;
          --highlight: #FACC15;
          --warning: #EF4444;
          --bg: #F8FAFC;
          --text-main: #111827;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --white: #ffffff;
        }

        * { box-sizing: border-box; }

        .app-container {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg);
          color: var(--text-main);
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: var(--white);
          border-right: 1px solid var(--border);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          color: var(--primary);
        }

        .brand-icon {
          background: var(--primary);
          color: white;
          padding: 8px;
          border-radius: 12px;
          display: flex;
        }

        .brand-name {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .nav-list { display: flex; flex-direction: column; gap: 0.5rem; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: var(--inactive);
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
          width: 100%;
          text-align: left;
        }

        .nav-item.active {
          background: #eff6ff;
          color: var(--primary);
          font-weight: 700;
        }

        .nav-item:hover:not(.active) {
          background: #f1f5f9;
          color: var(--text-main);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-meta { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; }
        .header-title { font-size: 1.5rem; font-weight: 800; margin-top: 0.25rem; }

        .btn-primary {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.2);
        }

        /* Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 1.25rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .card-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; display: block; }
        .stat-value { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
        .stat-trend { font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem; }

        .col-span-2 { grid-column: span 2; }

        /* Habits */
        .habit-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          margin-bottom: 0.75rem;
          transition: 0.2s;
        }

        .habit-item:hover { background: white; border-color: var(--border); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }

        .check-circle {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 6px;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
          background: white;
        }

        .check-circle.checked { background: var(--success); border-color: var(--success); color: white; }

        .habit-name { font-weight: 600; margin-left: 1rem; }
        .habit-name.strikethru { color: var(--inactive); text-decoration: line-through; }

        .delete-icon { color: #cbd5e1; cursor: pointer; transition: 0.2s; border: none; background: none; }
        .delete-icon:hover { color: var(--warning); }

        /* Sleep Chart */
        .chart-area {
          height: 180px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-top: 1rem;
        }

        .chart-bar-container { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 0.75rem; }
        .chart-bar {
          width: 32px;
          background: var(--primary);
          border-radius: 6px 6px 0 0;
          transition: 0.4s ease-out;
        }
        .chart-label { font-size: 0.7rem; font-weight: 700; color: var(--inactive); text-transform: uppercase; }

        /* Todos */
        .todo-input-wrap { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .todo-input {
          flex: 1;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #f8fafc;
        }

        .todo-item {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px solid #f8fafc;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* BMI */
        .bmi-flex { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .bmi-form { display: flex; flex-direction: column; gap: 1rem; }
        .bmi-display {
          background: #f8fafc;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal-content {
          background: white;
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          border-radius: 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        .modal-input {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          font-size: 1.1rem;
          margin: 1.5rem 0;
        }

        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
          .sidebar { width: 80px; padding: 2rem 0.5rem; align-items: center; }
          .brand-name, .nav-item span { display: none; }
        }

        @media (max-width: 640px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .col-span-2 { grid-column: span 1; }
          .app-container { flex-direction: column; }
          .sidebar { width: 100%; height: auto; position: static; }
          .nav-list { flex-direction: row; overflow-x: auto; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><TrendingUp size={24} /></div>
          <span className="brand-name">HabitFlow</span>
        </div>
        
        <nav className="nav-list">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Layout size={20} /><span>Dashboard</span>
          </button>
          <button className={`nav-item ${activeTab === 'habits' ? 'active' : ''}`} onClick={() => setActiveTab('habits')}>
            <Check size={20} /><span>Habits</span>
          </button>
          <button className={`nav-item ${activeTab === 'sleep' ? 'active' : ''}`} onClick={() => setActiveTab('sleep')}>
            <Moon size={20} /><span>Sleep</span>
          </button>
          <button className={`nav-item ${activeTab === 'bmi' ? 'active' : ''}`} onClick={() => setActiveTab('bmi')}>
            <Scale size={20} /><span>BMI Logs</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="page-header">
          <div>
            <span className="header-meta">Good Morning, Tracker</span>
            <h1 className="header-title">My Health Summary</h1>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> <span>New Habit</span>
          </button>
        </header>

        {/* Stats Summary */}
        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="card">
            <span className="stat-label">Active Habits</span>
            <div className="stat-value">{habits.length}</div>
            <div className="stat-trend" style={{ color: 'var(--success)' }}>▲ 12.5% improvement</div>
          </div>
          <div className="card">
            <span className="stat-label">Success Rate</span>
            <div className="stat-value">{successRate}%</div>
            <div className="stat-trend" style={{ color: 'var(--success)' }}>▲ Higher than average</div>
          </div>
          <div className="card">
            <span className="stat-label">Avg. Sleep</span>
            <div className="stat-value">{avgSleep}h</div>
            <div className="stat-trend" style={{ color: 'var(--inactive)' }}>Target: 8.0h</div>
          </div>
          <div className="card">
            <span className="stat-label">Monthly BMI</span>
            <div className="stat-value">{bmi.score || '--'}</div>
            <div className="stat-trend" style={{ color: bmi.color }}>{bmi.category}</div>
          </div>
        </div>

        {/* Lower Grid */}
        <div className="dashboard-grid">
          
          {/* Habits Card */}
          <div className="card col-span-2">
            <h3 className="card-title">Daily Tracker</h3>
            <div className="habit-list">
              {habits.map(h => (
                <div key={h.id} className="habit-item">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`check-circle ${h.completed ? 'checked' : ''}`} onClick={() => toggleHabit(h.id)}>
                      {h.completed && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className={`habit-name ${h.completed ? 'strikethru' : ''}`}>{h.name}</span>
                  </div>
                  <button className="delete-icon" onClick={() => deleteHabit(h.id)}><Trash2 size={18} /></button>
                </div>
              ))}
              {habits.length === 0 && <p style={{ textAlign: 'center', color: 'var(--inactive)', padding: '2rem' }}>No habits yet.</p>}
            </div>
          </div>

          {/* Sleep Card */}
          <div className="card">
            <h3 className="card-title">
              Sleep Cycle
              <button onClick={logSleep} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>Log</button>
            </h3>
            <div className="chart-area">
              {sleepData.map((h, i) => (
                <div key={i} className="chart-bar-container">
                  <div className="chart-bar" style={{ height: `${h * 15}px` }}></div>
                  <span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Todo Card */}
          <div className="card">
            <h3 className="card-title">Quick Notes</h3>
            <div className="todo-input-wrap">
              <input 
                type="text" 
                className="todo-input" 
                placeholder="Buy vitamins..." 
                value={newTodo} 
                onChange={e => setNewTodo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTodo()}
              />
              <button className="btn-primary" style={{ padding: '0.5rem' }} onClick={addTodo}><Plus size={18} /></button>
            </div>
            <div className="todo-list">
              {todos.map((t, idx) => (
                <div key={idx} className="todo-item">
                  <span>• {t}</span>
                  <button className="delete-icon" onClick={() => deleteTodo(idx)}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* BMI Card */}
          <div className="card col-span-2">
            <h3 className="card-title">Monthly BMI Check</h3>
            <div className="bmi-flex">
              <form className="bmi-form" onSubmit={calculateBMI}>
                <input name="weight" type="number" step="0.1" placeholder="Weight (kg)" className="todo-input" required />
                <input name="height" type="number" placeholder="Height (cm)" className="todo-input" required />
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Analyze Results</button>
              </form>
              <div className="bmi-display">
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--inactive)' }}>CURRENT SCORE</span>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: bmi.color }}>{bmi.score || '--'}</div>
                <div style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'white', color: bmi.color, border: `1px solid ${bmi.color}` }}>
                  {bmi.category.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Habit</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Small steps lead to big changes. What's next?</p>
            <input 
              autoFocus 
              className="modal-input" 
              placeholder="e.g. Cold Shower" 
              value={newHabitName} 
              onChange={e => setNewHabitName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHabit()}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="nav-item" style={{ justifyContent: 'center' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={addHabit}>Start Habit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;