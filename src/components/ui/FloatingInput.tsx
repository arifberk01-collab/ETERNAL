import React from 'react';

export function FloatingInput({
    label, name, value, onChange, type = "text", icon, placeholder, className = ""
}: {
    label: string, name: string, value: string, onChange: any, type?: string, icon?: React.ReactNode, placeholder?: string, className?: string
}) {
    return (
        <div className={`relative group ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors duration-500">
                {icon}
            </div>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder || " "}
                className={`peer w-full h-14 rounded-2xl glass-panel text-white placeholder:text-slate-600 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 focus:bg-white/10 transition-all duration-500 outline-none pt-4 pb-1 ${icon ? 'pl-11' : 'pl-4'} pr-4 font-light text-sm`}
            />
            <label
                htmlFor={name}
                className={`absolute text-xs tracking-wider text-slate-400 duration-500 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-rose-500 ${icon ? 'left-11' : 'left-4'}`}
            >
                {label}
            </label>
        </div>
    );
}
