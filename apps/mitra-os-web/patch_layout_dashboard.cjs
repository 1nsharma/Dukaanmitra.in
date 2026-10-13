const fs = require('fs');
let content = fs.readFileSync('components/Layout.tsx', 'utf8');

const regex = /<aside className="w-72 bg-slate-900 text-white flex flex-col shrink-0 border-r border-white\/5 sticky top-0 h-\[100dvh\]">[\s\S]*?<\/aside>/;

const replacement = `
      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <Link to="/" className="text-xl font-black italic tracking-tighter">DukaanMitra</Link>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}>
          <Menu size={24} />
        </Button>
      </div>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 z-[200] md:hidden transition-transform duration-300 transform",
        mobileDrawerOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileDrawerOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-[280px] bg-slate-900 text-white shadow-2xl flex flex-col pt-6 px-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-8 px-2">
             <div className="text-2xl font-black italic tracking-tighter">DukaanMitra</div>
             <button className="text-slate-400 p-2" onClick={() => setMobileDrawerOpen(false)}>✕</button>
          </div>
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileDrawerOpen(false)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300",
                  activePath === item.path 
                    ? "bg-indigo-600 text-white font-black" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white font-bold"
                )}
              >
                {item.icon}
                <span className="text-xs uppercase tracking-widest">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 mt-auto border-t border-white/10">
            {user && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-black text-xs">{user.displayName?.[0] || 'U'}</div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">{user.displayName || 'Merchant'}</p>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 py-3 px-4 bg-rose-500/10 text-rose-400 rounded-xl font-bold text-xs uppercase tracking-widest"
            >
              <LogOut size={16} /> End Session
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-slate-900 text-white flex-col shrink-0 border-r border-white/5 sticky top-0 h-[100dvh]">
        <Link to="/" className="p-10 border-b border-white/10 cursor-pointer group">
          <div className="text-3xl font-black tracking-tighter italic text-white">
            DukaanMitra
          </div>
          <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[8px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
            {isAdmin ? '🛡️ Infrastructure Ops' : '⚙️ Retail Merchant'}
          </div>
        </Link>
        
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto no-scrollbar">
          <div className="px-5 mb-4 mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic flex items-center justify-between">
            <span>Core Navigation</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></span>
          </div>

          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 border-2 border-transparent group",
                activePath === item.path 
                  ? (isAdmin ? "bg-rose-600 text-white shadow-[6px_6px_0px_0px_rgba(157,23,77,1)] border-slate-900 -translate-x-1 -translate-y-1" : "bg-indigo-600 text-white shadow-[6px_6px_0px_0px_rgba(49,46,129,1)] border-slate-900 -translate-x-1 -translate-y-1") 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                activePath === item.path ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
              )}>
                {item.icon}
              </div>
              <span className="font-black text-xs uppercase tracking-widest italic">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 bg-black/20">
          {user && (
            <div className="flex items-center gap-4 mb-6 px-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg">
                {user.displayName?.[0] || user.email?.[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate">{user.displayName || 'Merchant'}</p>
                <p className="text-[10px] text-slate-500 truncate font-medium">{user.email}</p>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={16} />
            End Session
          </button>
        </div>
      </aside>`;

content = content.replace(regex, replacement);

// Also fix main layout wrapper from `flex` to `flex flex-col md:flex-row`
content = content.replace(/<div className="flex min-h-screen bg-slate-50 font-sans">/, `<div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">`);

fs.writeFileSync('components/Layout.tsx', content);
console.log("Patched Layout.tsx authenticated responsive");
