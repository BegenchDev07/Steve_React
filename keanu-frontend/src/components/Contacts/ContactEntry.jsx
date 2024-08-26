import AvatarImage from "../AvatarImage";

export default function ContactEntry({openContact, name, id, text, time, type}) {

    const onClick = _ => {
        openContact(id, name);
    };

    const renderText = _ => {
        if(text!==""){
            return text;
        }else{
            switch (type) {
                case "SD_client_infer":
                    return "Inference result";
                default:
                    return "Unknown Message";
            }
        }
    }

    return (
        <li
            key={`contact_entry_${id}`}
            onClick={onClick}
            className="w-auto flex flex-col gap-4 p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-in-out shadow-sm">
            <div className="w-full flex items-center gap-3">
                <div className="w-auto h-12 flex flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
                    <AvatarImage width={12} avatar={name}/>
                </div>
                <div className="w-full flex flex-col">
                    <div className="w-auto flex justify-start items-center">
                        <h1 className="text-xl capitalize font-semibold text-gray-900">{name}</h1>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p className="text-gray-500 text-sm line-clamp-1">{renderText()}</p>
                        <div className="flex gap-2 text-gray-400 text-xs">
                            <p>{time.substring(5, 10)}</p>
                            <p>{time.substring(11, 16)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}
