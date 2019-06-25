isBalancedParenthesis = function (str) {
    a = str;
    x = a.split('');
    obj = { '{': '}', '[': ']', '(': ')' }
    ac = [...x];
    for (i = 0; i < ac.length;) {
        const n = ac[i];
        console.log(ac, n)
        if (!n || !ac) continue;
        const c = ac.lastIndexOf(obj[n]);
        if (c > 0) {
            ac.splice(c, 1);
            ac.splice(ac.indexOf(n), 1);
        } else { i++ };
    }
    return ac;
}

module.exports = isBalancedParenthesis 