import { useState } from "react";
import type { FormData } from "@/hooks/useRelease"; // ✅ adjust if needed

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 5;

interface ReleaseTableProps {
    releases: FormData[];
}

export default function ReleaseTable({ releases }: ReleaseTableProps) {
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    // const sortedReleases = [...releases].sort((a, b) => {
    //     return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    // });

    const sortedReleases = [...releases].sort((a, b) => {
        return new Date(b.releaseDate ?? "").getTime() - new Date(a.releaseDate ?? "").getTime();
    });

    // const sortedReleases = [...releases].sort((a, b) => {
    //     const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    //     const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
    //     return dateB - dateA;
    // });



    const visibleReleases = sortedReleases.slice(0, visibleCount);

    const loadMore = () => {
        setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
    };

    const hasMore = visibleCount < sortedReleases.length;

    // ... you can now safely return JSX below
}
