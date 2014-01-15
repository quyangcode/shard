/**
 * Created by quyang on 14-1-15.
 */
var mysql = require('mysql');
var async = require('async');

exports.queryForList = function(sql,params,connections,callback){
    async.map(connections,function(item,callback){
        var con = mysql.createConnection(item);
        con.connect();
        var tempSql = sql.replace('$tableName$', item.tableName);
        con.query(tempSql, params, function (err, results) {
            callback(err,results);
        });
        con.end();
    },function(err,results){
        callback(err,results);
    });
}