"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

export type FieldIcon = "user" | "mail" | "lock" | "tag" | "search";

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const shapes: Record<FieldIcon, React.ReactNode> = {
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  mail: (
    <>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  tag: (
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
};

const eye = (
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

const eyeOff = (
  <>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </>
);

const base =
  "w-full rounded-lg border border-cloud bg-white py-2.5 pl-10 text-midnight outline-none placeholder:text-midnight/40 focus:border-ocean focus:ring-2 focus:ring-ocean/30 disabled:opacity-60";

const iconBox =
  "pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-midnight/50";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: FieldIcon;
  hideLabel?: boolean;
};

export function Field({
  label,
  icon,
  hideLabel = false,
  type = "text",
  ...props
}: FieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "block text-sm font-medium text-midnight"}
      >
        {label}
      </label>
      <div className={`relative ${hideLabel ? "" : "mt-1"}`}>
        <span className={iconBox}>
          <Svg>{shapes[icon]}</Svg>
        </span>
        <input
          {...props}
          id={id}
          type={isPassword && visible ? "text" : type}
          className={`${base} ${isPassword ? "pr-11" : "pr-3"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-midnight/50 transition hover:text-midnight"
          >
            <Svg>{visible ? eyeOff : eye}</Svg>
          </button>
        )}
      </div>
    </div>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  icon: FieldIcon;
};

export function SelectField({
  label,
  icon,
  children,
  ...props
}: SelectFieldProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-midnight">
        {label}
      </label>
      <div className="relative mt-1">
        <span className={iconBox}>
          <Svg>{shapes[icon]}</Svg>
        </span>
        <select {...props} id={id} className={`${base} pr-3`}>
          {children}
        </select>
      </div>
    </div>
  );
}
