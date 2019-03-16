import { phantomToSatoshi, parseFee, satoshiToPhantom } from "../src/utils";

describe("Utils", () => {
    describe("parseFee", () => {
        it("should give satoshi", () => {
            expect(parseFee(0.1).toString()).toBe("10000000");
            expect(parseFee(1).toString()).toBe("100000000");
            expect(parseFee(10).toString()).toBe("1000000000");
            expect(parseFee("0.1").toString()).toBe("10000000");
            expect(parseFee("1").toString()).toBe("100000000");
            expect(parseFee("10").toString()).toBe("1000000000");
            expect(parseFee("0.001-0.005").toNumber()).toBeWithin(100000, 500000);
        });
    });

    describe("phantomToSatoshi", () => {
        it("should give satoshi", () => {
            expect(phantomToSatoshi(0.00000001).toString()).toBe("1");
            expect(phantomToSatoshi(0.1).toString()).toBe("10000000");
            expect(phantomToSatoshi(1).toString()).toBe("100000000");
            expect(phantomToSatoshi(10).toString()).toBe("1000000000");
        });
    });

    describe("satoshiToPhantom", () => {
        it("should give phantom", () => {
            expect(satoshiToPhantom(1)).toBe("0.00000001 DѦ");
            expect(satoshiToPhantom(10000000)).toBe("0.1 DѦ");
            expect(satoshiToPhantom(100000000)).toBe("1 DѦ");
            expect(satoshiToPhantom(1000000000)).toBe("10 DѦ");
        });
    });
});
