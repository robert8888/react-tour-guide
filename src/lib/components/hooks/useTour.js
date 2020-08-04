import {useContext, useMemo} from "react";
import {Context} from "./../Context/Context";

export default function useTour(id){
    const tourContext = useContext(Context);

    const tour = useMemo(()=> {
       return [tourContext.tour(id)]
    }, [id, tourContext])

    if(!tourContext) return [];

    return tour;
}