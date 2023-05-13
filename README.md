<br><br>
<p align="center">
    <img src="images/logo-light.svg#gh-light-mode-only" alt="Mida" width="348px">
    <img src="images/logo-dark.svg#gh-dark-mode-only" alt="Mida" width="348px">
</p>
<br>
<p align="center">
    <b>The open-source and cross-platform trading framework</b>
    <br><br>
    <a href="https://www.mida.org">Home</a> &mdash;
    <a href="https://www.mida.org/documentation">Documentation</a> &mdash;
    <a href="https://www.mida.org/api">API</a>
</p>
<br>
<p align="center">
    <a href="https://www.npmjs.com/package/@reiryoku/mida">
        <img src="https://img.shields.io/npm/v/@reiryoku/mida" alt="">
    </a>
    <a href="./LICENSE">
        <img src="https://img.shields.io/npm/l/@reiryoku/mida" alt="">
    </a>
    <a href="https://discord.gg/cKyWTUsr3q">
        <img src="https://img.shields.io/discord/780532638846287904?label=community" alt="">
    </a>
</p>
<br><br>

## Table of Contents
* [Introduction](#introduction)
    * [Languages](#languages)
    * [Platforms](#platforms)
    * [Community](#community)
* [Installation](#installation)
* [Usage](#usage)
    * [Account login](#account-login)
    * [Balance, equity and margin](#balance-equity-and-margin)
    * [Orders, trades and positions](#orders-trades-and-positions)
    * [Decimals](#decimals)
    * [Symbols and assets](#symbols-and-assets)
    * [Ticks and candlesticks](#ticks-and-candlesticks)
    * [Market components](#market-components)
    * [Trading systems](#trading-systems)
    * [Paper trading and backtesting](#paper-trading-and-backtesting)
    * [Technical indicators](#technical-indicators)
* [License and disclaimer](#license-and-disclaimer)
* [Contributors](#contributors)

## Introduction
Mida is an open-source and cross-platform trading framework developed by Reiryoku Technologies and its contributors.
Designed from the ground up to provide a solid, versatile and platform-neutral
environment for creating algorithmic trading systems, indicators, market analysis tools or just trading
applications depending on use cases.

### Languages
Mida can be used with TypeScript and JavaScript on [Node.js](https://nodejs.org) and
can be additionally enhanced through C++ or [AssemblyScript](https://www.assemblyscript.org) modules for near-native performance.

### Platforms
Mida is platform-neutral, this means that any trading platform could
be easily integrated in the ecosystem. Applications built with Mida can be
easily executed on different trading platforms.

<br><br>
<p align="center">
    <img src="images/platforms-light.svg#gh-light-mode-only" width="582px">
    <img src="images/platforms-dark.svg#gh-dark-mode-only" width="582px">
</p>
<br><br>

### Community
Join the community on [Discord](https://discord.gg/cKyWTUsr3q) and [Telegram](https://t.me/joinmida)
to get help you with your first steps.

## Installation
Mida is distributed on [npm](https://www.npmjs.com).
```bash
npm install @reiryoku/mida
```

## Usage
### Account login
How to login into a Binance Spot account.
```javascript
import { login, } from "@reiryoku/mida";

const myAccount = await login("Binance/Spot", {
    apiKey: "***",
    apiSecret: "***",
});
```
Read [how to use Mida with Binance](https://www.mida.org/posts/how-to-use-mida-with-binance/) to
get your `apiKey` and `apiSecret` credentials.

How to login into a Bybit Futures account.
```javascript
import { login, } from "@reiryoku/mida";

const myAccount = await login("Bybit/Futures", {
    apiKey: "***",
    apiSecret: "***",
});
```
Read [how to use Mida with Bybit](https://www.mida.org/posts/how-to-use-mida-with-bybit/) to
get your `apiKey` and `apiSecret` credentials.

How to login into a cTrader account.
```javascript
import { login, } from "@reiryoku/mida";

const myAccount = await login("cTrader", {
    clientId: "***",
    clientSecret: "***",
    accessToken: "***",
    accountId: "***",
});
```
Read [how to use Mida with cTrader](https://www.mida.org/posts/how-to-use-mida-with-ctrader/) to
get your `clientId`, `clientSecret`, `accessToken` and `accountId` credentials.

How to login into multiple accounts.
```javascript
import { login, } from "@reiryoku/mida";

const myAccount1 = await login("Binance/Spot", { /* ... */ });
const myAccount2 = await login("Bybit/Futures", { /* ... */ });
const myAccount3 = await login("cTrader", { /* ... */ });
```

### Balance, equity and margin
How to get the account balance, equity and margin.
```javascript
import { log, } from "@reiryoku/mida";

log(await myAccount.getBalance());
log(await myAccount.getEquity());
log(await myAccount.getFreeMargin());
log(await myAccount.getUsedMargin());
```

### Orders, trades and positions
How top open a long position for BTC/USDT.
```javascript
import { log, MidaOrderDirection, } from "@reiryoku/mida";

const myOrder = await myAccount.placeOrder({
    symbol: "BTCUSDT",
    direction: MidaOrderDirection.BUY,
    volume: 1,
});

log(myOrder.id);
log(myOrder.executionPrice);
log(myOrder.filledVolume);
log(myOrder.trades);

const myPosition = await order.getPosition();

log(myPosition);
```

How to open a short position for EUR/USD.
```javascript
import { log, MidaOrderDirection, } from "@reiryoku/mida";

const myOrder = await myAccount.placeOrder({
    symbol: "EURUSD",
    direction: MidaOrderDirection.SELL,
    volume: 0.1,
});

log(myOrder.id);
log(myOrder.executionPrice);
log(myOrder.filledVolume);
log(myOrder.trades);

const myPosition = await order.getPosition();

log(myPosition);
```

How to open a long position for ETH/USDT with error handler.
```javascript
import {
    log,
    MidaOrderDirection,
    MidaOrderRejection,
} from "@reiryoku/mida";

const myOrder = await myAccount.placeOrder({
    symbol: "ETHUSDT",
    direction: MidaOrderDirection.BUY,
    volume: 888,
});

if (myOrder.isRejected) {
    switch (myOrder.rejection) {
        case MidaOrderRejection.MARKET_CLOSED: {
            log("The market is closed!");

            break;
        }
        case MidaOrderRejection.NOT_ENOUGH_MONEY: {
            log("You don't have enough money in your account!");

            break;
        }
        case MidaOrderRejection.INVALID_SYMBOL: {
            log("Your account doesn't support trading Ethereum!");

            break;
        }
    }
}
```

<details>
<summary>More examples</summary>

How to open a long position for GBP/USD with stop loss and take profit.
```javascript
import { MidaOrderDirection, } from "@reiryoku/mida";

const symbol = "GBPUSD";
const lastBid = await myAccount.getSymbolBid(symbol);
const myOrder = await myAccount.placeOrder({
    symbol,
    direction: MidaOrderDirection.BUY,
    volume: 0.1,
    protection: {
        stopLoss: lastBid.subtract(0.0010), // <= SL 10 pips
        takeProfit: lastBid.add(0.0030), // <= TP 30 pips
    },
});
```

How to close an open position.
```javascript
import {
    MidaOrderDirection,
    MidaPositionDirection,
} from "@reiryoku/mida";

await myPosition.close();
// or
await myPosition.subtractVolume(myPosition.volume);
// or
await myAccount.placeOrder({
    positionId: myPosition.id,
    direction: myPosition.direction === MidaPositionDirection.LONG ? MidaOrderDirection.SELL : MidaOrderDirection.BUY,
    volume: myPosition.volume,
});
```

How to retrieve all pending orders and open positions.
```javascript
import { log, } from "@reiryoku/mida";

log(await myAccount.getPendingOrders());
log(await myAccount.getOpenPositions());
```

How to set/change take profit and stop loss for an open position.
```javascript
await myPosition.changeProtection({
    takeProfit: 200,
    stopLoss: 100,
});
```

</details>

### Decimals
Computers can only natively store integers, so they need some way of representing
decimal numbers. This representation is not perfectly accurate. This is why, in
most programming languages `0.1 + 0.2 != 0.3`, for financial and monetary calculations
this can lead to unreversible losses.<br>
In Mida, decimal numbers and calculations are accurately represented by the `MidaDecimal` API.

```javascript
import { decimal, } from "@reiryoku/mida";

// BAD (native behaviour)
0.1 + 0.2; // 0.30000000000000004

// GOOD (with Mida decimals)
decimal(0.1).add(0.2); // 0.3

// GOOD (with Mida decimals)
decimal("0.1").add("0.2"); // 0.3
```

In Mida, every calculation under the hood is made using decimals and every native number
passed to Mida is internally converted to decimal, input values in the Mida APIs
such as a limit price are usually expressed as a `MidaDecimalConvertible` which is an alias
for `MidaDecimal | string | number`, the input values are internally converted to `MidaDecimal`
and most Mida interfaces exposes decimal numbers unless otherwise stated.

Read more about the [Decimals API](https://www.mida.org/documentation/essentials/decimals.html).

### Symbols and assets
How to retrieve all symbols available for your trading account.
```javascript
import { log, } from "@reiryoku/mida";

const symbols = await myAccount.getSymbols();

log(symbols);
```

How to retrieve a complete symbol.
```javascript
import { log, } from "@reiryoku/mida";

const symbol = await myAccount.getSymbol("#AAPL");

if (!symbol) {
    log("Apple stocks are not available for this account!");
}
else {
    log(symbol.baseAsset);
    log(symbol.quoteAsset);
    log(symbol.digits);
    log(symbol.minLots); // Minimum volume for an order
    log(symbol.maxLots); // Maximum volume for an order
    log(await symbol.isMarketOpen());
}
```

How to get the price of a symbol.
```javascript
import { log, } from "@reiryoku/mida";

const symbol = await myAccount.getSymbol("BTCUSDT");

const price = await symbol.getBid();
// or
const price = await myAccount.getSymbolBid("BTCUSDT");

log(`Bitcoin price is ${price} USDT`);
```

### Ticks and candlesticks
How to listen the real-time ticks of a symbol.
```javascript
import { log, marketWatcher, } from "@reiryoku/mida";

const watcher = await marketWatcher({ tradingAccount: myAccount, });

await watcher.watch("BTCUSDT", { watchTicks: true, });

watcher.on("tick", (event) => {
    const { tick, } = event.descriptor;

    log(`Bitcoin price is now ${tick.bid} USDT`);
});
```

How to listen the real-time candlesticks of a symbol (when the last live candlesticks are updated/closed).
```javascript
import {
    log,
    marketWatcher,
    MidaTimeframe,
} from "@reiryoku/mida";

const watcher = await marketWatcher({ tradingAccount: myAccount, });

await watcher.watch("BTCUSDT", {
    watchPeriods: true,
    timeframes: [
        MidaTimeframe.M5,
        MidaTimeframe.H1,
    ],
});

watcher.on("period-update", (event) => {
    const { period, } = event.descriptor;

    switch (period.timeframe) {
        case MidaTimeframe.M5: {
            log("Last live M5 candlestick updated");

            break;
        }
        case MidaTimeframe.H1: {
            log("Last live M5 candlestick updated");

            break;
        }
    }
});

watcher.on("period-close", (event) => {
    const { period, } = event.descriptor;

    switch (period.timeframe) {
        case MidaTimeframe.M5: {
            log(`M5 candlestick closed at ${period.close}`);

            break;
        }
        case MidaTimeframe.H1: {
            log(`H1 candlestick closed at ${period.close}`);

            break;
        }
    }
});
```

How to get the historical closed candlesticks of a symbol (in Mida, candlesticks and bars are generically called periods).
```javascript
import { log, MidaTimeframe, } from "@reiryoku/mida";

const periods = await myAccount.getSymbolPeriods("EURUSD", MidaTimeframe.M30);
const lastPeriod = periods[periods.length - 1];

log("Last candlestick start time: " + lastPeriod.startTime);
log("Last candlestick OHLC: " + lastPeriod.ohlc);
log("Last candlestick close price: " + lastPeriod.close);
```

In Mida, the `on()` method returns an id which can be used later to unsubscribe from the event listener.
```javascript
const id = watcher.on("period-close", (event) => { /* ... */ });

watcher.removeEventListener(id);
```

### Market components
A market component is way to encapsulate logic and data reactively evolving
as the underlying market changes. Market components can be used to easily
create trading systems and independent market analysis logic.

How to create a market component detecting overbought markets
```javascript
import { marketComponent, } from "@reiryoku/mida";

// A reactive component detecting overbought markets
const OverboughtDetector = marketComponent({
    indicators: {
        myIndicator: {
            type: "RSI",
            options: { length: 14, },
            input: {
                timeframe: MidaTimeframe.M30, // Use M30 candles
                type: "close", // Use close prices
            },
        },
    },

    computed: {
        // A variable calculated every market update
        isOverbought () {
            return this.myIndicator.lastValue.greaterThan(80);
        },
    },

    // Invoked every market update
    update () {
        console.log(this.isOverbought);
    },
});
```

How to execute a market component
```javascript
const overboughtDetector = await OverboughtDetector(myAccount, "ETHUSD");
```

How to create a simple ticker
```javascript
import { marketComponent, } from "@reiryoku/mida";

// A component logging the market prices
const Ticker = marketComponent({
    computed: {
        spread () {
            return this.$ask.subtract(this.$bid);
        },
    },

    update () {
        console.log(`Market price has changed for symbol ${this.$symbol}`);

        console.log(`Bid price is ${this.$bid}`);
        console.log(`Ask price is ${this.$ask}`);

        console.log(`The spread is ${this.spread}`);
    },
});
```

The `this` of a market component assumes the state of the component defined by data, computed, indicators and methods,
plus some builtin variables (prefixed by `$`) such as the current bid and tick prices of the underlying market.
```typescript
type MidaMarketComponentState = Record<string, any> & {
    $component: MidaMarketComponent;
    $dependencies: MidaMarketComponentState[];
    $tradingAccount: MidaTradingAccount;
    $watcher: MidaMarketWatcherDirectives;
    $symbol: string;
    $completeSymbol: MidaSymbol;
    $bid: MidaDecimal;
    $ask: MidaDecimal;
    $ticks: MidaTick[];
    $periods: Record<string, MidaPeriod[]>;
    $livePeriods: Record<string, MidaPeriod>;
    $indicators: Record<string, any>;
};
```

### Market component hooks
The update() hook represents any market change such as a market tick, a candle being closed or simply the market being closed or opened.
This means that every market event has its own hook.
```javascript
import { marketComponent, } from "@reiryoku/mida";

const Component = marketComponent({
    async tick () {
        // Invoked when there is a market tick
    },

    async periodUpdate (period) {
        // Invoked when a last live candlestick is updated
    },

    async periodClose (period) {
        // Invoked when a candlestick is closed
    },

    // Furthermore, specific timeframes can be targeted
    async m15PeriodClose (period) {
        // Invoked when a M15 candlestick is closed
    },

    async marketOpen () {
        // Invoked when the market opens
    },

    async update () {
        // Invoked when there is any market update: a tick, a candle close, a market open/close...
    },
});
```

### Trading systems
How to create a trading system (expert advisor or trading bot).
```javascript
import {
    log,
    MidaTradingSystem,
    MidaTimeframe,
} from "@reiryoku/mida";

class SuperTradingSystem extends MidaTradingSystem {
    watched () {
        return {
            "BTCUSDT": {
                watchTicks: true,
                watchPeriods: true,
                timeframes: [ MidaTimeframe.H1, ],
            },
        };
    }

    async configure () {
        // Called once per instance before the first startup
        // can be used as async constructor
    }

    async onStart () {
        log("The trading system has started...");
    }

    async onTick (tick) {
        // Implement your strategy
    }

    async onPeriodClose (period) {
        log(`H1 candlestick closed at ${period.open}`);
    }

    async onStop () {
        log("The trading system has been interrupted...");
    }
}
```

How to execute a trading system.
```javascript
import { login, } from "@reiryoku/mida";
import { SuperTradingSystem, } from "./SuperTradingSystem";

const myAccount = await login(/* ... */);
const mySystem = new SuperTradingSystem({ tradingAccount: myAccount, });

await mySystem.start();
```

Trading systems are used under the hood to regulate and execute market components.
It's recommended to use the Market Component API over the Trading System API as it
allows to quickly develop and maintain an idea in a declarative way.

### Paper trading and backtesting
Mida comes with an out of the box simulator of exchanges and spot trading accounts,
for paper trading and backtesting read [Paper Trading with Mida](https://www.mida.org/posts/paper-trading-with-mida/).

### Technical indicators
Mida comes with builtin indicators written in C for native performance.
Additionally, new indicators can be created.

How to calculate SMA (Simple Moving Average).
```javascript
import { log, Mida, MidaTimeframe, } from "@reiryoku/mida";

// Get latest candlesticks on H1 timeframe
const candlesticks = await myAccount.getSymbolPeriods("EURUSD", MidaTimeframe.H1);
const closePrices = candlesticks.map((candlestick) => candlestick.close);

// Calculate RSI on close prices, pass values from oldest to newest
const sma = await Mida.createIndicator("SMA").calculate(closePrices);

// Values are from oldest to newest
log(sma);
```

How to calculate RSI (Relative Strength Index).
```javascript
import { log, Mida, MidaTimeframe, } from "@reiryoku/mida";

// Get latest candlesticks on H1 timeframe
const candlesticks = await myAccount.getSymbolPeriods("BTCUSDT", MidaTimeframe.H1);
const closePrices = candlesticks.map((candlestick) => candlestick.close);

// Calculate RSI on close prices, pass values from oldest to newest
const rsi = await Mida.createIndicator("RSI", { period: 14, }).calculate(closePrices);

// Values are from oldest to newest
log(rsi);
```

## License and disclaimer
[LICENSE](./LICENSE)<br><br>
Trading in financial markets is highly speculative and carries a high level of risk.
It's possible to lose all your capital. This project may not be suitable for everyone,
you should ensure that you understand the risks involved. Mida, Reiryoku Technologies and
its contributors are not responsible for any technical inconvenience that
may lead to money loss, for example a stop loss not being set.

## Contributors
| Name or Username | Contribution           | GitHub                                                | Contact                   |
|------------------|------------------------|-------------------------------------------------------|---------------------------|
| Vasile Pește     | Founder and maintainer | [Vasile-Peste](https://github.com/Vasile-Peste)       | vasile.peste@reiryoku.com |
| dbvcode          | Collaborator           | [dbvcode](https://github.com/dbvcode)                 | /                         |
| Karsten Jakobsen | Collaborator           | [karstenjakobsen](https://github.com/karstenjakobsen) | /                         |
| JoeGuest         | Collaborator           | [JoeGuest](https://github.com/JoeGuest)               | /                         |
| Yannick Jemmely  | Collaborator           | [yannickjemmely](https://github.com/yannickjemmely)   | /                         |
