interface CardProps {
    title: string;
    image: string;
    price: string;
    description: string;
    category: string;
}

function Card({title, image, price}: CardProps) {
    return(
        <div className="card">
            <img className="cardImage" src={image} alt={title}></img>
            <h3 className="cardTitle">{title}</h3>
            <p className="cardPrice">{price}</p>            
        </div>
    );
}

export default Card