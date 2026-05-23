import React, { useState } from 'react';
import { Review } from '../../types/Review';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewSectionProps {
  reviews: Review[];
  itemName: string;
}

export function ReviewSection({ reviews, itemName }: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('¡Reseña enviada exitosamente!');
    setShowReviewForm(false);
    setComment('');
    setRating(5);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reseñas ({reviews.length})</CardTitle>
          {!showReviewForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewForm(true)}
            >
              Escribir Reseña
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="mb-3">Tu reseña para {itemName}</h4>
            <div className="mb-3">
              <label className="text-sm text-gray-600 mb-2 block">Calificación</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-all"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="text-sm text-gray-600 mb-2 block">Comentario</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia..."
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-gradient-to-r from-teal-500 to-cyan-600">
                Enviar Reseña
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay reseñas aún. ¡Sé el primero en compartir tu experiencia!
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p>{review.userName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
