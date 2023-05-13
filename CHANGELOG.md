### Features
* Align market watcher documentation with the actual API [#112](https://github.com/Reiryoku-Technologies/Mida/pull/112)

### Bug fixes
* Bybit | Fix a bug where period updates were returning periods with undefined data [#111](https://github.com/Reiryoku-Technologies/Mida/pull/111)

2023.2.0 - 04-05-2023
===================
### Features
* Core | Define `clientOrderId` in Orders API [#107](https://github.com/Reiryoku-Technologies/Mida/pull/107) | [#102](https://github.com/Reiryoku-Technologies/Mida/issues/102)
* Binance | Integrate `clientOrderId` [#107](https://github.com/Reiryoku-Technologies/Mida/pull/107) | [#102](https://github.com/Reiryoku-Technologies/Mida/issues/102)
* Bybit | Integrate `clientOrderId` [#107](https://github.com/Reiryoku-Technologies/Mida/pull/107) | [#102](https://github.com/Reiryoku-Technologies/Mida/issues/102)
* cTrader | Integrate `clientOrderId` [#107](https://github.com/Reiryoku-Technologies/Mida/pull/107) | [#102](https://github.com/Reiryoku-Technologies/Mida/issues/102)
* Core | Enforce all events order from most specific to most generic (m15PeriodUpdate -> periodUpdate -> update) [#104](https://github.com/Reiryoku-Technologies/Mida/pull/104)
* cTrader | Add `requestedProtection` to orders [#103](https://github.com/Reiryoku-Technologies/Mida/pull/103)
* Core | Add `requestedProtection` to `MidaOrder` for accessing an order's stop loss, take profit and trailing stop loss [#103](https://github.com/Reiryoku-Technologies/Mida/pull/103)

### Bug fixes
* Core | Fix a bug where indicators values in market components could result empty during relevant execution times [#104](https://github.com/Reiryoku-Technologies/Mida/pull/104)

2023.1.2 - 13-03-2023
===================
### Bug fixes
* cTrader | Convert requests timestamps to milliseconds where required [#98](https://github.com/Reiryoku-Technologies/Mida/pull/98) | [#97](https://github.com/Reiryoku-Technologies/Mida/issues/97)

2023.1.1 - 10-03-2023
===================
### Bug fixes
* cTrader | Correctly set `ProtoOAGetTrendbarsReq` timestamps to milliseconds [#96](https://github.com/Reiryoku-Technologies/Mida/pull/96)

2023.1.0 - 03-03-2023
===================
### Features
* **_BREAKING_** Unify plugins [#87](https://github.com/Reiryoku-Technologies/Mida/pull/87)
* **_BREAKING_** Remove deprecated onImpactPosition hook from `MidaTradingSystem`, change syntax to target timeframes in market components [#86](https://github.com/Reiryoku-Technologies/Mida/pull/86)
* **_BREAKING_** Add mandatory `endDate` parameter to `MidaPeriod`, represents timeframes as strings [#85](https://github.com/Reiryoku-Technologies/Mida/pull/85)
* **_BREAKING_** Add `toFixed()` method and optional `digits` parameter to `MidaDecimal`, add mandatory `digits` parameter to `MidaSymbol`, add `$completeSymbol` to `MidaMarketComponentState` [#84](https://github.com/Reiryoku-Technologies/Mida/pull/84)
* **_BREAKING_** Remove deprecated MidaExpertAdvisor API in favor of MidaTradingSystem, add params to market components [#82](https://github.com/Reiryoku-Technologies/Mida/pull/82)
* **_BREAKING_** Use internal logger, remove API for default user logger, add options to market components [#81](https://github.com/Reiryoku-Technologies/Mida/pull/81)
* Market Components API [#79](https://github.com/Reiryoku-Technologies/Mida/pull/79)

2022.5.0 - 06-12-2022
===================
### Features
* Create and expose the Playground API, used for paper trading and backtesting [#71](https://github.com/Reiryoku-Technologies/Mida/pull/71)
* Expose `withdrawCrypto()` interface [#73](https://github.com/Reiryoku-Technologies/Mida/pull/73)

### Bug fixes
* Don't convert undefined protection values to decimal [#77](https://github.com/Reiryoku-Technologies/Mida/pull/77)

2022.4.0 - 16-08-2022
===================
### Features
* Emit `period-close` by checking if the candlestick emitted by `period-update` is closed [#68](https://github.com/Reiryoku-Technologies/Mida/pull/68)

### Bug fixes
* Read the trading system market watcher configuration from the correct object, emit the `period-update` event when using the builtin period detector in `MidaMarketWatcher` [#69](https://github.com/Reiryoku-Technologies/Mida/pull/69)
* Activate the trading system market watcher after the `onStart()` hook is executed [#68](https://github.com/Reiryoku-Technologies/Mida/pull/68)

2022.3.0 - 12-08-2022
===================
### Features
* Add native `period-close` event usage to market watcher, allow to optionally use the builtin period close detector [#67](https://github.com/Reiryoku-Technologies/Mida/pull/67)
* Expose the queue API [#66](https://github.com/Reiryoku-Technologies/Mida/pull/66)

2022.2.0 - 04-08-2022
===================
### Features
* Create symbol states for trading systems [#61](https://github.com/Reiryoku-Technologies/Mida/pull/61)
* Add `label` field to `MidaOrder` to represent the label indicated in the order directives [#63](https://github.com/Reiryoku-Technologies/Mida/pull/63) | [#36](https://github.com/Reiryoku-Technologies/Mida/issues/36)
* Add `clear()` method to `MidaIndicator` to clear the internal state of the indicator [#62](https://github.com/Reiryoku-Technologies/Mida/pull/62)
* Update documentation [#56](https://github.com/Reiryoku-Technologies/Mida/pull/56)
* Add `toNumber()` method to `MidaDecimal` to get the decimal as `number` [#55](https://github.com/Reiryoku-Technologies/Mida/pull/55) | [#54](https://github.com/Reiryoku-Technologies/Mida/issues/54)

### Bug fixes
* Correctly calculate minimum and maximum values on `MidaDecimal.min()` and `MidaDecimal.max()` [#64](https://github.com/Reiryoku-Technologies/Mida/pull/64) | [#57](https://github.com/Reiryoku-Technologies/Mida/issues/57)
* Fix error thrown by the `onImpactPosition()` trading system hook [#60](https://github.com/Reiryoku-Technologies/Mida/pull/60)

2022.1.0 - 23-07-2022
===================
### Features
* **_BREAKING_** General refactor and improvements
* **_BREAKING_** Add period update event and update various interfaces [#51](https://github.com/Reiryoku-Technologies/Mida/pull/51)
* **_BREAKING_** Add `MidaDecimal` API for representing and handling operations with decimals, use decimals instead of numbers [#50](https://github.com/Reiryoku-Technologies/Mida/pull/50)
* Add platform related and label order directives [#49](https://github.com/Reiryoku-Technologies/Mida/pull/49)

7.3.0 - 05-07-2022
===================
### Features
* Create `getDate()` interface for trading platforms [#47](https://github.com/Reiryoku-Technologies/Mida/pull/47)
* Add logs and update dependencies [#43](https://github.com/Reiryoku-Technologies/Mida/pull/43)

### Bug fixes
* Wait for the `onTick` hook call to resolve before calling the next one [#44](https://github.com/Reiryoku-Technologies/Mida/pull/44)

7.2.0 - 15-06-2022
===================
### Features
* Create interface for getting the order impacted position [#35](https://github.com/Reiryoku-Technologies/Mida/pull/35)

7.1.0 - 12-06-2022
===================
### Features
* Update eslint dependency and cleanup codebase [#31](https://github.com/Reiryoku-Technologies/Mida/pull/31)

7.0.0 - 14-05-2022
===================
### Features
* **_BREAKING_** Refactor part of APIs names to reflect platform-neutrality [#22](https://github.com/Reiryoku-Technologies/Mida/pull/22)

6.0.0 - 23-04-2022
===================
### Features
* Update documentation according to latest API including plugins [#17](https://github.com/Reiryoku-Technologies/Mida/pull/17)
* Create and expose logging API [#18](https://github.com/Reiryoku-Technologies/Mida/pull/18)
* **_BREAKING_** Don't expose logger instance, remove `new` static method from `MidaIndicator` [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)
* Update documentation, add showcase of supported brokers [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)
* Reduce requests sent by `MarketWatcher` to the necessary [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)
* **_BREAKING_** Remove `modifyDirectives` method from `MarketWatcher` (use `watch`) [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)
* Add `watchTicks`, `watchPeriods` and `unwatch` protected methods to `MidaExpertAdvisor` [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)

5.0.1 - 31-03-2022
===================
### Bug fixes
* Plugins ids are reintroduced [#16](https://github.com/Reiryoku-Technologies/Mida/pull/16)

5.0.0 - 30-03-2022
===================
### Features
* Update documentation [#12](https://github.com/Reiryoku-Technologies/Mida/pull/12)
* **_BREAKING_** Generic codebase changes and improvements [#13](https://github.com/Reiryoku-Technologies/Mida/pull/13)
* Create position protection change types [#14](https://github.com/Reiryoku-Technologies/Mida/pull/14)
* Create indicators API [#15](https://github.com/Reiryoku-Technologies/Mida/pull/15)

### Bug fixes
* Correctly update position protection when `onProtectionChange` is called [#11](https://github.com/Reiryoku-Technologies/Mida/pull/11)

4.0.0 - 27-02-2022
===================
### Features
* Update documentation ([#6](https://github.com/Reiryoku-Technologies/Mida/pull/6))
* **_BREAKING_** Add assets to symbols, creating a symbol now requires passing the base asset and quote asset, creating an asset no longer requires passing an id ([#5](https://github.com/Reiryoku-Technologies/Mida/pull/5))
* **_BREAKING_** Remove `openPosition` method from broker accounts (use directly `placeOrder`), rename `MidaSymbolPrice` to `MidaSymbolPriceType`, add general improvements ([#7](https://github.com/Reiryoku-Technologies/Mida/pull/7))
* **_BREAKING_** Rename various interfaces, add generic improvements and comments for documentation ([#8](https://github.com/Reiryoku-Technologies/Mida/pull/8))

3.1.0 - 23-01-2022
===================
### Features
* Expose "period-close" event and `getSymbolDirectives` method in `MidaMarketWatcher` ([#3](https://github.com/Reiryoku-Technologies/Mida/pull/3)).

### Bug fixes
* Remove import of `util` module which may throw errors on certain webpack configurations ([#4](https://github.com/Reiryoku-Technologies/Mida/pull/4)).

3.0.0 - 20-01-2022
===================
* **Refactor entire project, introduce orders, deals and positions.**
* Create "MidaTimeframe" API for handling common timeframes.
* Create "MidaDate" API for representing UTC dates.
* Create async event emitter.
* Increment tsconfig.json target to es2020.
* Remove the "getRequiredMargin" method from symbols.
* Remove the "MidaBrowser" and "MidaBrowserTab" APIs.
* Refactor codebase and update to the latest TypeScript version.
* Improve README.md documentation.

2.0.0 - 28-05-2021
===================
* Create "removeEventListener" method for broker accounts and broker orders.
* Create new logo.
* Now the broker accounts "getSymbolLastTick" method can return undefined.
* Create "getSymbolBid" and "getSymbolAsk" methods for broker accounts.
* Create "tick" event for broker orders.
* Create "initiator" field for broker orders.
* Extend error types enumeration.
* Create "tryLogin" method for brokers.
* Create "canPlaceOrder" method for broker accounts, to check if the place order obstacles are equal to zero.
* Create "getPlaceOrderObstacles" method for broker accounts, to get the possible list of errors when placing an order (for example market closed).
* Create error types enumeration.
* Create "tryPlaceOrder" method for broker accounts.
* Create "openOrders" property for expert advisors.
* Create "setViewport" method for browser tabs.
* Plugins installations are now based on ids.
* Remove right click method from browser tabs and create options object in the click method.
* Return string symbols instead of objects when requesting the account symbols.
* Remove export of spread type.
* Remove spread type property from symbols.
* Expose puppeteer page instance in browser tab.
* Define monthly timeframe type.
* Create "rightClick" method for browser tabs.
* Create "evaluateOnNewDocument" method for browser tabs.

1.0.0 - 09-05-2021
===================
