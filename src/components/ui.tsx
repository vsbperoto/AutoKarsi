import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function Label({ children, required }: { children: React.ReactNode, required?: boolean }) {
  return (
    <label className="text-xs font-bold uppercase text-slate-500 mb-2 block tracking-wider flex items-center gap-2">
      {required && <span className="text-blue-500 text-base leading-none" title="Критично поле">⚡</span>}
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      {...props} 
      className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow placeholder-slate-400 ${props.className || ''}`} 
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      {...props} 
      className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow min-h-[100px] resize-y placeholder-slate-400 ${props.className || ''}`} 
    />
  );
}

export function Helper({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[10px] italic text-slate-400 block tracking-wide font-medium">💡 {children}</p>;
}

export function Checkbox({ checked, onChange, label }: { checked: boolean, onChange: (checked: boolean) => void, label: string }) {
  return (
    <label className={`cursor-pointer p-3 rounded-lg flex items-center space-x-3 transition-colors border ${
      checked ? 'border-blue-100 bg-blue-50 border-l-4 border-l-blue-600' : 'border-slate-100 bg-white hover:bg-slate-50'
    }`}>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 ${
        checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
      }`}>
        {checked && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${checked ? 'font-medium text-blue-900' : 'text-slate-600'}`}>{label}</span>
    </label>
  );
}

export function Radio({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) {
  return (
    <label className={`cursor-pointer p-3 rounded-lg flex items-center space-x-3 transition-colors border ${
      checked ? 'border-blue-100 bg-blue-50 border-l-4 border-l-blue-600' : 'border-slate-100 bg-white hover:bg-slate-50'
    }`}>
      <input type="radio" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
        checked ? 'bg-blue-600 border-2 border-white ring-1 ring-blue-600' : 'border-2 border-slate-300'
      }`} />
      <span className={`text-sm ${checked ? 'font-medium text-blue-900' : 'text-slate-600'}`}>{label}</span>
    </label>
  );
}

export function Button({ children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  const variants = {
    primary: 'bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-700',
    secondary: 'bg-transparent text-slate-600 font-semibold hover:bg-slate-100 border border-transparent hover:border-slate-200',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold'
  };
  
  return (
    <button 
      {...props} 
      className={`px-6 py-2.5 text-sm transition-all flex items-center justify-center gap-2 ${variants[variant]} ${props.className || ''}`}
    >
      {children}
    </button>
  );
}
