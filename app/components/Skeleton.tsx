import { cn } from "../utils/cn";

const Skeleton = ({ className }: { className?: string }) => (
    <div
        aria-hidden="true"
        className={cn("animate-pulse rounded-8 bg-neutral-700", className)}
    />
);

export default Skeleton;
