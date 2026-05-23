import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservationName: string;
  onSubmitReview: (rating: number, comment: string) => void;
  onRemindLater: () => void;
}

export function ReviewDialog({
  open,
  onOpenChange,
  reservationName,
  onSubmitReview,
  onRemindLater,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error('Por favor escribe un comentario');
      return;
    }
    onSubmitReview(rating, comment);
    setComment('');
    setRating(5);
    onOpenChange(false);
    toast.success('¡Gracias por tu reseña!');
  };

  const handleRemindLater = () => {
    onRemindLater();
    onOpenChange(false);
    toast.info('Te recordaremos más tarde');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">¿Qué te pareció el servicio?</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Nos encantaría conocer tu experiencia con <span className="font-semibold">{reservationName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <label className="text-sm">Calificación</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button 
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </Button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              {rating === 5 && '¡Excelente!'}
              {rating === 4 && 'Muy bueno'}
              {rating === 3 && 'Bueno'}
              {rating === 2 && 'Regular'}
              {rating === 1 && 'Necesita mejorar'}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm">Cuéntanos sobre tu experiencia</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¿Qué fue lo que más te gustó? ¿Hay algo que podamos mejorar?"
              rows={5}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleRemindLater}
            className="order-2 sm:order-1"
          >
            Recordar más tarde
          </Button>
          <Button
            onClick={handleSubmit}
            className="order-1 sm:order-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
          >
            Enviar Reseña
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
