
import GoalImage from "../assets/Aboutus/Goal-image.png";
import MissionImage from "../assets/Aboutus/Mission-image.png";
import VisionImage from "../assets/Aboutus/Vision-image.png";
import CoreImage from "../assets/Aboutus/Core-image.png";
import KeyvalueCard from "./KeyvalueCard";

function Keyvalues(){

    const KeyValues = [
        {
          _id: 1,
          image: GoalImage,
          title: "Goal",
          description: "To build a resilient generation that rises above societal challenges through life skills, leadership training, and community collaboration, paving the way for. ",
        },
        {
          _id: 2,
          image: MissionImage,
          title: "Mission",
          description: "To build a resilient generation that rises above societal challenges through life skills, leadership training, and community collaboration, paving the way for. ",
        },
        {
          _id: 3,
          image: VisionImage,
          title: "Vision",
          description: "To build a resilient generation that rises above societal challenges through life skills, leadership training, and community collaboration, paving the way for. ",
        },
        {
            _id: 4,
            image:CoreImage,
            title: "Core",
            description: "To build a resilient generation that rises above societal challenges through life skills, leadership training, and community collaboration, paving the way for. ",
          },
      ];

    return(
         <div className="my-5 mx-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-8 ">
            {KeyValues.map((keyvalue)=>{
                return(
                    <KeyvalueCard
                        _id={keyvalue._id}
                        image={keyvalue.image}
                        title={keyvalue.title}
                        description={keyvalue.description}
                    />
                );  
            })}
        </div>
    );
}


export default Keyvalues;