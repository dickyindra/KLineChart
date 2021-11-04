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

import numeral from 'numeral'
import { isNumber, isObject, isValid } from './typeChecks'

/**
 * Numeral register locale "id"
 */
numeral.register('locale', 'id', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'K',
    million: 'M',
    billion: 'B',
    trillion: 'T'
  },
  currency: {
    symbol: 'Rp'
  }
})

numeral.locale('id')

/**
 * 格式化值
 * @param data
 * @param key
 * @param defaultValue
 * @returns {string|*}
 */
export function formatValue (data, key, defaultValue = '--') {
  if (isObject(data)) {
    const value = data[key]
    if (isValid(value)) {
      return value
    }
  }
  return defaultValue
}

/**
 * 格式化时间
 * @param dateTimeFormat
 * @param timestamp
 * @param format
 * @returns {string}
 */
export function formatDate (dateTimeFormat, timestamp, format = 'DD-MM hh:mm') {
  if (isNumber(timestamp)) {
    const dateTimeString = dateTimeFormat.format(new Date(timestamp))
    const dateTimeStringArray = dateTimeString.split(', ')
    const dateStringArray = dateTimeStringArray[0].split('/')
    const date = {
      YYYY: dateStringArray[2],
      MM: dateStringArray[0],
      DD: dateStringArray[1],
      'hh:mm': dateTimeStringArray[1].match(/^[\d]{2}/)[0] === '24'
        ? dateTimeStringArray[1].replace(/^[\d]{2}/, '00')
        : dateTimeStringArray[1]
    }
    return format.replace(/YYYY|MM|DD|(hh:mm)/g, key => date[key])
  }
  return '--'
}

/**
 * 格式化精度
 */
export function formatPrecision (value, precision = 2) {
  const v = +value
  if ((v || v === 0) && isNumber(v)) {
    return Math.floor(value * 10 ** precision) / 10 ** precision
  }
  return `${v}`
}

export const ROUNDING = {
  ROUND: 0,
  UP: 1,
  DOWN: 2
}

/**
 * 格式化大数据
 * @param value
 * @param rounding
 */
export function formatBigNumber (value, rounding = ROUNDING.ROUND) {
  if (isNumber(+value)) {
    let roundingFunction

    if (rounding === ROUNDING.ROUND) {
      roundingFunction = Math.round
    }

    if (rounding === ROUNDING.UP) {
      roundingFunction = Math.ceil
    }

    if (rounding === ROUNDING.DOWN) {
      roundingFunction = Math.floor
    }

    return numeral(+value).format('0.[00]a', roundingFunction)
  }
  return '--'
}
