interface LoadingProps {
  size?: string | number;
}
export function Loading({
    size = "1.25rem",
}: LoadingProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent`}
      aria-label="Loading"
    />
  );
}
