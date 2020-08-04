/***
 * return first overflowed parent element
 * which pass the test
 * @param node : HTMLElement
 * @param hidden : bool  - include overflow hidden
 * @param test - css selector
 * @returns {null| HTMLElement}
 */

export default function getScrollParent(node, hidden, test){
    const get = () => {
        const regex = hidden  ? /(auto|scroll|hidden)/ : /(auto|scroll)/ ;
        const parents = (_node, ps) => {
            if (_node.parentNode === null) { return ps; }
            return parents(_node.parentNode, ps.concat([_node]));
        };

        const style = (_node, prop) => getComputedStyle(_node, null).getPropertyValue(prop);
        const overflow = _node => style(_node, 'overflow') + style(_node, 'overflow-y') + style(_node, 'overflow-x');
        const scroll = _node => regex.test(overflow(_node));

        /* eslint-disable consistent-return */
        const scrollParent = (_node) => {
            if (!(_node instanceof HTMLElement || _node instanceof SVGElement)) {
                return;
            }

            const ps = parents(_node.parentNode, []);

            for (let i = 0; i < ps.length; i += 1) {
                if (scroll(ps[i])) {
                    return ps[i];
                }
            }

            return document.scrollingElement || document.documentElement;
        };

        return scrollParent(node);
    }

    const parentNode = get(node);
    if(parentNode.matches(test)){
        return parentNode;
    }
    return null;
    /* eslint-enable consistent-return */
};