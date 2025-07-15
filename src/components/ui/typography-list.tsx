export interface TypographyListProps {
    items: string[];
    listType?: "ul" | "ol";
    className?: string;
}

export const TypographyList: React.FC<TypographyListProps> = ({ items, listType = "ul", className }) => {
    const Tag = listType as "ul" | "ol";
    const baseStyles = listType === "ul" ? "list-disc [&>li]:mt-2" : "list-decimal [&>li]:mt-2";

    return (
        <Tag className={`my-6 ml-6 ${baseStyles} ${className}`}>
            {items.map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
        </Tag>
    );
};
