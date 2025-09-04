import "../styles/SitterCard.css";

export default function SitterCard({ name, desc, rating, img }) {
  return (
    <div className="sittercard-card">
      <img src={img} alt={name} className="sittercard-img" />
      <h3 className="sittercard-name">{name}</h3>
      <p className="sittercard-desc">{desc}</p>
      
      <div className="sittercard-stars">
        {Array.from({ length: Math.floor(rating) }).map((_, i) => (
          <span key={i} className="sittercard-star-active">★</span>
        ))}

        {Array.from({ length: 5 - Math.floor(rating) }).map((_, i) => (
          <span key={i} className="sittercard-star-inactive">★</span>
        ))}
        
      </div>
    </div>
  );
}
