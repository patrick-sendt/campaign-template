export function TypographyLead({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={`text-muted-foreground text-xl ${className}`}>{children}</p>;
}
