/**
 * Created by quyang on 14-1-14.
 */
var mysql = require('mysql');
var async = require('async');

/**
 * 查询条数  返回 count对象 每张表的条数
 * [{tableName:user,count:1},{...}]
 * @param sql
 * @param connections
 * @param params
 * @param callback
 */
function queryCount (sql,connections,params,callback){
    var counts = [];
    async.each(connections,function(item,callback){
        var con = mysql.createConnection(item);
        con.connect();
        var tempSql = sql.replace('$tableName$', item.tableName);
        con.query(tempSql, params, function (err, rows) {
            if(err){
                console.error('each connections err,item=' + item ,err);
                callback(err);
            }else{
                counts.push({tableName:item.tableName,count:rows[0]['count(1)']});
                callback(null);
            }
        });
        con.end();
    },function(){
        callback(counts);
    });
}

/**
 * 查询结果集
 * @param sql
 * @param connection 数据库连接配置
 * @param params
 * @param pageIndex
 * @param pageSize
 * @param callback
 */
function queryList (sql,connection,params,pageIndex,pageSize,callback){
    var con = mysql.createConnection(connection);
    con.connect();
    var tempSql = sql.replace('$tableName$',connection.tableName).replace('$pageIndex$',pageIndex).replace('$pageSize$',pageSize);
    con.query(tempSql,params,function(err,results){
        callback(err,results);
    });
    con.end();
}

/**
 * 按照配置顺序分页查询结果集
 * @param countSql
 * @param valueSql
 * @param connections
 * @param params
 * @param startRow
 * @param endRow
 * @param callback
 */
exports.querySequenceList = function(countSql,valueSql,connections,params,startRow,endRow,callback){
    var total = 0;
    queryCount(countSql,connections,params,function(counts){
        counts.forEach(function(value,index){
            total += value.count;
        });
        if(startRow < total){
            if(endRow > total){
                endRow = total;
            }
        }
        paging(valueSql,connections,params,counts,startRow,endRow,callback);
    });
}

function paging (sql,connections,params,counts,startRow,endRow,callback){
    var tmpStartRow = 1;
    var tmpEndRow = 1;
    var curNo = 0;

    async.map(counts,function(item,callback){
        curNo += item.count;
        //目前的表都不需要 继续往下一张表计算
        if(curNo < startRow){
            return callback(null);
        }
        //在一张表中就可以查询完成
        if(startRow > (curNo - item.count) && endRow <= curNo){
            tmpStartRow = startRow - (curNo - item.count);
            tmpEndRow = endRow - (curNo - item.count);
            queryList(sql,getConnectionByTableName(item.tableName,connections),params,tmpStartRow - 1,tmpEndRow - tmpStartRow + 1,function(err,results){
                callback(err,results);
            });
        }else if(startRow > (curNo - item.count) && endRow > curNo && startRow <= curNo){
            //前半段在这张表
            tmpStartRow = startRow - (curNo - item.count);
            tmpEndRow = item.count;
            queryList(sql,getConnectionByTableName(item.tableName,connections),params,tmpStartRow - 1,tmpEndRow - tmpStartRow + 1,function(err,results){
                callback(err,results);
            });
        }else if(startRow <= (curNo - item.count) && endRow <= curNo && endRow > (curNo - item.count)){
            //后半段在这张表
            tmpStartRow = 1;
            tmpEndRow = endRow - (curNo - item.count);
            queryList(sql,getConnectionByTableName(item.tableName,connections),params,tmpStartRow - 1,tmpEndRow - tmpStartRow + 1,function(err,results){
                callback(err,results);
            });
        }else{
            callback(null);
        }
    },function(err,res){
        var results = [];
        for(var i = 0;i < res.length;i++){
            //过滤掉空回调结果
            if(res[i]){
                results = results.concat(res[i]);
            }
        }
        callback(err,results);
    });
}

function getConnectionByTableName(tableName,connections){
    var con = {};
    connections.forEach(function(value){
        if(value.tableName === tableName){
            con = value;
        }
    });
    return con;
}




