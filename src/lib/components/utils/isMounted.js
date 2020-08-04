/**
 * check that given element is mounted i html tree
 * @param element : HTMLElement
 * @returns {boolean}
 */

export default function isMounted(element){
    while (element){
        if(element.matches("html")) return true;
        element = element.parentElement;
    }
    return !!element;
}