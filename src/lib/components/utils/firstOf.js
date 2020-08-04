/**
 * return first not undefined or null element of array
 * @param values
 * @returns {any}
 */
export default function firstOf(values){
    for(let value of values){
        if(value!== undefined && value !== null){
            return value;
        }
    }
}