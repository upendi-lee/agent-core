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
