/**
 * reduce value to range from min to max value
 * @param value : number
 * @param min : number
 * @param max : number
 * @returns {number}
 */

export default function toRange(value, min, max){
    return Math.max(Math.min(value, max), min)
}