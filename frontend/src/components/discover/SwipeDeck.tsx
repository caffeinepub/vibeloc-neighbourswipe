import { useState, useRef, useEffect } from 'react';
import { Neighbourhood } from '../../types/neighbourhood';
import NeighbourhoodCard from './NeighbourhoodCard';
import { Button } from '@/components/ui/button';
import { X, Heart } from 'lucide-react';

interface SwipeDeckProps {
  neighbourhoods: Neighbourhood[];
  onLike: (neighbourhood: Neighbourhood) => void;
  onDislike: (neighbourhood: Neighbourhood) => void;
}

export default function SwipeDeck({ neighbourhoods, onLike, onDislike }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const currentNeighbourhood = neighbourhoods[currentIndex];

  const handleNext = () => {
    if (currentIndex < neighbourhoods.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDragOffset(0);
    }
  };

  const handleLike = () => {
    if (currentNeighbourhood) {
      onLike(currentNeighbourhood);
      handleNext();
    }
  };

  const handleDislike = () => {
    if (currentNeighbourhood) {
      onDislike(currentNeighbourhood);
      handleNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
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
        handleLike();
      } else {
        handleDislike();
      }
    }
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    }
    setDragOffset(0);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!currentNeighbourhood) {
    return null;
  }

  const rotation = dragOffset * 0.05;
  const opacity = 1 - Math.abs(dragOffset) / 300;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        ref={cardRef}
        className="relative touch-none select-none transition-transform"
        style={{
          transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
          opacity: Math.max(opacity, 0.5),
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <NeighbourhoodCard neighbourhood={currentNeighbourhood} />
        
        {dragOffset > 50 && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg border-4 border-green-500 bg-green-500/20">
            <Heart className="h-24 w-24 text-green-500" fill="currentColor" />
          </div>
        )}
        
        {dragOffset < -50 && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg border-4 border-red-500 bg-red-500/20">
            <X className="h-24 w-24 text-red-500" />
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleDislike}
        >
          <X className="h-8 w-8" />
        </Button>
        <Button
          size="lg"
          className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
          onClick={handleLike}
        >
          <Heart className="h-8 w-8" fill="currentColor" />
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {currentIndex + 1} of {neighbourhoods.length}
      </div>
    </div>
  );
}
