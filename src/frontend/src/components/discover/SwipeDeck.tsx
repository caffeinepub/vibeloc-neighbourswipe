import { Button } from "@/components/ui/button";
import { Check, Heart, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Neighbourhood } from "../../types/neighbourhood";
import NeighbourhoodCard from "./NeighbourhoodCard";
import NeighbourhoodDetailSheet from "./NeighbourhoodDetailSheet";
import SwipeHintOverlay from "./SwipeHintOverlay";

interface SwipeDeckProps {
  neighbourhoods: Neighbourhood[];
  onLike: (neighbourhood: Neighbourhood) => void;
  onDislike: (neighbourhood: Neighbourhood) => void;
  matchReasonsByIndex?: Record<number, string[]>;
}

export default function SwipeDeck({
  neighbourhoods,
  onLike,
  onDislike,
  matchReasonsByIndex,
}: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [showHint, setShowHint] = useState(
    () => !localStorage.getItem("vibeloc_swipe_hint_seen"),
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const currentNeighbourhood = neighbourhoods[currentIndex];
  const nextNeighbourhood = neighbourhoods[currentIndex + 1];

  // Preload next 3 images whenever currentIndex changes
  useEffect(() => {
    for (const offset of [1, 2, 3]) {
      const next = neighbourhoods[currentIndex + offset];
      if (next?.imageFilename) {
        const img = new Image();
        img.src = next.imageFilename;
      }
    }
  }, [currentIndex, neighbourhoods]);

  const advanceIndex = useCallback(() => {
    if (currentIndex < neighbourhoods.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    setDragOffset(0);
    setSwipeDirection(null);
  }, [currentIndex, neighbourhoods.length]);

  const triggerLike = useCallback(() => {
    if (!currentNeighbourhood) return;
    pendingActionRef.current = () => onLike(currentNeighbourhood);
    setSwipeDirection("right");
  }, [currentNeighbourhood, onLike]);

  const triggerDislike = useCallback(() => {
    if (!currentNeighbourhood) return;
    pendingActionRef.current = () => onDislike(currentNeighbourhood);
    setSwipeDirection("left");
  }, [currentNeighbourhood, onDislike]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (showDetail || swipeDirection) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        triggerLike();
      } else {
        triggerDislike();
      }
    } else {
      setDragOffset(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (showDetail || swipeDirection) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setDragOffset(e.clientX - startXRef.current);
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragOffset((prev) => {
      if (Math.abs(prev) > 100) {
        if (prev > 0) {
          triggerLike();
        } else {
          triggerDislike();
        }
        return prev;
      }
      return 0;
    });
  }, [triggerLike, triggerDislike]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleTransitionEnd = useCallback(() => {
    if (swipeDirection) {
      if (pendingActionRef.current) {
        pendingActionRef.current();
        pendingActionRef.current = null;
      }
      advanceIndex();
    }
  }, [swipeDirection, advanceIndex]);

  if (!currentNeighbourhood) {
    return null;
  }

  let translateX = dragOffset;
  let rotation = dragOffset * 0.05;
  let cardOpacity = 1 - Math.abs(dragOffset) / 300;

  if (swipeDirection === "right") {
    translateX = window.innerWidth * 1.3;
    rotation = 30;
    cardOpacity = 0;
  } else if (swipeDirection === "left") {
    translateX = -window.innerWidth * 1.3;
    rotation = -30;
    cardOpacity = 0;
  }

  const isFlyingOut = swipeDirection !== null;
  const likeOverlayOpacity =
    dragOffset > 20 ? Math.min(dragOffset / 120, 1) : 0;
  const dislikeOverlayOpacity =
    dragOffset < -20 ? Math.min(Math.abs(dragOffset) / 120, 1) : 0;
  const currentMatchReasons = matchReasonsByIndex?.[currentIndex];

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Stack container — next card sits behind current card */}
      <div className="relative">
        {/* NEXT card — rendered behind, slightly scaled down, non-interactive */}
        {nextNeighbourhood && (
          <div
            className="absolute inset-0"
            style={{
              transform: "scale(0.95) translateY(8px)",
              zIndex: 0,
              pointerEvents: "none",
              opacity: 0.7,
            }}
          >
            <NeighbourhoodCard neighbourhood={nextNeighbourhood} />
          </div>
        )}

        {/* CURRENT card — draggable, on top */}
        <div
          ref={cardRef}
          className="relative touch-none select-none"
          style={{
            transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
            opacity: Math.max(cardOpacity, isFlyingOut ? 0 : 0.5),
            cursor: isDragging ? "grabbing" : "grab",
            transition: isFlyingOut
              ? "transform 350ms ease-out, opacity 350ms ease-out"
              : "none",
            pointerEvents: isFlyingOut ? "none" : "auto",
            zIndex: 1,
            willChange: isDragging || isFlyingOut ? "transform" : "auto",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onTransitionEnd={handleTransitionEnd}
        >
          <NeighbourhoodCard
            neighbourhood={currentNeighbourhood}
            matchReasons={currentMatchReasons}
            onLearnMore={() => setShowDetail(true)}
          />

          {/* Like overlay */}
          {likeOverlayOpacity > 0 && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg border-4 border-green-500 bg-green-500/20"
              style={{ opacity: likeOverlayOpacity }}
            >
              <Heart className="h-20 w-20 text-green-500" fill="currentColor" />
              <span className="text-3xl font-black tracking-widest text-green-500 drop-shadow-lg">
                LIKE
              </span>
            </div>
          )}

          {/* Dislike overlay */}
          {dislikeOverlayOpacity > 0 && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg border-4 border-red-500 bg-red-500/20"
              style={{ opacity: dislikeOverlayOpacity }}
            >
              <X className="h-20 w-20 text-red-500" />
              <span className="text-3xl font-black tracking-widest text-red-500 drop-shadow-lg">
                NOPE
              </span>
            </div>
          )}

          {/* Swipe hint overlay — first time only */}
          {showHint && (
            <SwipeHintOverlay onDismiss={() => setShowHint(false)} />
          )}
        </div>
      </div>

      {/* Manual buttons */}
      <p className="mt-3 mb-1 text-center text-xs text-muted-foreground">
        Swipe or tap to choose
      </p>
      <div className="flex justify-center gap-6">
        <button
          type="button"
          className="flex min-w-[44px] items-center justify-center rounded-full border-2 border-red-500 px-3 py-2 text-red-500 transition-all hover:bg-red-50 active:scale-95 disabled:opacity-40"
          onClick={triggerDislike}
          disabled={isFlyingOut}
          data-ocid="discover.dislike.button"
        >
          <X className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="flex min-w-[44px] items-center justify-center rounded-full bg-green-500 px-3 py-2 text-white transition-all hover:bg-green-600 active:scale-95 disabled:opacity-40"
          onClick={triggerLike}
          disabled={isFlyingOut}
          data-ocid="discover.like.button"
        >
          <Check className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2 text-center text-sm text-muted-foreground">
        {currentIndex + 1} of {neighbourhoods.length}
      </div>

      <NeighbourhoodDetailSheet
        neighbourhood={currentNeighbourhood}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </div>
  );
}
