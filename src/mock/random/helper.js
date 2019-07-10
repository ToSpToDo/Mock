/*
    ## Helpers
*/

var Util = require('../util')

module.exports = {
    // 把字符串的第一个字母转换为大写。
    capitalize: function (word) {
        return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
    },
    // 把字符串转换为大写。
    upper: function (str) {
        return (str + '').toUpperCase()
    },
    // 把字符串转换为小写。
    lower: function (str) {
        return (str + '').toLowerCase()
    },
    // 从数组中随机选取一个元素，并返回。
    pick: function pick(arr, min, max) {
        // pick( item1, item2 ... )
        if (!Util.isArray(arr)) {
            arr = [].slice.call(arguments)
            min = 1
            max = 1
        } else {
            // pick( [ item1, item2 ... ] )
            if (min === undefined) min = 1

            // pick( [ item1, item2 ... ], count )
            if (max === undefined) max = min
        }

        if (min === 1 && max === 1) return arr[this.natural(0, arr.length - 1)]

        // pick( [ item1, item2 ... ], min, max )
        return this.shuffle(arr, min, max)

        // 通过参数个数判断方法签名，扩展性太差！#90
        // switch (arguments.length) {
        // 	case 1:
        // 		// pick( [ item1, item2 ... ] )
        // 		return arr[this.natural(0, arr.length - 1)]
        // 	case 2:
        // 		// pick( [ item1, item2 ... ], count )
        // 		max = min
        // 			/* falls through */
        // 	case 3:
        // 		// pick( [ item1, item2 ... ], min, max )
        // 		return this.shuffle(arr, min, max)
        // }
    },
    /*
        打乱数组中元素的顺序，并返回。
        Given an array, scramble the order and return it.

        其他的实现思路：
            // https://code.google.com/p/jslibs/wiki/JavascriptTips
            result = result.sort(function() {
                return Math.random() - 0.5
            })
    */
    shuffle: function shuffle(arr, min, max) {
        arr = arr || []
        var old = arr.slice(0),
            result = [],
            index = 0,
            length = old.length;
        for (var i = 0; i < length; i++) {
            index = this.natural(0, old.length - 1)
            result.push(old[index])
            old.splice(index, 1)
        }
        switch (arguments.length) {
            case 0:
            case 1:
                return result
            case 2:
                max = min
            /* falls through */
            case 3:
                min = parseInt(min, 10)
                max = parseInt(max, 10)
                return result.slice(0, this.natural(min, max))
        }
    },
    /*
        * Random.order(item, item)
        * Random.order([item, item ...])

        顺序获取数组中的元素

        [JSON导入数组支持数组数据录入](https://github.com/thx/RAP/issues/22)

        不支持单独调用！
    */
    order: function order(array) {
        order.cache = order.cache || {}

        if (arguments.length > 1) array = [].slice.call(arguments, 0)

        // options.context.path/templatePath
        var options = order.options
        var templatePath = options.context.templatePath.join('.')

        var cache = (
            order.cache[templatePath] = order.cache[templatePath] || {
                index: 0,
                array: array
            }
        )

        return cache.array[cache.index++ % cache.array.length]
    },
    /**
     * 确保随机 mock 的数组数据中 有且仅有一个（key）
     *
     * @param key ： 唯一值
     * @param arr ： 数组取值范围
     * @returns {*} ： arr.concat(key)[i]
     *
     * Mock.mock({
     *   'arr|10': [{
     *       'bool': '@unique(true,[true,false])',
     *       'number': '@unique(1,[0,2,3,4,5,6])',
     *       'str': '@unique("a",["a","a","b","c"])'
     *   }],
     *   'arr': [{
     *       'bool': '@unique(true,[true,false])',
     *       'number': '@unique(1,[0,2,3,4,5,6])',
     *       'str': '@unique("a",["a","a","a","d"])'
     *   }, {
     *       'bool': '@unique(true,[true,false])',
     *       'number': '@unique(1,[0,2,3,4,5,6])',
     *       'str': '@unique("a",["a","a","a","d"])'
     *   }]
     * })
     */
    unique: function (key, arr) {
        key = key === undefined ? true : key;
        arr = Array.isArray(arr) ? arr : [false];

        try {
            var _context = this.unique.options.context; // this.unique.options
            var _arrLength = _context._count.slice(-2)[0];
            var _arrValue = _context._rootValue.slice(-2)[0];
            var _parsedKey = _context.path.slice(-1)[0];

            if (_arrValue.some(function (item) {
                return item[_parsedKey] === key
            })) {
                return this.pick(arr.filter(function (item) {
                    return item !== key
                }));
            } else {
                if (_arrLength === _arrValue.length + 1) {
                    return key;
                } else {
                    return this.pick(arr.filter(function (item) {
                        return item !== key
                    }).concat(key));
                }
            }
        } catch (e) {
            return this.pick([true, false]);
        }
    },
    /**
     * 通过函数也可以实现：只是觉得比较常用，就统一提供一个占位符简化
     *
     * @param arr
     * @param length
     * @param key
     * @returns {Array}
     */
    randomArr: function (arr, length, key) {
        arr = Array.isArray(arr) ? arr : [false];
        length = typeof length === 'number' ? length : 1;

        var _result = [];
        var _filterArr = arr.filter(function (item) {
            return item !== key
        })
        var _key = key.context ? undefined : key

        while (_result.length < length) {
            if (_key === undefined) {
                _result.push(this.pick(arr))
            } else {
                if (_result.indexOf(_key) < 0) {
                    if (length - 1 === _result.length) {
                        _result.push(_key)
                    } else {
                        _result.push(this.pick(_filterArr.concat(_key)))
                    }
                } else {
                    _result.push(this.pick(_filterArr))
                }
            }
        }

        return _result;
    },
}
