/**
 * Created by quyang on 14-1-15.
 */

var mysql = require('mysql');
var async = require('async');

exports.queryForSortList = function(idKeySql,params,connections,startRow,endRow,key,desc,callback){
    query(idKeySql,params,connections,function(err,results){
        if(err){
            return callback(err);
        }
        sortListByKey(results,key,desc);
        splitIdKeyList(results);
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
        var results = [];
        for(var i = 0;i < res.length;i++){
            results.concat(res[i]);
        }
        callback(err,results);
    });
}

function sortListByKey(results,key,desc){
    if(results && results.length > 0){
        results.sort(function (a, b) {
            if(desc){
                return a[key] - b[key];
            }else{
                return b[key] - a[key];
            }
        });
    }
}

function splitIdKeyList(results,startRow,endRow){

    if(startRow<=totalSize){
        if(endRow>totalSize){
            endRow = totalSize ;
        }
    }
    var re = results.splice(startRow -1,endRow);
}
