
import React, { useState, useEffect } from 'react';
import '../styles/FeedbackDesign.css';

const FeedbackWidget = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('5');

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = { comment, rating };

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    });

    if (res.ok) {
      setComment('');
      const updated = await fetch('/api/reviews');
      setReviews(await updated.json());
    }
  };

  const checkMood = async (id: string) => {
    const res = await fetch(`/api/reviews/analyse/${id}`, { method: 'POST' });
    const data = await res.json();
    setReviews(reviews.map(r => r._id === id ? { ...r, mood: data.mood } : r));
  };

  return (
    <div className="feedback-container">
      <h2>Customer Feedback</h2>
      
      <form onSubmit={handleSend} className="review-form">
        <label>Your Rating (1-5):</label>
        <input type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} />
        <textarea placeholder="Write your thoughts..." value={comment} onChange={e => setComment(e.target.value)} required />
        <button type="submit" className="submit-btn">Post Review</button>
      </form>

      <div className="review-list">
        {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((r) => (
          <div key={r._id} className="review-card">
            <strong>Rating: {r.rating}/5</strong>
            <p>{r.reviewComment || r.comment}</p>
            {r.mood ? (
              <span className="ai-badge">AI Sentiment: {r.mood}</span>
            ) : (
              <button onClick={() => checkMood(r._id)} style={{fontSize: '10px', marginTop: '5px', cursor: 'pointer'}}>Analyse Mood</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackWidget;
