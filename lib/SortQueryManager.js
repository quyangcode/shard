/**
 * Created by quyang on 14-1-15.
 */

var mysql = require('mysql');
var async = require('async');

exports.queryForSortList = function(idKeySql,valueSql,params,connections,startRow,pageSize,key,desc,callback){
    query(idKeySql,params,connections,function(err,results){
        if(err){
            return callback(err);
        }
        sortListByKey(results,key,desc);
        splitIdKeyList(results,valueSql,params,connections,startRow,pageSize,function(err,results){
            if(err){
                return callback(err);
            }
            sortListByKey(results,key,desc);
            callback(err,results);
        });
    })
}

function query(sql,params,connections,callback){
    async.map(connections,function(item,callback){
        var con = mysql.createConnection(item);
        con.connect();
        var tempSql = sql.replace('$tableName$', item.tableName);
        con.query(tempSql, params, function(err,results){
            if(results){
                for(var i = 0;i < results.length;i++){
                    results[i]['tableName'] = item.tableName;
                }
            }
            callback(err,results);
        });
        con.end();
    },function(err,res){
        callback(err,concatResults(res));
    });
}

function sortListByKey(results,key,desc){
    if(results && results.length > 0){
        results.sort(function (a, b) {
            if(desc){
                return b[key] - a[key];
            }else{
                return a[key] - b[key];
            }
        });
    }
}

function splitIdKeyList(results,valueSql,params,connections,startRow,pageSize,callback){
    var count = startRow + pageSize - 1;
    if (count > results.length) {
        pageSize = results.length - (startRow - 1);
    }
    var tempResults = results.splice(startRow -1,pageSize);
    async.map(connections,function(item,callback){
        var con = mysql.createConnection(item);
        con.connect();
        var tempSql = valueSql.replace('$tableName$', item.tableName).replace('$ids$',getIds(tempResults,item.tableName));
        con.query(tempSql, params,callback);
        con.end();
    },function(err,results){
        if(err){
            return callback(err);
        }
        callback(err,concatResults(results));
    });
}

function concatResults(res){
    var results = [];
    for(var i = 0;i < res.length;i++){
        results = results.concat(res[i]);
    }
    return results;
}

function getIds(idArray,tableName){
    var ids = [];
    for(var i = 0;i < idArray.length;i++){
        if(idArray[i].tableName === tableName){
            ids.push(idArray[i].id);
        }
    }
    return ids.join(',');
}
