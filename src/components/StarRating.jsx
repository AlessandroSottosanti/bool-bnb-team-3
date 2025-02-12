import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({vote}) => {

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(vote);
        const emptyStars = 5 - fullStars;
    
        //stelle piene
        for (let i = 0; i < fullStars; i++) {
          stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
        }
    
        //stelle vuote
        for (let i = 0; i < emptyStars; i++) {
          stars.push(<FaRegStar key={`empty-${i}`} className="text-secondary" />);
        }
    
        return stars;
      };


    return (
        <div>
            {renderStars()}
        </div>
    )
}


export default StarRating;