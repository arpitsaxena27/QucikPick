import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const RightPaneContent = () => {
  return (
    <div className="w-full max-w-md px-8 rounded-lg py-12 bg-blue-200 shadow-black shadow-xl">
      <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
        <div>
          <img src="/imgu1.jpg" alt="Slide 1" className="object-cover w-full h-auto" />
          <p className="legend">Browse Products</p>
        </div>
        <div>
          <img src="/imageu2.png" alt="Slide 2" className="object-cover w-full h-auto" />
          <p className="legend">Shop Online-Offline</p>
        </div>
        <div>
          <img src="/imageu3.png" alt="Slide 3" className="object-cover w-full h-auto" />
          <p className="legend">Pay Bills Online</p>
        </div>
      </Carousel>
    </div>
  );
};

export default RightPaneContent;
