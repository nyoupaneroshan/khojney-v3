interface AvatarInitialProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses: Record<NonNullable<AvatarInitialProps["size"]>, string> = {
  sm: "h-9 w-9 text-base",
  md: "h-12 w-12 text-lg",
  lg: "h-16 w-16 text-2xl",
  xl: "h-24 w-24 text-4xl",
};

/**
 * Renders a colored square with the first letter of `name`. Used as a
 * placeholder for entity logos (college, school, university) when no
 * logo image is supplied.
 */
export function AvatarInitial({ name, size = "md", className }: AvatarInitialProps) {
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
  return (
    <div
      className={
        `flex items-center justify-center rounded-lg bg-primary/10 font-bold text-primary ${sizeClasses[size]} ` +
        (className ?? "")
      }
      aria-hidden
    >
      {initial}
    </div>
  );
}
