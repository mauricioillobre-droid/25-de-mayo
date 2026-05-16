interface Props {
  type: string
  className?: string
}

export default function MedicalIcon({ type, className = 'w-8 h-8' }: Props) {
  const cls = `${className} fill-none stroke-current stroke-2`

  switch (type) {
    case 'heart':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'stethoscope':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" strokeLinecap="round" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      )
    case 'brain':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.26Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.26Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'bone':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L18.5 2.5z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="6" r="2" />
        </svg>
      )
    case 'lung':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2 4 4 0 0 0 4-4V4a2 2 0 1 1 4 0v11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 12h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 4 4 0 0 1-4-4V4a2 2 0 1 0-4 0v11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'female':
    case 'baby':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 13v8m-4-4h8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'child':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="5" r="3" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21v-4M15 21v-4" strokeLinecap="round" />
        </svg>
      )
    case 'skin':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      )
    case 'mind':
    case 'head':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9c0 2.21.79 4.23 2.1 5.8L12 21l6.9-3.2A8.97 8.97 0 0 0 21 12z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12h6M12 9v6" strokeLinecap="round" />
        </svg>
      )
    case 'flask':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 3h6l1 9-4 9H12l-4-9 1-9z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 9h12" strokeLinecap="round" />
        </svg>
      )
    case 'drop':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'wave':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12h2l2-6 4 12 3-8 2 4 3-7 2 5h2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'vein':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12h-6l-2 7-4-14-2 7H2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'hands':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'stomach':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="10" ry="7" />
          <path d="M8 8c0 3 8 3 8 6" strokeLinecap="round" />
        </svg>
      )
    case 'virus':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
        </svg>
      )
    case 'apple':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20.94c1.5.05 3.07-.59 4.18-1.8 2.04-2.23 2.26-5.75.73-8.29-1.24-2.06-3.27-2.85-4.91-2.85-1.64 0-3.67.79-4.91 2.85-1.53 2.54-1.31 6.06.73 8.29C8.93 20.35 10.5 20.99 12 20.94z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 7s.88-2.5 4-3" strokeLinecap="round" />
        </svg>
      )
    case 'ear':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 0 0 4 0v-1" strokeLinecap="round" />
        </svg>
      )
    case 'colon':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.74.45 3.37 1.24 4.79L12 22l8.76-5.21A9.96 9.96 0 0 0 22 12c0-5.52-4.48-10-10-10z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'book':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'kidney':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="9" cy="12" rx="5" ry="8" transform="rotate(-10 9 12)" />
          <ellipse cx="15" cy="12" rx="5" ry="8" transform="rotate(10 15 12)" />
        </svg>
      )
    case 'exercise':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="4" r="2" />
          <path d="M15 20v-8l3-3-3-3M9 20v-8l-3-3 3-3M9 12h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'scissors':
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.12" y2="15.88" strokeLinecap="round" />
          <line x1="14.47" y1="14.48" x2="20" y2="20" strokeLinecap="round" />
          <line x1="8.12" y1="8.12" x2="12" y2="12" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
          <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
        </svg>
      )
  }
}
