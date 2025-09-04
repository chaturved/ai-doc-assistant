import { ReactNode } from "react";

interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  value: string;
  placeholder: string;
  icon: ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  id,
  type,
  label,
  value,
  placeholder,
  icon,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-zinc-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full rounded-lg bg-zinc-900/80 text-sm pl-9 pr-3 h-11 outline-none ring-1 ring-white/10 focus:ring-indigo-500/40 placeholder:text-zinc-500 transition"
        />
      </div>
    </div>
  );
}
