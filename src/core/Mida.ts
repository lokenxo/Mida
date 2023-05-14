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

import { MidaTradingAccount, } from "#accounts/MidaTradingAccount";
import { MidaIndicator, } from "#indicators/MidaIndicator";
import { logger, MidaLogger, } from "#loggers/MidaLogger";
import { MidaTradingPlatform, } from "#platforms/MidaTradingPlatform";
import { MidaPlugin, } from "#plugins/MidaPlugin";
import { baseActions, } from "#plugins/MidaPluginActions";

class Mida {
    private constructor () {
        // Silence is golden
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedPlugins: Map<string, MidaPlugin> = new Map();

    public static get version (): string {
        return "2023.3.0";
    }

    public static get logger (): MidaLogger {
        return logger;
    }

    public static get installedPlugins (): MidaPlugin[] {
        return [ ...Mida.#installedPlugins.values(), ];
    }

    public static use (plugin: MidaPlugin, params?: Record<string, any>): void {
        const pluginId: string = plugin.id;
        const pluginName: string = plugin.name;

        if (!pluginId) {
            logger.warn("Plugin | The plugin is not valid");

            return;
        }

        if (Mida.pluginIsInstalled(pluginId)) {
            logger.warn(`Plugin | Plugin ${pluginName}:${pluginId} is already installed`);

            return;
        }

        logger.debug(`Plugin | Installing plugin ${pluginName}:${pluginId}...`);

        plugin.install(baseActions, params);
        Mida.#installedPlugins.set(pluginId, plugin);

        logger.debug(`Plugin | Plugin ${pluginName}:${pluginId} installed`);
        logger.info(`Plugin | Using ${pluginName} ${plugin.version}`);
    }

    public static pluginIsInstalled (id: string): boolean {
        return Mida.#installedPlugins.has(id);
    }

    public static async login (id: string, parameters: Record<string, any>): Promise<MidaTradingAccount> {
        return MidaTradingPlatform.login(id, parameters);
    }

    public static createIndicator (id: string, parameters: Record<string, any>): MidaIndicator {
        return MidaIndicator.create(id, parameters);
    }
}

const { login, createIndicator, } = Mida;

// <public-api>
export { Mida, };
export { login, createIndicator, };

export { MidaTradingAccount, } from "#accounts/MidaTradingAccount";
export { MidaTradingAccountOperativity, } from "#accounts/MidaTradingAccountOperativity";
export { MidaTradingAccountParameters, } from "#accounts/MidaTradingAccountParameters";
export { MidaTradingAccountPositionAccounting, } from "#accounts/MidaTradingAccountPositionAccounting";

export { MidaAsset, } from "#assets/MidaAsset";
export { MidaAssetParameters, } from "#assets/MidaAssetParameters";
export { MidaAssetStatement, } from "#assets/MidaAssetStatement";

export { marketComponent, MidaMarketComponent, } from "#components/MidaMarketComponent";
export { MidaMarketComponentConstructor, } from "#components/MidaMarketComponentConstructor";
export { MidaMarketComponentDependencyDeclaration, } from "#components/MidaMarketComponentDependencyDeclaration";
export { MidaMarketComponentIndicatorDeclaration, } from "#components/MidaMarketComponentIndicatorDeclaration";
export {
    makeComponent,
    makeComponentState,
    MidaMarketComponentMakerParameters,
} from "#components/MidaMarketComponentMaker";
export { MidaMarketComponentOracle, } from "#components/MidaMarketComponentOracle";
export { MidaMarketComponentParameterDeclaration, } from "#components/MidaMarketComponentParameterDeclaration";
export { MidaMarketComponentState, } from "#components/MidaMarketComponentState";

export { date, MidaDate, } from "#dates/MidaDate";
export { MidaDateConvertible, } from "#dates/MidaDateConvertible";
export { utcTimestamp, } from "#dates/MidaDateUtilities";

export { decimal, MidaDecimal, } from "#decimals/MidaDecimal";
export { MidaDecimalConvertible, } from "#decimals/MidaDecimalConvertible";

export { MidaError, } from "#errors/MidaError";
export { MidaErrorParameters, } from "#errors/MidaErrorParameters";
export {
    unsupportedOperationError,
} from "#errors/MidaErrorUtilities";

export { MidaEvent, } from "#events/MidaEvent";
export { MidaEventListener, } from "#events/MidaEventListener";
export { MidaEventListenerAsync, } from "#events/MidaEventListenerAsync";
export { MidaEventParameters, } from "#events/MidaEventParameters";

export { MidaIndicator, } from "#indicators/MidaIndicator";
export { MidaIndicatorIo, } from "#indicators/MidaIndicatorIo";
export { MidaIndicatorParameters, } from "#indicators/MidaIndicatorParameters";

export { MidaLog, } from "#loggers/MidaLog";
export { MidaLogger, } from "#loggers/MidaLogger";
export { log, } from "#loggers/MidaLoggerUtilities";
export { MidaLogNamespace, } from "#loggers/MidaLogNamespace";
export { MidaLogParameters, } from "#loggers/MidaLogParameters";

export { MidaOrder, } from "#orders/MidaOrder";
export { MidaOrderDirection, } from "#orders/MidaOrderDirection";
export { MidaOrderDirectives, } from "#orders/MidaOrderDirectives";
export { MidaOrderExecutionType, } from "#orders/MidaOrderExecutionType";
export { MidaOrderFillType, } from "#orders/MidaOrderFillType";
export { MidaOrderParameters, } from "#orders/MidaOrderParameters";
export { MidaOrderPurpose, } from "#orders/MidaOrderPurpose";
export { MidaOrderRejection, } from "#orders/MidaOrderRejection";
export { MidaOrderStatus, } from "#orders/MidaOrderStatus";
export { MidaOrderTimeInForce, } from "#orders/MidaOrderTimeInForce";

export { composePeriods, MidaPeriod, } from "#periods/MidaPeriod";
export { MidaPeriodParameters, } from "#periods/MidaPeriodParameters";

export { MidaTradingPlatform, } from "#platforms/MidaTradingPlatform";
export { MidaTradingPlatformParameters, } from "#platforms/MidaTradingPlatformParameters";

export { MidaPlugin, } from "#plugins/MidaPlugin";
export { MidaPluginActions, } from "#plugins/MidaPluginActions";
export { MidaPluginParameters, } from "#plugins/MidaPluginParameters";

export { MidaPosition, } from "#positions/MidaPosition";
export { MidaPositionDirection, } from "#positions/MidaPositionDirection";
export { MidaPositionParameters, } from "#positions/MidaPositionParameters";
export { MidaPositionStatus, } from "#positions/MidaPositionStatus";

export { MidaProtection, } from "#protections/MidaProtection";
export { MidaProtectionChange, } from "#protections/MidaProtectionChange";
export { MidaProtectionChangeRejection, } from "#protections/MidaProtectionChangeRejection";
export { MidaProtectionChangeStatus, } from "#protections/MidaProtectionChangeStatus";
export { MidaProtectionDirectives, } from "#protections/MidaProtectionDirectives";

export { MidaQueue, } from "#queues/MidaQueue";
export { MidaQueueParameters, } from "#queues/MidaQueueParameters";
export { MidaQueueWorker, } from "#queues/MidaQueueWorker";

export { MidaQuotation, } from "#quotations/MidaQuotation";
export { MidaQuotationParameters, } from "#quotations/MidaQuotationParameters";
export { MidaQuotationPrice, } from "#quotations/MidaQuotationPrice";

export { MidaSymbol, } from "#symbols/MidaSymbol";
export { MidaSymbolParameters, } from "#symbols/MidaSymbolParameters";
export { MidaSymbolTradeStatus, } from "#symbols/MidaSymbolTradeStatus";

export { MidaTradingSystem, } from "#systems/MidaTradingSystem";
export { MidaTradingSystemParameters, } from "#systems/MidaTradingSystemParameters";
export { MidaTradingSystemSymbolState, } from "#systems/MidaTradingSystemSymbolState";

export { MidaTick, } from "#ticks/MidaTick";
export { MidaTickMovement, } from "#ticks/MidaTickMovement";
export { MidaTickParameters, } from "#ticks/MidaTickParameters";

export { MidaTimeframe, } from "#timeframes/MidaTimeframe";

export { MidaTrade, } from "#trades/MidaTrade";
export { MidaTradeDirection, } from "#trades/MidaTradeDirection";
export { MidaTradeParameters, } from "#trades/MidaTradeParameters";
export { MidaTradePurpose, } from "#trades/MidaTradePurpose";
export { MidaTradeRejection, } from "#trades/MidaTradeRejection";
export { MidaTradeStatus, } from "#trades/MidaTradeStatus";

export { MidaEmitter, } from "#utilities/emitters/MidaEmitter";
export { GenericObject, } from "#utilities/GenericObject";
export { MidaAnalysis, } from "#utilities/MidaAnalysis";
export {
    closeFileReader,
    readTicksFromFile,
    readPeriodsFromFile,
} from "#utilities/MidaFileSystem";
export {
    wait,
    shuffleArray,
    generateInRandomInteger,
    mergeOptions,
    uuid,
    createClosedPosition,
    getObjectPropertyNames,
    createOrderResolver,
} from "#utilities/MidaUtilities";

export { marketWatcher, MidaMarketWatcher, } from "#watchers/MidaMarketWatcher";
export { MidaMarketWatcherConfiguration, } from "#watchers/MidaMarketWatcherConfiguration";
export { MidaMarketWatcherDirectives, } from "#watchers/MidaMarketWatcherDirectives";
export { MidaMarketWatcherParameters, } from "#watchers/MidaMarketWatcherParameters";

export { MidaCryptoWithdrawalDirectives, } from "#withdrawals/MidaCryptoWithdrawalDirectives";
// </public-api>
