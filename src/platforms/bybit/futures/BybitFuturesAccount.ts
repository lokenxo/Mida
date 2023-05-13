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

import {
    ContractClient,
    KlineIntervalV3,
    WebsocketClient,
} from "bybit-api";

import { MidaTradingAccount, } from "#accounts/MidaTradingAccount";
import { MidaAsset, } from "#assets/MidaAsset";
import { MidaAssetStatement, } from "#assets/MidaAssetStatement";
import { date, MidaDate, } from "#dates/MidaDate";
import { decimal, MidaDecimal, } from "#decimals/MidaDecimal";
import { MidaEventListener, } from "#events/MidaEventListener";
import { MidaOrder, } from "#orders/MidaOrder";
import { MidaOrderDirection, } from "#orders/MidaOrderDirection";
import { MidaOrderDirectives, } from "#orders/MidaOrderDirectives";
import { MidaOrderPurpose, } from "#orders/MidaOrderPurpose";
import { MidaOrderStatus, } from "#orders/MidaOrderStatus";
import { MidaOrderTimeInForce, } from "#orders/MidaOrderTimeInForce";
import { MidaPeriod, } from "#periods/MidaPeriod";
import { MidaPositionDirection, } from "#positions/MidaPositionDirection";
import { MidaQuotationPrice, } from "#quotations/MidaQuotationPrice";
import { MidaSymbol, } from "#symbols/MidaSymbol";
import { MidaSymbolFundingDescriptor, } from "#symbols/MidaSymbolFundingDescriptor";
import { MidaSymbolTradeStatus, } from "#symbols/MidaSymbolTradeStatus";
import { MidaTick, } from "#ticks/MidaTick";
import { MidaTickMovement, } from "#ticks/MidaTickMovement";
import { MidaTimeframe, } from "#timeframes/MidaTimeframe";
import { MidaTrade, } from "#trades/MidaTrade";
import { MidaTradeDirection, } from "#trades/MidaTradeDirection";
import { MidaTradePurpose, } from "#trades/MidaTradePurpose";
import { MidaTradeStatus, } from "#trades/MidaTradeStatus";
import { MidaEmitter, } from "#utilities/emitters/MidaEmitter";
import { createOrderResolver, } from "#utilities/MidaUtilities";
import { BybitFuturesAccountParameters, } from "!/src/platforms/bybit/futures/BybitFuturesAccountParameters";
import { BybitFuturesOrder, } from "!/src/platforms/bybit/futures/orders/BybitFuturesOrder";
import { BybitFuturesPosition, } from "!/src/platforms/bybit/futures/positions/BybitFuturesPosition";
import { BybitFuturesTrade, } from "!/src/platforms/bybit/futures/trades/BybitFuturesTrade";
import { BybitFuturesUtilities, } from "!/src/platforms/bybit/futures/utilities/BybitFuturesUtilities";

export class BybitFuturesAccount extends MidaTradingAccount {
    readonly #bybitConnection: ContractClient;
    readonly #bybitWsConnection: WebsocketClient;
    readonly #bybitEmitter: MidaEmitter;
    readonly #assets: Map<string, MidaAsset>;
    readonly #symbols: Map<string, MidaSymbol>;
    readonly #tickListeners: Map<string, boolean>;
    readonly #periodListeners: Map<string, MidaTimeframe[]>;
    readonly #lastTicks: Map<string, MidaTick>;

    public constructor ({
        id,
        platform,
        creationDate,
        primaryAsset,
        operativity,
        positionAccounting,
        indicativeLeverage,
        bybitConnection,
        bybitWsConnection,
    }: BybitFuturesAccountParameters) {
        super({
            id,
            platform,
            creationDate,
            primaryAsset,
            operativity,
            positionAccounting,
            indicativeLeverage,
        });

        this.#bybitConnection = bybitConnection;
        this.#bybitWsConnection = bybitWsConnection;
        this.#bybitEmitter = new MidaEmitter();
        this.#assets = new Map();
        this.#symbols = new Map();
        this.#tickListeners = new Map();
        this.#periodListeners = new Map();
        this.#lastTicks = new Map();
    }

    public async preload (): Promise<void> {
        await this.#preloadSymbols();
        await this.#configureListeners();
    }

    public override async placeOrder (directives: MidaOrderDirectives): Promise<MidaOrder> {
        const symbol: string = directives.symbol as string;
        const direction: MidaOrderDirection = directives.direction;
        const requestedVolume: MidaDecimal = decimal(directives.volume);
        const order: BybitFuturesOrder = new BybitFuturesOrder({
            id: "",
            direction,
            limitPrice: directives.limit !== undefined ? decimal(directives.limit) : undefined,
            purpose: direction === MidaOrderDirection.BUY ? MidaOrderPurpose.OPEN : MidaOrderPurpose.CLOSE,
            requestedVolume,
            status: MidaOrderStatus.REQUESTED,
            symbol,
            timeInForce: directives.timeInForce ?? MidaOrderTimeInForce.GOOD_TILL_CANCEL,
            tradingAccount: this,
            bybitConnection: this.#bybitConnection,
            bybitEmitter: this.#bybitEmitter,
            directives,
            isStopOut: false,
            clientOrderId: directives.clientOrderId,
            trades: [],
        });

        const listeners: Record<string, MidaEventListener> = directives.listeners ?? {};
        const resolver: Promise<BybitFuturesOrder> =
            createOrderResolver(order, directives.resolverEvents) as Promise<BybitFuturesOrder>;

        for (const eventType of Object.keys(listeners)) {
            order.on(eventType, listeners[eventType]);
        }

        this.notifyListeners("order", { order, });
        order.send();

        return resolver;
    }

    public override async getBalance (): Promise<MidaDecimal> {
        const assetStatement: MidaAssetStatement = await this.#getAssetStatement(this.primaryAsset);

        return decimal(assetStatement.freeVolume).add(assetStatement.lockedVolume).add(assetStatement.borrowedVolume);
    }

    public override async getAssetBalance (asset: string): Promise<MidaAssetStatement> {
        return this.#getAssetStatement(asset);
    }

    public override async getBalanceSheet (): Promise<MidaAssetStatement[]> {
        const balanceSheet: MidaAssetStatement[] = [];
        const bybitAssets: Record<string, any>[] = (await this.#bybitConnection.getBalances()).result.list;

        for (const bybitAsset of bybitAssets) {
            const totalVolume: MidaDecimal = decimal(bybitAsset.walletBalance);

            if (totalVolume.greaterThan(0)) {
                balanceSheet.push({
                    tradingAccount: this,
                    date: date(),
                    asset: bybitAsset.coin,
                    freeVolume: totalVolume,
                    lockedVolume: decimal(0),
                    borrowedVolume: decimal(0),
                });
            }
        }

        return balanceSheet;
    }

    public override async getEquity (): Promise<MidaDecimal> {
        return decimal(0);
    }

    public override async getUsedMargin (): Promise<MidaDecimal> {
        return decimal(0);
    }

    public override async getFreeMargin (): Promise<MidaDecimal> {
        return decimal(0);
    }

    public override async getMarginLevel (): Promise<MidaDecimal | undefined> {
        return undefined;
    }

    public override async getTrades (symbol: string): Promise<MidaTrade[]> {
        const trades: MidaTrade[] = [];
        const bybitTrades: Record<string, any>[] = (await this.#bybitConnection.getUserExecutionHistory({ symbol, })).result.list;

        for (const bybitTrade of bybitTrades) {
            trades.push(this.normalizeTrade(bybitTrade));
        }

        return trades;
    }

    public normalizeTrade (bybitTrade: Record<string, any>): BybitFuturesTrade {
        return new BybitFuturesTrade({
            id: bybitTrade.execId,
            orderId: bybitTrade.orderId,
            positionId: "",
            tradingAccount: this,
            symbol: bybitTrade.symbol,
            commission: decimal(bybitTrade.execFee),
            commissionAsset: "",
            direction: bybitTrade.side === "Buy" ? MidaTradeDirection.BUY : MidaTradeDirection.SELL,
            executionDate: date(bybitTrade.execTime),
            executionPrice: decimal(bybitTrade.execPrice),
            purpose: MidaTradePurpose.UNKNOWN,
            status: MidaTradeStatus.EXECUTED,
            volume: decimal(bybitTrade.execQty),
        });
    }

    public normalizeOrder (bybitOrder: Record<string, any>): BybitFuturesOrder {
        const creationDate: MidaDate | undefined = bybitOrder.createdTime ? date(bybitOrder.createdTime) : undefined;
        let status: MidaOrderStatus = MidaOrderStatus.REQUESTED;

        switch (bybitOrder.orderStatus) {
            case "New":
            case "Created": {
                if (bybitOrder.order_type !== "Market") {
                    status = MidaOrderStatus.PENDING;
                }

                break;
            }
            case "PartiallyFilled":
            case "Filled": {
                status = MidaOrderStatus.EXECUTED;

                break;
            }
            case "PendingCancel":
            case "Cancelled": {
                status = MidaOrderStatus.CANCELLED;

                break;
            }
            case "Rejected": {
                status = MidaOrderStatus.REJECTED;

                break;
            }
        }

        return new BybitFuturesOrder({
            id: bybitOrder.orderId,
            tradingAccount: this,
            creationDate,
            trades: [],
            direction: bybitOrder.side === "Buy" ? MidaOrderDirection.BUY : MidaOrderDirection.SELL,
            isStopOut: false,
            clientOrderId: bybitOrder.orderLinkId,
            lastUpdateDate: bybitOrder.updatedTime ? date(bybitOrder.updatdeTime) : creationDate,
            limitPrice: bybitOrder.type === "Limit" ? decimal(bybitOrder.price) : undefined,
            purpose: bybitOrder.side === "Buy" ? MidaOrderPurpose.OPEN : MidaOrderPurpose.CLOSE,
            requestedVolume: decimal(bybitOrder.qty),
            status,
            symbol: bybitOrder.symbol,
            timeInForce: BybitFuturesUtilities.normalizeTimeInForce(bybitOrder.timeInForce),
            bybitConnection: this.#bybitConnection,
            bybitEmitter: this.#bybitEmitter,
        });
    }

    public override async getOrders (symbol: string): Promise<MidaOrder[]> {
        const executedOrders: MidaOrder[] = [];
        const bybitOrders: Record<string, any>[] = (await this.#bybitConnection.getHistoricOrders({
            symbol,
            limit: 50,
        })).result.list;

        for (const bybitOrder of bybitOrders) {
            const order = this.normalizeOrder(bybitOrder);

            if (order.isExecuted) {
                executedOrders.push(order);
            }
        }

        return executedOrders;
    }

    public override async getPendingOrders (): Promise<MidaOrder[]> {
        const bybitOrders: Record<string, any>[] = (await this.#bybitConnection.getActiveOrders({})).result;
        const pendingOrders: MidaOrder[] = [];

        for (const bybitOrder of bybitOrders) {
            const order = this.normalizeOrder(bybitOrder);

            if (order.status === MidaOrderStatus.PENDING) {
                pendingOrders.push(order);
            }
        }

        return pendingOrders;
    }

    public async getAssets (): Promise<string[]> {
        const assets: Set<string> = new Set();

        for (const symbol of [ ...this.#symbols.values(), ]) {
            assets.add(symbol.baseAsset);
            assets.add(symbol.quoteAsset);
        }

        return [ ...assets, ];
    }

    public override async getAsset (asset: string): Promise<MidaAsset | undefined> {
        const assets: string[] = await this.getAssets();

        if (assets.includes(asset)) {
            return new MidaAsset({ asset, tradingAccount: this, });
        }

        return undefined;
    }

    async #getAssetStatement (asset: string): Promise<MidaAssetStatement> {
        const balanceSheet: MidaAssetStatement[] = await this.getBalanceSheet();

        for (const statement of balanceSheet) {
            if (statement.asset === asset) {
                return statement;
            }
        }

        return {
            tradingAccount: this,
            date: date(),
            asset,
            freeVolume: decimal(0),
            lockedVolume: decimal(0),
            borrowedVolume: decimal(0),
        };
    }

    public override async getSymbolFundingDescriptor (symbol: string): Promise<MidaSymbolFundingDescriptor> {
        const lastBybitTick: Record<string, any> = (await this.#bybitConnection.getSymbolTicker("linear", symbol)).result.list[0];

        return {
            fundingRate: decimal(lastBybitTick.fundingRate),
            nextFundingDate: date(lastBybitTick.nextFundingTime),
        };
    }

    async #getSymbolLastTick (symbol: string): Promise<MidaTick> {
        const lastTick: MidaTick | undefined = this.#lastTicks.get(symbol);

        if (lastTick) {
            return lastTick;
        }

        const lastBybitTick: Record<string, any> = (await this.#bybitConnection.getSymbolTicker("linear", symbol)).result.list[0];

        return new MidaTick({
            date: date(),
            symbol,
            bid: decimal(lastBybitTick.bidPrice),
            ask: decimal(lastBybitTick.askPrice),
            movement: MidaTickMovement.UNKNOWN,
        });
    }

    public override async getSymbolBid (symbol: string): Promise<MidaDecimal> {
        return (await this.#getSymbolLastTick(symbol)).bid;
    }

    public override async getSymbolAsk (symbol: string): Promise<MidaDecimal> {
        return (await this.#getSymbolLastTick(symbol)).ask;
    }

    public override async getSymbolAverage (symbol: string): Promise<MidaDecimal> {
        const [ bid, ask, ] = await Promise.all([ this.getSymbolBid(symbol), this.getSymbolAsk(symbol), ]);

        return bid.add(ask).divide(2);
    }

    public override async getSymbolPeriods (symbol: string, timeframe: MidaTimeframe): Promise<MidaPeriod[]> {
        const to: MidaDate = date();
        const periods: MidaPeriod[] = [];
        const timeframeSeconds: number = MidaTimeframe.toSeconds(timeframe) ?? 60;
        const bybitPeriods: any[] = (await this.#bybitConnection.getCandles({
            category: "linear",
            symbol,
            interval: BybitFuturesUtilities.toBybitTimeframe(timeframe) as KlineIntervalV3,
            start: to.timestamp - timeframeSeconds * 1000 * 180,
            end: to.timestamp,
        })).result.list;

        // Order from oldest to newest
        bybitPeriods.sort((left, right): number => Number(left[0]) - Number(right[0]));

        for (let i = 0; i < bybitPeriods.length - 1; ++i) {
            const bybitPeriod: Record<string, any> = bybitPeriods[i];

            periods.push(new MidaPeriod({
                symbol,
                close: decimal(bybitPeriod[4]),
                high: decimal(bybitPeriod[2]),
                low: decimal(bybitPeriod[3]),
                open: decimal(bybitPeriod[1]),
                quotationPrice: MidaQuotationPrice.BID,
                startDate: date(bybitPeriod[0]),
                endDate: date(bybitPeriods[i + 1][0]),
                timeframe,
                isClosed: true,
                volume: decimal(bybitPeriod[5]),
            }));
        }

        return periods;
    }

    public override async getSymbols (): Promise<string[]> {
        return [ ...this.#symbols.keys(), ];
    }

    public override async getSymbol (symbol: string): Promise<MidaSymbol | undefined> {
        return this.#symbols.get(symbol);
    }

    public override async watchSymbolTicks (symbol: string): Promise<void> {
        if (this.#tickListeners.has(symbol)) {
            return;
        }

        this.#bybitWsConnection.subscribe(`tickers.${symbol}`);
        this.#tickListeners.set(symbol, true);
    }

    public override async watchSymbolPeriods (symbol: string, timeframe: MidaTimeframe): Promise<void> {
        const listenedTimeframes: MidaTimeframe[] = this.#periodListeners.get(symbol) ?? [];

        if (listenedTimeframes.includes(timeframe)) {
            return;
        }

        this.#bybitWsConnection.subscribe(`kline.${BybitFuturesUtilities.toBybitTimeframe(timeframe)}.${symbol}`);
        listenedTimeframes.push(timeframe);
        this.#periodListeners.set(symbol, listenedTimeframes);
    }

    public override async getOpenPositions (): Promise<BybitFuturesPosition[]> {
        const openPositions: BybitFuturesPosition[] = [];
        const bybitPositions: Record<string, any>[] = (await this.#bybitConnection
            .getPositions({ settleCoin: "USDT", })).result.list;

        for (const bybitPosition of bybitPositions) {
            openPositions.push(new BybitFuturesPosition({
                id: "",
                tradingAccount: this,
                symbol: bybitPosition.symbol,
                volume: decimal(bybitPosition.size),
                direction: bybitPosition.side === "Buy" ? MidaPositionDirection.LONG : MidaPositionDirection.SHORT,
                bybitConnection: this.#bybitConnection,
                bybitEmitter: this.#bybitEmitter,
            }));
        }

        return openPositions;
    }

    public override async isSymbolMarketOpen (symbol: string): Promise<boolean> {
        return true;
    }

    public override async getCryptoAssetDepositAddress (asset: string, net: string): Promise<string> {
        // return (await this.#bybitConnection.depositAddress({ coin: asset, network: net, })).address;
        return "";
    }

    #onTick (descriptor: Record<string, any>): void {
        const symbol: string = descriptor.symbol;
        const bid: MidaDecimal = decimal(descriptor.bid1Price);
        const ask: MidaDecimal = decimal(descriptor.ask1Price);
        const previousTick: MidaTick | undefined = this.#lastTicks.get(symbol);
        const movement: MidaTickMovement | undefined = ((): MidaTickMovement | undefined => {
            const currentBidIsEqualToPrevious: boolean = previousTick?.bid.equals(bid) ?? false;
            const currentAskIsEqualToPrevious: boolean = previousTick?.ask.equals(ask) ?? false;

            if (currentBidIsEqualToPrevious && currentAskIsEqualToPrevious) {
                return undefined;
            }

            if (currentAskIsEqualToPrevious) {
                return MidaTickMovement.BID;
            }

            if (currentBidIsEqualToPrevious) {
                return MidaTickMovement.ASK;
            }

            return MidaTickMovement.BID_ASK;
        })();

        if (!movement) {
            return;
        }

        const tick: MidaTick = new MidaTick({
            symbol,
            bid,
            ask,
            date: date(),
            movement,
        });

        this.#lastTicks.set(symbol, tick);

        if (this.#tickListeners.has(symbol)) {
            this.notifyListeners("tick", { tick, });
        }
    }

    #onPeriodUpdate (descriptor: Record<string, any>): void {
        const symbol: string = descriptor.symbol;
        const timeframe: MidaTimeframe = BybitFuturesUtilities.normalizeTimeframe(descriptor[0].interval);

        if (!(this.#periodListeners.get(symbol) ?? []).includes(timeframe)) {
            return;
        }

        const period: MidaPeriod = new MidaPeriod({
            symbol,
            close: decimal(descriptor[0].close),
            high: decimal(descriptor[0].high),
            low: decimal(descriptor[0].low),
            open: decimal(descriptor[0].open),
            quotationPrice: MidaQuotationPrice.BID,
            startDate: date(descriptor[0].start),
            endDate: date(descriptor[0].timestamp),
            timeframe,
            isClosed: descriptor[0].confirm === true,
            volume: decimal(descriptor[0].volume),
        });

        this.notifyListeners("period-update", { period, });
    }

    async #preloadSymbols (): Promise<void> {
        const bybitSymbols: Record<string, any>[] = (await this.#bybitConnection.getInstrumentInfo({
            category: "linear",
            limit: "1000",
        })).result.list;

        this.#symbols.clear();

        for (const bybitSymbol of bybitSymbols) {
            const symbol: string = bybitSymbol.symbol;

            this.#symbols.set(symbol, new MidaSymbol({
                symbol,
                baseAsset: bybitSymbol.baseCoin,
                quoteAsset: bybitSymbol.quoteCoin,
                tradingAccount: this,
                description: "",
                leverage: decimal(-1),
                lotUnits: decimal(1),
                maxLots: decimal(bybitSymbol.lotSizeFilter.maxTradingQty ?? -1),
                minLots: decimal(bybitSymbol.lotSizeFilter.minTradingQty ?? -1),
                pipPosition: -1,
                digits: Number(bybitSymbol.priceScale),
            }));
        }
    }

    public override async getSymbolTradeStatus (symbol: string): Promise<MidaSymbolTradeStatus> {
        return MidaSymbolTradeStatus.ENABLED; // TODO: TODO
    }

    public override async getDate (): Promise<MidaDate> {
        return date(await this.#bybitConnection.fetchServerTime() * 1000);
    }

    async #configureListeners (): Promise<void> {
        this.#bybitWsConnection.on("update", (descriptor: Record<string, any>): void => {
            if (descriptor.topic.indexOf("tickers") === 0) {
                this.#onTick(descriptor.data);
            }

            if (descriptor.topic.indexOf("kline") === 0) {
                descriptor.data = descriptor.data[0];
                descriptor.data.symbol = descriptor.topic.split(".").at(-1);

                this.#onPeriodUpdate(descriptor.data);
            }

            this.#bybitEmitter.notifyListeners("update", { descriptor, });
        });

        this.#bybitWsConnection.subscribe([
            "order",
            "execution",
            "position",
        ]);
    }
}
