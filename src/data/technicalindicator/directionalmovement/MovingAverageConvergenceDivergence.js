/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TechnicalIndicator from '../TechnicalIndicator'
import { MACD } from '../technicalIndicatorType'

export default class MovingAverageConvergenceDivergence extends TechnicalIndicator {
  constructor () {
    super(
      MACD, [12, 26, 9],
      [
        { key: 'diff', type: 'line' },
        { key: 'dea', type: 'line' },
        { key: 'macd', type: 'bar' }
      ], 4, true
    )
  }

  /**
   * 计算MACD指标
   *
   * MACD：参数快线移动平均、慢线移动平均、移动平均，
   * 默认参数值12、26、9。
   * 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
   * ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
   * ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
   * ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0涨颜色，小于0跌颜色。
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    let emaShort
    let emaLong
    let oldEmaShort = 0
    let oldEmaLong = 0
    let dea = 0
    let oldDea = 0
    let macd = 0

    this._calc(dataList, i => {
      const close = dataList[i].close
      if (i === 0) {
        emaShort = close
        emaLong = close
      } else {
        emaShort = (2 * close + (this.calcParams[0] - 1) * oldEmaShort) / (this.calcParams[0] + 1)
        emaLong = (2 * close + (this.calcParams[1] - 1) * oldEmaLong) / (this.calcParams[1] + 1)
      }

      const diff = emaShort - emaLong
      dea = (diff * 2 + oldDea * (this.calcParams[2] - 1)) / (this.calcParams[2] + 1)
      macd = (diff - dea) * 2
      oldEmaShort = emaShort
      oldEmaLong = emaLong
      oldDea = dea

      dataList[i].macd = { diff, dea, macd }
    })
  }
}