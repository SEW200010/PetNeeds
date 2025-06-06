function KeyvalueCard(props){

    return(
            <div className="w-60 h-80 bg-green-200 flex flex-col rounded-3xl items-center py-3 text-black font-family-popp">
                <img src={props.image} alt="" className="w-20 h-20 mt-2"/>
                <h1 className="font-semibold text-3xl mt-3">{props.title}</h1>
                <p className="text-justify py-1.5 mx-3 mt-2" >{props.description}</p>
            </div>
        );
    }

export default KeyvalueCard;