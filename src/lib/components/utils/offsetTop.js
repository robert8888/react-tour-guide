/**
 *
 * @param element : HTMLElement
 * @param scrollTarget : window | HTMLElement
 * @returns {number}
 */
export function offsetTop(element, scrollTarget = window){
    if(!element) return 0;
    const offset = scrollTarget.pageYOffset || scrollTarget.scrollTop || 0;
    return offset + element.getBoundingClientRect().top;
}

/**
 *
 * @param element : HTMLElement
 * @param scrollTarget : window | HTMLElement
 * @returns {number}
 */
export function offsetLef(element, scrollTarget = window){
    if(!element) return 0;
    const offset = scrollTarget.pageXOffset || scrollTarget.scrollLeft || 0;
    return offset + element.getBoundingClientRect().left;
}
