import type { SVGProps } from 'react';

export function AgentCoreIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" className="fill-primary text-primary-foreground" />
      <path d="M8 14.5l2-2 2 2" stroke="currentColor" className="stroke-current text-primary-foreground" />
      <path d="M12 16.5l4-4" stroke="currentColor" className="stroke-current text-primary-foreground" />
      <path d="M10 9.5L12 7.5l2 2" stroke="currentColor" className="stroke-current text-primary-foreground" />
    </svg>
  );
}

export function AgentCoreLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="24" height="24" rx="6" fill="hsl(var(--primary))" />
      <path
        d="M12.4542 6.51433C12.2215 6.28169 11.7785 6.28169 11.5458 6.51433L8.52425 9.5359C8.29161 9.76854 8.46911 10.1718 8.79973 10.1718H15.2003C15.5309 10.1718 15.7084 9.76854 15.4757 9.5359L12.4542 6.51433Z"
        fill="white"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
      />
      <path
        d="M17.4857 11.5458C17.7183 11.7785 17.7183 12.2215 17.4857 12.4542L14.4641 15.4757C14.2315 15.7084 13.8282 15.5309 13.8282 15.2003V8.79973C13.8282 8.46911 14.2315 8.29161 14.4641 8.52425L17.4857 11.5458Z"
        fill="white"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
      />
      <path
        d="M11.5458 17.4857C11.7785 17.7183 12.2215 17.7183 12.4542 17.4857L15.4757 14.4641C15.7084 14.2315 15.5309 13.8282 15.2003 13.8282H8.79973C8.46911 13.8282 8.29161 14.2315 8.52425 14.4641L11.5458 17.4857Z"
        fill="white"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
      />
      <path
        d="M6.51433 12.4542C6.28169 12.2215 6.28169 11.7785 6.51433 11.5458L9.5359 8.52425C9.76854 8.29161 10.1718 8.46911 10.1718 8.79973V15.2003C10.1718 15.5309 9.76854 15.7084 9.5359 15.4757L6.51433 12.4542Z"
        fill="white"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
      />
    </svg>
  );
}
