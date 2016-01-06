function getDocSize(fSize) {
    var arr = [], k = 0;
    function getSize(s) {
        if (k == 3) {
            arr.push((s % 10) + ',');
            k = 0;
        } else {
            arr.push(s % 10);
        }
        s = parseInt(s / 10);
        k++;
        return s ? getSize(s) : arr.reverse().join('');
    }
    return getSize(Math.ceil(fSize / 1024));
};


describe("Document size", function () {
    it("It is a 'Number'", function () {
        var b = getDocSize(234254);
        expect(b).toEqual(jasmine.any(Number));
    });
});