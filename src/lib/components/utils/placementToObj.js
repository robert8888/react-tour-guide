/**
 * transform position from string from to object form
 * @param placement : string
 * @returns {{x: string, y: string }}
 */

export default function placementToObj(placement){
    const place = placement.split("-");
    const _placement = {}
    if(place.length  === 1){
        _placement.y = ["left", "right"].includes(place[0]) ? "center" : place[0]
        _placement.x = ["bottom", "top"].includes(place[0]) ? "center" : place[0];
    } else if(place.length === 2){
        _placement.y = place[0];
        _placement.x = place[1];
    }
    return _placement
}