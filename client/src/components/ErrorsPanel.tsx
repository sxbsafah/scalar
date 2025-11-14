import { FieldErrors } from "react-hook-form";

type ErrorsPanelProps = {
  errors: FieldErrors<{
    title: string;
    thumbnail: unknown;
    workspace: string;
    folders: string;
    file?: string | undefined;
  }>;
};

const ErrorsPanel = ({ errors }: ErrorsPanelProps) => {
  return (
    <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-destructive/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="font-semibold text-sm">Validation Errors</h2>
      </div>
      <ul className="p-3 space-y-1">
        {Object.keys(errors).map((key) => (
          <li
            key={key}
            className="flex items-center gap-2 text-[12px] font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
            {(errors[key as keyof typeof errors]?.message as string) ??
              "Unknown error"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorsPanel;
