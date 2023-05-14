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

import { Symbol as BinanceSymbol, } from "binance-api-node";

import {
    unsupportedTimeframeError,
    unsupportedTimeInForceError,
    unknownTimeframeError,
    unknownTimeInForceError,
} from "#errors/MidaErrorUtilities";
import { MidaOrderTimeInForce, } from "#orders/MidaOrderTimeInForce";
import { MidaTimeframe, } from "#timeframes/MidaTimeframe";
import { BinanceSpot, } from "!/src/platforms/binance/spot/BinanceSpot";

export namespace BinanceSpotUtilities {
    export const getBinanceSymbolFilterByType = (binanceSymbol: BinanceSymbol, type: string): Record<string, any> | undefined => {
        for (const filter of binanceSymbol.filters) {
            if (filter.filterType === type) {
                return filter;
            }
        }

        return undefined;
    };

    export const toBinanceTimeframe = (timeframe: MidaTimeframe): string => {
        switch (timeframe) {
            case MidaTimeframe.S1: {
                return "1s";
            }
            case MidaTimeframe.M1: {
                return "1m";
            }
            case MidaTimeframe.M3: {
                return "3m";
            }
            case MidaTimeframe.M5: {
                return "5m";
            }
            case MidaTimeframe.M15: {
                return "15m";
            }
            case MidaTimeframe.M30: {
                return "30m";
            }
            case MidaTimeframe.H1: {
                return "1h";
            }
            case MidaTimeframe.H2: {
                return "2h";
            }
            case MidaTimeframe.H4: {
                return "4h";
            }
            case MidaTimeframe.H6: {
                return "6h";
            }
            case MidaTimeframe.H12: {
                return "12h";
            }
            case MidaTimeframe.D1: {
                return "1d";
            }
            case MidaTimeframe.D3: {
                return "3d";
            }
            case MidaTimeframe.W1: {
                return "1w";
            }
            case MidaTimeframe.MO1: {
                return "1M";
            }
            default: {
                throw unsupportedTimeframeError(BinanceSpot.instance, timeframe);
            }
        }
    };

    export const toBinanceTimeInForce = (timeInForce: MidaOrderTimeInForce): string => {
        switch (timeInForce) {
            case MidaOrderTimeInForce.GOOD_TILL_CANCEL: {
                return "GTC";
            }
            case MidaOrderTimeInForce.FILL_OR_KILL: {
                return "FOK";
            }
            case MidaOrderTimeInForce.IMMEDIATE_OR_CANCEL: {
                return "IOC";
            }
            default: {
                throw unsupportedTimeInForceError(BinanceSpot.instance, timeInForce);
            }
        }
    };

    export const normalizeTimeframe = (timeframe: string): MidaTimeframe => {
        switch (timeframe) {
            case "1s": {
                return MidaTimeframe.S1;
            }
            case "1m": {
                return MidaTimeframe.M1;
            }
            case "3m": {
                return MidaTimeframe.M3;
            }
            case "5m": {
                return MidaTimeframe.M5;
            }
            case "15m": {
                return MidaTimeframe.M15;
            }
            case "30m": {
                return MidaTimeframe.M30;
            }
            case "1h": {
                return MidaTimeframe.H1;
            }
            case "2h": {
                return MidaTimeframe.H2;
            }
            case "4h": {
                return MidaTimeframe.H4;
            }
            case "6h": {
                return MidaTimeframe.H6;
            }
            case "12h": {
                return MidaTimeframe.H12;
            }
            case "1d": {
                return MidaTimeframe.D1;
            }
            case "3d": {
                return MidaTimeframe.D3;
            }
            case "1w": {
                return MidaTimeframe.W1;
            }
            case "1M": {
                return MidaTimeframe.MO1;
            }
            default: {
                throw unknownTimeframeError(BinanceSpot.instance, timeframe);
            }
        }
    };

    export const normalizeTimeInForce = (timeInForce: string): MidaOrderTimeInForce => {
        switch (timeInForce.toUpperCase()) {
            case "GTC": {
                return MidaOrderTimeInForce.GOOD_TILL_CANCEL;
            }
            case "FOK": {
                return MidaOrderTimeInForce.FILL_OR_KILL;
            }
            case "IOC": {
                return MidaOrderTimeInForce.IMMEDIATE_OR_CANCEL;
            }
            default: {
                throw unknownTimeInForceError(BinanceSpot.instance, timeInForce);
            }
        }
    };
}
