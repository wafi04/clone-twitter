import React, { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";

interface TwitterLikeScrollProps {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

const TwitterLikeScroll: React.FC<TwitterLikeScrollProps> = ({
  loadMore,
  hasMore,
  isLoading,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // Load more content when scrolling to top
      if (scrollTop === 0 && !isLoading && hasMore) {
        loadMore();
      }

      // Show/hide scroll to top button
      setShowScrollTop(scrollTop > clientHeight);

      setScrollPosition(scrollTop);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const newScrollTop =
        scrollContainer.scrollHeight -
        scrollContainer.clientHeight -
        scrollPosition;
      scrollContainer.scrollTop = newScrollTop;
    }
  }, [children, scrollPosition]);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-screen overflow-y-auto relative"
    >
      {isLoading && <div className="p-5 text-center">Loading...</div>}
      {children}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default TwitterLikeScroll;
