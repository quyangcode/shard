/**
 * Created by quyang on 14-1-13.
 */
var SequenceQueryManager = require('./SequenceQueryManager.js');
var SortQueryManager = require('./SortQueryManager.js');
var SimpleQueryManaer = require('./SimpleQueryManager.js');


module.exports = QueryManager;

function QueryManager(json,queryId){
    if(json){
        if(json.querys){
            var connections = [];
            json.querys.forEach(function(value){
                if(value.id === queryId){
                    connections = value.connections;
                }
            });
            this.connections = connections;
        }else{
            throw new Error('json is not right');
        }
    }else{
        throw new Error('json is empty');
    }
}

/**
 * 按照配置顺序分页查询结果集
 * @param countSql 总条数sql
 * @param valueSql 查询sql
 * @param params   查询参数
 * @param pageIndex 页数
 * @param pageSize  每页大小
 * @param callback   (err,results)
 * @returns {*}
 */
QueryManager.prototype.queryForSequenceList = function(countSql,valueSql,params,pageIndex,pageSize,callback){
    try {
        checkSequence(arguments);
    } catch (e) {
        return callback(e);
    }
    SequenceQueryManager.querySequenceList(countSql,valueSql,this.connections,params,getStartRow(pageIndex,pageSize),getEndRow(pageIndex,pageSize),callback);
}

/**
 * 按照指定字段 指定顺序 排序
 * 不建议使用
 * @param idKeySql 返回主键和排序字段sql
 * @param valueSql
 * @param params
 * @param pageIndex
 * @param pageSize
 * @param key  排序字段
 * @param desc 顺序
 * @param callback
 * @returns {*}
 */
QueryManager.prototype.queryForSortList = function(idKeySql,valueSql,params,pageIndex,pageSize,key,desc,callback){
    try {
        checkSort(arguments);
    } catch (e) {
        return callback(e);
    }
    SortQueryManager.queryForSortList(idKeySql,valueSql,params,this.connections,getStartRow(pageIndex,pageSize),pageSize,key,desc,callback);
}

/**
 * 多个数据返回一个数组
 * @param sql
 * @param params
 * @param callback
 * @returns {*}
 */
QueryManager.prototype.queryForList = function(sql,params,callback){
    try {
        checkSimple(arguments);
    } catch (e) {
        return callback(e);
    }
    SimpleQueryManaer.queryForList(sql,params,this.connections,callback);
}

function checkSequence(arguments){
    if(arguments.length !== 6){
        throw new Error('argument is not right');
    }
    if(typeof arguments[0] !== 'string'){
        throw new Error('valueSql is not string');
    }
    if(typeof arguments[1] !== 'string'){
        throw new Error('countSql is not string');
    }
    if(typeof arguments[2] !== 'object'){
        throw new Error('params is not right');
    }
    if(typeof arguments[3] !== 'number'){
        throw new Error('pageIndex is not number');
    }
    if(typeof arguments[4] !== 'number'){
        throw new Error('pageSize is not number');
    }
    if(typeof arguments[5] !== 'function'){
        throw new Error('callback is not function');
    }
}

function checkSort(arguments){
    if(arguments.length !== 8){
        throw new Error('argument is not right');
    }
    if(typeof arguments[0] !== 'string'){
        throw new Error('valueSql is not string');
    }
    if(typeof arguments[1] !== 'string'){
        throw new Error('countSql is not string');
    }
    if(typeof arguments[2] !== 'object'){
        throw new Error('params is not right');
    }
    if(typeof arguments[3] !== 'number'){
        throw new Error('pageIndex is not number');
    }
    if(typeof arguments[4] !== 'number'){
        throw new Error('pageSize is not number');
    }
    if(typeof arguments[5] !== 'string'){
        throw new Error('pageSize is not number');
    }
    if(typeof arguments[6] !== 'boolean'){
        throw new Error('pageSize is not number');
    }
    if(typeof arguments[7] !== 'function'){
        throw new Error('callback is not function');
    }
}

function checkSimple(arguments){
    if(arguments.length !== 3){
        throw new Error('argument is not right');
    }
    if(typeof arguments[0] !== 'string'){
        throw new Error('valueSql is not string');
    }
    if(typeof arguments[1] !== 'object'){
        throw new Error('params is not right');
    }
    if(typeof arguments[2] !== 'function'){
        throw new Error('callback is not function');
    }
}

function getStartRow (pageIndex,pageSize){
    if(pageIndex < 1){
        pageIndex = 1;
    }
    return (pageIndex - 1) * pageSize + 1;
}

function getEndRow (pageIndex,pageSize){
    if(pageIndex < 1){
        pageIndex = 1;
    }
    return pageIndex * pageSize;
}
