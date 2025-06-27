import { useState } from "react";

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 5;

export default function ReleaseTable({ releases }) {
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    const sortedReleases = [...releases].sort((a, b) => {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });

    const visibleReleases = sortedReleases.slice(0, visibleCount);

    const loadMore = () => {
        setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
    };

    const hasMore = visibleCount < sortedReleases.length;
}
