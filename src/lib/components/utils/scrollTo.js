/**
 * Native scrollTo with callback
 * @param top
 * @param left
 * @param callback - callback function
 */
export default function scrollTo(target = window, {top , left }, callback) {
    const targetTop = ~~top || 0
    const targetLeft = ~~left || 0;
    const initTop = ~~(target.pageYOffset || target.scrollTop || 0);
    const initLeft = ~~(target.pageXOffset || target.scrollLeft || 0);
    const onScroll = () => {
        let currentLeft = ~~(target.pageXOffset || target.scrollLeft || 0);
        let currentTop = ~~(target.pageYOffset || target.scrollTop || 0);

        if ((currentTop === targetTop && currentTop !== initTop)
            || (currentLeft === targetLeft && currentLeft !== initLeft)) {
            target.removeEventListener('scroll', onScroll)
            callback && callback()
        }
    }

    target.addEventListener('scroll', onScroll)
    setTimeout(() =>
        target.removeEventListener('scroll', onScroll),
    3000) // safety remove event listener

    onScroll()
    target.scrollTo({
        top,
        left,
        behavior: 'smooth'
    })
}