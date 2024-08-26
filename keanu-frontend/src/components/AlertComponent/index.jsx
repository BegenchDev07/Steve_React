export default function AlertComponent({message}) {
    return (
        <div className="flex w-full fixed top-20 z-50 items-center justify-center py-2">
            <div className="w-1/2 bg-red-600 rounded-lg flex items-center text-center justify-center border-2 border-red-800">
                <p className="text-white font-semibold">{message}</p>
            </div>
        </div>
    )
}