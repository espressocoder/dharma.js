import * as Web3 from "web3";

import { Dharma } from "../../../../src/dharma";
import { LoanRequest, LoanRequestParams } from "../../../../src/loan";

import { Web3Utils } from "../../../../utils/web3_utils";

const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(provider);
const web3Utils = new Web3Utils(web3);

export async function testIsFillable(dharma: Dharma, params: LoanRequestParams) {
    describe("for a debt order with valid parameters", () => {
        let currentSnapshotId: number;

        beforeEach(async () => {
            currentSnapshotId = await web3Utils.saveTestSnapshot();
        });

        afterEach(async () => {
            await web3Utils.revertToSnapshot(currentSnapshotId);
        });

        describe("when the debtor has not granted sufficient allowance", () => {
            test("eventually returns false", async () => {
                const loanRequest = await LoanRequest.create(dharma, params);

                const isFillable = await loanRequest.isFillable();

                expect(isFillable).toEqual(false);
            });
        });

        describe("when the debtor has granted sufficient allowance", () => {
            test("eventually returns true", async () => {
                const loanRequest = await LoanRequest.create(dharma, params);
                await loanRequest.allowCollateralTransfer();

                const isFillable = await loanRequest.isFillable();

                expect(isFillable).toEqual(true);
            });
        });
    });
}