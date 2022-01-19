import {expect} from "chai";
import {CaptchaTypes, Dataset} from "../src/types/captcha";
import {addHashesToDataset, compareCaptcha, compareCaptchaSolutions, computeCaptchaHashes} from "../src/captcha";
import {CaptchaMerkleTree} from "../src/merkle";


const DATASET = {
    "format": "SelectAll" as CaptchaTypes,
    "captchas": [
        {
            "solution": [],
            "salt": "0x01",
            "target": "bus",
            "items": [
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},

            ]
        },
        {
            "salt": "0x02",
            "target": "train",
            "items": [
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
                {"type": "text", "text": "blah"},
            ]
        }]
};


describe("PROVIDER CAPTCHA", () => {
    after(() => {
        return
    });

    it("Captcha data set is hashed correctly", async () => {
        let captchasWithHashes = await computeCaptchaHashes(DATASET['captchas'])
        expect(captchasWithHashes[0].captchaId).to.equal("0x83f378619ef1d3cced90ad760b33d24995e81583b4cd269358fa53b690d560b5");
        expect(captchasWithHashes[1].captchaId).to.equal("0x0977061f4bca26f49f2657b582944ce7c549862a4be7e0fc8f9a9a6cdb788475");
    });

    it("Captcha hashes are successfully added to dataset", async () => {
        let captchasWithHashes = [
            {
                captchaId: "0x83f378619ef1d3cced90ad760b33d24995e81583b4cd269358fa53b690d560b5",
                "salt": "",
                "solution": []
            },
            {
                captchaId: "0x0977061f4bca26f49f2657b582944ce7c549862a4be7e0fc8f9a9a6cdb788475",
                "salt": "",
                "solution": []
            },
        ]
        const tree = new CaptchaMerkleTree();
        await tree.build(captchasWithHashes);
        // tree is not required anymore, this could be changed to addHashesToDataset(DATASET, captchasWithHashes)
        const dataset = addHashesToDataset(DATASET, tree);
        expect(dataset.captchas[0].captchaId).to.equal("0x83f378619ef1d3cced90ad760b33d24995e81583b4cd269358fa53b690d560b5");
        expect(dataset.captchas[1].captchaId).to.equal("0x0977061f4bca26f49f2657b582944ce7c549862a4be7e0fc8f9a9a6cdb788475");
    });


    it("Empty dataset and tree throws error", async () => {
        expect(function () {
            addHashesToDataset({} as Dataset, new CaptchaMerkleTree())
        }).to.throw(/error hashing dataset/);
    })


    it("Matching captcha solutions are correctly compared, returning true", () => {
        let received = [{captchaId: "1", solution: [42], salt: ""}, {captchaId: "2", solution: [42], salt: ""}]
        let stored = [
            {captchaId: "1", solution: [42], salt: "", items: [], target: ""},
            {captchaId: "2", solution: [42], salt: "", items: [], target: ""}
        ]
        expect(compareCaptchaSolutions(received, stored)).to.be.true
    })

    it("Non-matching captcha solutions are correctly compared, returning false", () => {
        let received = [{captchaId: "1", solution: [42], salt: ""}, {captchaId: "2", solution: [42], salt: ""}]
        let stored = [
            {captchaId: "1", solution: [21], salt: "", items: [], target: ""},
            {captchaId: "2", solution: [42], salt: "", items: [], target: ""}
        ]
        expect(compareCaptchaSolutions(received, stored)).to.be.false
    })

    it("Mismatched length captcha solutions returns false", () => {
        let received = [
            {captchaId: "1", solution: [42], salt: ""},
            {captchaId: "2", solution: [42], salt: ""},
            {captchaId: "3", solution: [42], salt: ""}
        ]
        let stored = [
            {captchaId: "1", solution: [21], salt: "", items: [], target: ""},
            {captchaId: "2", solution: [42], salt: "", items: [], target: ""}
        ]
        expect(compareCaptchaSolutions(received, stored)).to.be.false
    })

    it.only("Two captchas are correctly compared when solutions and captchaIds are identical", () => {
        const c1 = {solution: [1, 2, 3, 4], captchaId: "1", salt: ""}
        const c2 = {solution: [1, 3, 2, 4], captchaId: "1", salt: "", items: [], target: ""}
        expect(compareCaptcha(c1, c2)).to.be.true
    })

    it.only("Two captchas are correctly compared when solutions and captchaIds are different", () => {
        const c1 = {solution: [1, 2, 3, 4], captchaId: "1", salt: ""}
        const c2 = {solution: [1, 3,], captchaId: "1", salt: "", items: [], target: ""}
        expect(compareCaptcha(c1, c2)).to.be.false
    })

    it.only("Mismatched captchas are correctly compared", () => {
        const c1 = {solution: [1, 2, 3, 4], captchaId: "1", salt: ""}
        const c2 = {solution: [1, 3, 2, 4], captchaId: "2", salt: "", items: [], target: ""}
        expect(compareCaptcha(c1, c2)).to.be.false
    })

    it.only("Captchas with zero length solutions are automatically assumed to be correct", () => {
        const c1 = {solution: [1, 2, 3, 4], captchaId: "1", salt: ""}
        const c2 = {solution: [], captchaId: "2", salt: "", items: [], target: ""}
        expect(compareCaptcha(c1, c2)).to.be.true
    })

    it.only("Captchas with no solutions are automatically assumed to be correct", () => {
        const c1 = {solution: [1, 2, 3, 4], captchaId: "1", salt: ""}
        const c2 = {solution: undefined, captchaId: "2", salt: "", items: [], target: ""}
        expect(compareCaptcha(c1, c2)).to.be.true
    })
})