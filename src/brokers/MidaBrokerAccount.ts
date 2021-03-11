import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbolPeriodTimeframeType } from "#periods/MidaSymbolPeriodTimeframeType";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolType } from "#symbols/MidaSymbolType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitter/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a broker account. */
export abstract class MidaBrokerAccount {
    private readonly _id: string;
    private readonly _ownerName: string;
    private readonly _type: MidaBrokerAccountType;
    private readonly _broker: MidaBroker;
    private readonly _emitter: MidaEmitter;

    protected constructor ({ id, fullName, type, broker, }: MidaBrokerAccountParameters) {
        this._id = id;
        this._ownerName = fullName;
        this._type = type;
        this._broker = broker;
        this._emitter = new MidaEmitter();
    }

    /** The account id. */
    public get id (): string {
        return this._id;
    }

    /** The account owner full name. */
    public get ownerName (): string {
        return this._ownerName;
    }

    /** The account type (demo or real). */
    public get type (): MidaBrokerAccountType {
        return this._type;
    }

    /** The account broker. */
    public get broker (): MidaBroker {
        return this._broker;
    }

    /** Used to get the ping between this client and the broker. */
    public abstract getPing (): Promise<number>;

    /** Used to get the account balance. */
    public abstract getBalance (): Promise<number>;

    /** Used to get the account equity. */
    public abstract getEquity (): Promise<number>;

    /** Used to get the account margin. */
    public abstract getMargin (): Promise<number>;

    /**
     * Used to get the account free margin.
     */
    public abstract getFreeMargin (): Promise<number>;

    /**
     * Used to get the account orders.
     * @param from Time range start.
     * @param to Time range end.
     * @returns The orders. If no time range is provided, the broker may return the most
     * recent orders (with a limit chosen by the broker).
     */
    public abstract getOrders ({ from, to,}: { from?: Date, to?: Date, }): Promise<MidaBrokerOrder[]>;

    /**
     * Used to get an order.
     * @param ticket The order ticket.
     */
    public abstract getOrder (ticket: number): Promise<MidaBrokerOrder | undefined>;

    /**
     * Used to get the net profit of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderNetProfit (ticket: number): Promise<number>;

    /**
     * Used to get the gross profit of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderGrossProfit (ticket: number): Promise<number>;

    /**
     * Used to get the swaps of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderSwaps (ticket: number): Promise<number>;

    /**
     * Used to get the commission of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderCommission (ticket: number): Promise<number>;

    /**
     * Used to place an order.
     * @param directives The order directives.
     * @returns The placed order. If the order has a market execution, then the Promise
     * will resolve after order open (open state). If the order has a limit or
     * stop execution, the Promise will resolve after order creation (pending state).
     */
    public abstract placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder>;

    /**
     * Used to cancel an order (the order must be in pending state).
     * @param ticket The order ticket.
     */
    public abstract cancelOrder (ticket: number): Promise<void>;

    /**
     * Used to close an order (the order must be in open state).
     * @param ticket The order ticket.
     */
    public abstract closeOrder (ticket: number): Promise<void>;

    /**
     * Used to set the stop loss of an order.
     * @param ticket The order ticket.
     * @param stopLoss The stop loss.
     */
    public abstract setOrderStopLoss (ticket: number, stopLoss: number): Promise<void>;

    /**
     * Used to set the take profit of an order.
     * @param ticket The order ticket.
     * @param takeProfit The take profit.
     */
    public abstract setOrderTakeProfit (ticket: number, takeProfit: number): Promise<void>;

    /**
     * Used to get the symbols operable by the account.
     */
    public abstract getSymbols (): Promise<MidaSymbol[]>;

    /**
     * Used to get a symbol by its string representation.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbol (symbol: string): Promise<MidaSymbol | undefined>;

    /**
     * Used to know if a symbol market is open.
     * @param symbol The string representation of the symbol.
     */
    public abstract isSymbolMarketOpen (symbol: string): Promise<boolean>;

    /**
     * Used to get the account currency.
     * @returns The currency ISO code.
     */
    public abstract getCurrency (): Promise<string>;

    /**
     * Used to get the most recent periods of a symbol.
     * @param symbol The string representation of the symbol.
     * @param timeframe The periods timeframe.
     * @param priceType The periods price type.
     * @returns The periods, length is decided by the broker.
     */
    public abstract getSymbolPeriods (symbol: string, timeframe: number, priceType?: MidaSymbolQuotationPriceType): Promise<MidaSymbolPeriod[]>;

    /**
     * Used to get the last tick of a symbol.
     * @param symbol The string representation of the symbol.
     * @returns The symbol last tick.
     */
    public abstract getSymbolLastTick (symbol: string): Promise<MidaSymbolTick>;

    /**
     * Used to get the account used margin.
     */
    public async getUsedMargin (): Promise<number> {
        return (await this.getMargin()) - (await this.getFreeMargin());
    }

    /**
     * Used to get the account margin level.
     * @returns The margin level or `NaN` if no margin is used.
     */
    public async getMarginLevel (): Promise<number> {
        const usedMargin: number = await this.getUsedMargin();

        if (usedMargin === 0) {
            return NaN;
        }

        return (await this.getEquity()) / usedMargin * 100;
    }

    public async getSymbolsByType (type: MidaSymbolType): Promise<MidaSymbol[]> {
        return (await this.getSymbols()).filter((symbol: MidaSymbol): boolean => symbol.type === type);
    }

    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        return this._emitter.on(type, listener);
    }

    protected notifyListeners (type: string, data?: GenericObject): void {
        this._emitter.notifyListeners(type, data);
    }
}
