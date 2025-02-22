/*
 * Copyright Reiryoku Technologies and its contributors, www.reiryoku.com, www.mida.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

import { ContractClient, WebsocketClient, } from "bybit-api";

import { MidaTradingAccountOperativity, } from "#accounts/MidaTradingAccountOperativity";
import { MidaTradingAccountPositionAccounting, } from "#accounts/MidaTradingAccountPositionAccounting";
import { date, } from "#dates/MidaDate";
import { decimal, } from "#decimals/MidaDecimal";
import { MidaTradingPlatform, } from "#platforms/MidaTradingPlatform";
import { BybitFuturesAccount, } from "!/src/platforms/bybit/futures/BybitFuturesAccount";
import { BybitFuturesLoginParameters, } from "!/src/platforms/bybit/futures/BybitFuturesLoginParameters";

/** Used as internal map to cache logged accounts */
const loggedAccounts: Map<string, BybitFuturesAccount> = new Map();
const platformDescriptor: Readonly<Record<string, any>> = {
    name: "Bybit Futures (USDT Perpetual)",
    siteUri: "https://www.bybit.com/",
    primaryAsset: "USDT",
};

export class BybitFutures extends MidaTradingPlatform {
    private constructor () {
        super({ name: platformDescriptor.name, siteUri: platformDescriptor.siteUri, });
    }

    public override async login ({
        apiKey,
        apiSecret,
        useTestnet,
    }: BybitFuturesLoginParameters): Promise<BybitFuturesAccount> {
        if (loggedAccounts.has(apiKey)) {
            return loggedAccounts.get(apiKey) as BybitFuturesAccount;
        }

        const tradingAccount: BybitFuturesAccount = new BybitFuturesAccount({
            id: "",
            platform: this,
            creationDate: date(0),
            primaryAsset: platformDescriptor.primaryAsset,
            indicativeLeverage: decimal(100),
            operativity: useTestnet ? MidaTradingAccountOperativity.DEMO : MidaTradingAccountOperativity.REAL,
            positionAccounting: MidaTradingAccountPositionAccounting.NETTED,
            bybitConnection: new ContractClient({
                key: apiKey,
                secret: apiSecret,
                testnet: useTestnet ?? false,
            }),
            bybitWsConnection: new WebsocketClient({
                key: apiKey,
                secret: apiSecret,
                market: "contractUSDT",
                testnet: useTestnet ?? false,
            }, /* Used to disable WS logs */ {
                silly: (): void => {},
                debug: (): void => {},
                notice: (): void => {},
                info: (): void => {},
                warning: (): void => {},
                error: (): void => {},
            }),
        });

        await tradingAccount.preload();

        loggedAccounts.set(apiKey, tradingAccount);

        return tradingAccount;
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static #instance: BybitFutures = new BybitFutures();

    public static get instance (): BybitFutures {
        return this.#instance;
    }
}
