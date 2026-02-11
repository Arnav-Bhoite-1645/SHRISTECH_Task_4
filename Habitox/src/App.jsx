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
  ClipboardList,
  Settings,
  User,
  Sun,
  ChevronRight,
  Clock
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

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('rf_dark_mode') === 'true';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [reportFreq, setReportFreq] = useState('weekly');

  // Persistence
  useEffect(() => {
    localStorage.setItem('rf_habits_css', JSON.stringify(habits));
    localStorage.setItem('rf_todos_css', JSON.stringify(todos));
    localStorage.setItem('rf_sleep_css', JSON.stringify(sleepData));
    localStorage.setItem('rf_bmi_css', JSON.stringify(bmi));
    localStorage.setItem('rf_dark_mode', darkMode);
  }, [habits, todos, sleepData, bmi, darkMode]);

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
    let color = '#10B981'; 

    if (score < 18.5) { category = "Underweight"; color = '#EF4444'; }
    else if (score >= 30) { category = "Obese"; color = '#EF4444'; }
    else if (score >= 25) { category = "Overweight"; color = '#FACC15'; }

    setBmi({ score, category, color });
    e.target.reset();
  };

  const logSleep = () => {
    const val = prompt("How many hours did you sleep last night?");
    if (val && !isNaN(val)) {
      setSleepData([...sleepData.slice(1), parseFloat(val)]);
    }
  };

  // --- UI Sections ---
  const HabitTracker = () => (
    <div className="card full-width" title="List of habits you want to maintain daily">
      <h3 className="card-title">Daily Tracker</h3>
      <div className="habit-list">
        {habits.map(h => (
          <div key={h.id} className="habit-item">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button 
                className={`check-circle ${h.completed ? 'checked' : ''}`} 
                onClick={() => toggleHabit(h.id)}
                title={`Mark ${h.name} as ${h.completed ? 'incomplete' : 'complete'}`}
              >
                {h.completed && <Check size={14} strokeWidth={3} />}
              </button>
              <span className={`habit-name ${h.completed ? 'strikethru' : ''}`}>{h.name}</span>
            </div>
            <button className="delete-icon" onClick={() => deleteHabit(h.id)} title="Delete this habit">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {habits.length === 0 && <p style={{ textAlign: 'center', color: 'var(--inactive)', padding: '2rem' }}>No habits yet.</p>}
      </div>
    </div>
  );

  const SleepChart = () => (
    <div className="card" title="Weekly Sleep Cycle Breakdown">
      <div className="card-title">
        <span>Sleep Cycle</span>
        <button onClick={logSleep} className="log-btn" title="Log your sleep hours">Log Sleep</button>
      </div>
      <div className="chart-area">
        {sleepData.map((h, i) => (
          <div key={i} className="chart-bar-container">
            <span className="bar-value-label">{h}h</span>
            <div className="chart-bar" style={{ height: `${(h / 12) * 100}%` }}></div>
            <span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item"><div className="dot" style={{background: 'var(--chart-blue)'}}></div> Actual Hours</div>
        <div className="legend-item"><div className="dot" style={{background: 'var(--border)'}}></div> 8h Goal Target</div>
      </div>
    </div>
  );

  const BMICard = () => (
    <div className="card full-width">
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
          <div style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, background: 'var(--bg)', color: bmi.color, border: `1px solid ${bmi.color}` }}>
            {bmi.category.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="settings-container">
      <div className="card full-width" style={{ marginBottom: '1.5rem' }}>
        <h3 className="card-title">Account Profile</h3>
        <div className="profile-section">
          <div className="avatar"><User size={32} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>User Tracker</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>user@habitflow.com</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card col-span-2">
          <h3 className="card-title">Display & Experience</h3>
          <div className="settings-row">
            <div>
              <div className="setting-label">Dark Mode</div>
              <div className="setting-desc">Switch between light and dark themes.</div>
            </div>
            <button className={`toggle-switch ${darkMode ? 'on' : ''}`} onClick={() => setDarkMode(!darkMode)}>
              <div className="toggle-knob"></div>
            </button>
          </div>
          <div className="settings-row">
            <div>
              <div className="setting-label">Notifications</div>
              <div className="setting-desc">Get daily reminders for your habits.</div>
            </div>
            <button className={`toggle-switch ${notifications ? 'on' : ''}`} onClick={() => setNotifications(!notifications)}>
              <div className="toggle-knob"></div>
            </button>
          </div>
        </div>

        <div className="card col-span-2">
          <h3 className="card-title">Progress Reporting</h3>
          <div className="settings-row">
            <div>
              <div className="setting-label">Reporting Frequency</div>
              <div className="setting-desc">How often should we show your full stats?</div>
            </div>
            <select className="todo-input" style={{ width: 'auto' }} value={reportFreq} onChange={(e) => setReportFreq(e.target.value)}>
              <option value="weekly">Weekly Progress</option>
              <option value="monthly">Monthly Progress</option>
            </select>
          </div>
          <div className="settings-row" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
             <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>View Full History Report</div>
             <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
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
          --chart-blue: #1E3A8A;
          --card-shadow: rgba(0,0,0,0.03);
          --sidebar-bg: #ffffff;
        }

        .dark-mode {
          --bg: #0f172a;
          --sidebar-bg: #1e293b;
          --white: #1e293b;
          --text-main: #f1f5f9;
          --text-muted: #94a3b8;
          --border: #334155;
          --card-shadow: rgba(0,0,0,0.2);
          --chart-blue: #3b82f6;
          --inactive: #475569;
        }

        * { box-sizing: border-box; transition: background-color 0.3s, color 0.3s, border-color 0.3s; }

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
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 100;
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
          background: ${darkMode ? '#334155' : '#eff6ff'};
          color: ${darkMode ? '#60a5fa' : 'var(--primary)'};
          font-weight: 700;
        }

        .nav-item:hover:not(.active) {
          background: ${darkMode ? '#33415555' : '#f1f5f9'};
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
          border-radius: 1.5rem;
          padding: 1.75rem;
          box-shadow: 0 4px 10px var(--card-shadow);
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--primary);
        }

        .full-width { grid-column: 1 / -1; }
        .col-span-2 { grid-column: span 2; }

        /* Habits */
        .habit-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .habit-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          border-radius: 16px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .check-circle {
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 8px;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
        }

        .check-circle.checked { background: var(--success); border-color: var(--success); color: white; }
        .habit-name { font-weight: 700; margin-left: 1rem; color: var(--text-main); }
        .habit-name.strikethru { color: var(--inactive); text-decoration: line-through; font-weight: 500; }

        .delete-icon { 
          color: var(--inactive); 
          cursor: pointer; 
          border: none; 
          background: transparent; 
          display: flex; 
          padding: 4px;
          transition: 0.2s;
        }
        .delete-icon:hover { color: var(--warning); }

        /* --- SLEEP CHART REPAIR --- */
        .chart-area {
          height: 200px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 2rem 0 1rem 0;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1rem;
        }

        .chart-bar-container { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          flex: 0 1 36px; 
          height: 100%;
          justify-content: flex-end;
        }
        
        .bar-value-label {
          font-size: 0.75rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .chart-bar {
          width: 22px;
          background: var(--chart-blue);
          border-radius: 10px 10px 4px 4px;
          transition: height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .chart-label { 
          margin-top: 1rem;
          font-size: 0.75rem; 
          font-weight: 800; 
          color: var(--inactive); 
        }

        .chart-legend {
          display: flex;
          gap: 1.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .legend-item { display: flex; align-items: center; gap: 0.4rem; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }

        .log-btn {
          font-size: 0.75rem; 
          padding: 6px 12px; 
          border-radius: 8px; 
          border: 1px solid var(--border); 
          background: transparent; 
          color: var(--text-main);
          cursor: pointer;
          font-weight: 700;
        }
        .log-btn:hover { background: var(--bg); }

        /* Profile & BMI Fixes */
        .bmi-display {
          background: var(--bg);
          border-radius: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border: 1px solid var(--border);
        }

        .profile-section { display: flex; align-items: center; gap: 1.5rem; }
        .avatar { 
          width: 64px; height: 64px; background: var(--bg); border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; color: var(--primary);
          border: 2px solid var(--border);
        }

        .settings-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 0; border-bottom: 1px solid var(--border);
        }
        .setting-label { font-weight: 700; font-size: 1rem; }
        .setting-desc { font-size: 0.85rem; color: var(--text-muted); }

        .toggle-switch {
          width: 50px; height: 26px; background: var(--inactive); border-radius: 99px;
          position: relative; border: none; cursor: pointer; transition: 0.3s;
        }
        .toggle-switch.on { background: var(--success); }
        .toggle-knob {
          width: 20px; height: 20px; background: white; border-radius: 50%;
          position: absolute; top: 3px; left: 3px; transition: 0.3s;
        }
        .toggle-switch.on .toggle-knob { left: 27px; }

        .todo-input {
          padding: 0.8rem 1rem; border-radius: 12px; border: 1px solid var(--border);
          background: var(--bg); color: var(--text-main); font-weight: 500; outline: none;
        }

        .todo-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          border-bottom: 1px solid var(--border);
        }

        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
          .sidebar { width: 80px; padding: 2rem 0.5rem; align-items: center; }
          .brand-name, .nav-item span { display: none; }
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><TrendingUp size={24} /></div>
          <span className="brand-name">HabitFlow</span>
        </div>
        
        <nav className="nav-list">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Layout size={20} /><span>Dashboard</span></button>
          <button className={`nav-item ${activeTab === 'habits' ? 'active' : ''}`} onClick={() => setActiveTab('habits')}><Check size={20} /><span>Habits</span></button>
          <button className={`nav-item ${activeTab === 'sleep' ? 'active' : ''}`} onClick={() => setActiveTab('sleep')}><Moon size={20} /><span>Sleep</span></button>
          <button className={`nav-item ${activeTab === 'bmi' ? 'active' : ''}`} onClick={() => setActiveTab('bmi')}><Scale size={20} /><span>BMI Logs</span></button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={20} /><span>Settings</span></button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="page-header">
          <div>
            <span className="header-meta">{darkMode ? 'Evening' : 'Morning'}, Tracker</span>
            <h1 className="header-title">
              {activeTab === 'dashboard' && 'My Health Summary'}
              {activeTab === 'habits' && 'Habit Management'}
              {activeTab === 'sleep' && 'Sleep Analysis'}
              {activeTab === 'bmi' && 'BMI Progress'}
              {activeTab === 'settings' && 'App Settings'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
             <button className="btn-primary" style={{ background: 'var(--white)', color: 'var(--text-main)', border: '1px solid var(--border)', boxShadow: 'none' }} onClick={() => setDarkMode(!darkMode)}>
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button className="btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={20} /> <span>New Habit</span></button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="card"><span className="stat-label">Active Habits</span><div className="stat-value">{habits.length}</div></div>
              <div className="card"><span className="stat-label">Success Rate</span><div className="stat-value">{successRate}%</div></div>
              <div className="card"><span className="stat-label">Avg. Sleep</span><div className="stat-value">{avgSleep}h</div></div>
              <div className="card"><span className="stat-label">Latest BMI</span><div className="stat-value">{bmi.score || '--'}</div></div>
            </div>

            <div className="dashboard-grid">
              <div className="col-span-2"><HabitTracker /></div>
              <SleepChart />
              <div className="card">
                <h3 className="card-title">Quick Notes</h3>
                <div className="todo-input-wrap">
                  <input type="text" className="todo-input" placeholder="Buy supplements..." value={newTodo} onChange={e => setNewTodo(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTodo()} />
                  <button className="btn-primary" style={{ padding: '0.6rem' }} onClick={addTodo}><Plus size={18} /></button>
                </div>
                <div className="todo-list">
                  {todos.map((t, idx) => (
                    <div key={idx} className="todo-item">
                      <span style={{fontWeight: 600}}>• {t}</span>
                      <button className="delete-icon" onClick={() => deleteTodo(idx)}><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <BMICard />
              
              <div className="card full-width" style={{ marginTop: '1rem', background: darkMode ? 'var(--primary)' : '#eff6ff', border: 'none', cursor: 'pointer' }} onClick={() => setActiveTab('settings')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: 'var(--white)', padding: '8px', borderRadius: '10px', color: 'var(--primary)', border: '1px solid var(--border)' }}><Settings size={20} /></div>
                    <div>
                      <div style={{ fontWeight: 800, color: darkMode ? 'white' : 'var(--primary)' }}>Configuration & Theme</div>
                      <div style={{ fontSize: '0.8rem', color: darkMode ? '#ffffff99' : '#1e3a8a99' }}>Manage preferences and reports</div>
                    </div>
                  </div>
                  <ChevronRight color={darkMode ? 'white' : 'var(--primary)'} />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'habits' && <HabitTracker />}
        {activeTab === 'sleep' && (
          <div className="dashboard-grid">
            <div className="col-span-2"><SleepChart /></div>
            <div className="card col-span-2">
              <h3 className="card-title">Daily Breakdown</h3>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                <div key={day} className="sleep-list-item" style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}><Clock size={16}/> <span>{day}</span></div>
                  <span style={{fontWeight:700}}>{sleepData[i]}h</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'bmi' && <BMICard />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* New Habit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>New Habit</h2>
            <input autoFocus className="modal-input" placeholder="e.g. 30min Running" value={newHabitName} onChange={e => setNewHabitName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="nav-item" style={{ justifyContent: 'center', background: 'var(--bg)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={addHabit}>Start Tracking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;