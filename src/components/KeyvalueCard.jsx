
function KeyvalueCard(props){

    return(
            <div className="m-4 p-4 md:p-6 bg-[#CFE8DF] hover:scale-105 shadow-xl rounded-2xl">
                <div className="flex justify-center my-4">
                <img src={props.image} alt="" className="w-30 h-30 object-contain"/>
                </div>
                <h1 className="font-semibold underline underline-offset-4 decoration-green-700 text-center text-3xl mt-3 text-green-700">{props.title}</h1>
                <p className="text-center py-1.5 mx-3 mt-2 text-black" >{props.description}</p>
            </div>
        );
    }


export default KeyvalueCard;