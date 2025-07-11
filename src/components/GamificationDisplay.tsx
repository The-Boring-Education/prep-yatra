import { useRef, useState, useEffect } from 'react';
import { useGamification } from '@/hooks/useGamification';

const GamificationDisplay = ({ userId }: { userId: string }) => {
  const {
    points,
    currentLevel,
    currentLevelName,
    nextLevelName,
    pointsNeededForNextLevel,
    percentageProgress,
    loading,
  } = useGamification(userId);

  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (loading) return null;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        className="flex p-1 w-10 h-10 justify-center items-center rounded-full border-2 border-primary text-primary hover:text-white hover:bg-primary outline-none font-bold"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="w-full h-full flex text-xs items-center justify-center">
          {points}
        </span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 flex w-screen max-w-max md:-translate-x-2/3 -translate-x-2/4">
          <div className="bg-white px-2 py-2 rounded-2xl shadow-md border relative w-full min-w-[200px] max-w-[320px]">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Progress Ring */}
              <div className="flex items-center justify-center">
                <svg width={56} height={56}>
                  <circle
                    cx={28}
                    cy={28}
                    r={24}
                    stroke="#e5e7eb"
                    strokeWidth={4}
                    fill="none"
                  />
                  <circle
                    cx={28}
                    cy={28}
                    r={24}
                    stroke="#f59e42"
                    strokeWidth={4}
                    fill="none"
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={
                      2 * Math.PI * 24 * (1 - percentageProgress / 100)
                    }
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s' }}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="1.1em"
                    fill="#f59e42"
                    fontWeight="bold"
                  >
                    {points}
                  </text>
                </svg>
              </div>
              {/* Level Info */}
              <div className="flex flex-col gap-1 w-full justify-center">
                <span className="text-xs text-gray-500 font-semibold">YOU'RE AT</span>
                <span className="font-bold text-primary">
                  Level {currentLevel} : {currentLevelName}
                </span>
                {nextLevelName && (
                  <div className="py-1 md:px-1 w-full bg-gradient-to-r from-pink-400 to-yellow-400 font-semibold rounded-md text-center text-xs md:text-base">
                    {pointsNeededForNextLevel} Points to {nextLevelName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationDisplay; 