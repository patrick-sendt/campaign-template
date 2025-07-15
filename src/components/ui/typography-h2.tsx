export function TypographyH2({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h1 className={`scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}>{children}</h1>;
}
