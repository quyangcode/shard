/**
 * Created by quyang on 14-1-13.
 */
var should = require('should');
var json = require('../examples/config.json');
var QueryManager = require('../lib/QueryManager.js');
var mysql = require('mysql');

describe('test shard',function(){
    /**
     * 测试数据
     * CREATE TABLE `user` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `name` varchar(11) CHARACTER SET utf8mb4 DEFAULT NULL,
     `yn` tinyint(4) DEFAULT NULL,
     PRIMARY KEY (`id`)
     ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

     -- ----------------------------
     -- Records of user
     -- ----------------------------
     INSERT INTO `user` VALUES ('1', 'test-1', '1');
     INSERT INTO `user` VALUES ('2', 'test0', '1');
     INSERT INTO `user` VALUES ('3', 'test1', '1');
     INSERT INTO `user` VALUES ('4', 'test2', '1');
     INSERT INTO `user` VALUES ('5', 'test3', '1');
     INSERT INTO `user` VALUES ('6', 'test4', '1');
     INSERT INTO `user` VALUES ('7', 'test5', '1');
     INSERT INTO `user` VALUES ('8', 'test6', '1');
     INSERT INTO `user` VALUES ('9', 'test7', '1');

     CREATE TABLE `user_hist` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `name` varchar(11) CHARACTER SET utf8 DEFAULT NULL,
     `yn` tinyint(4) DEFAULT NULL,
     PRIMARY KEY (`id`)
     ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

     -- ----------------------------
     -- Records of user_hist
     -- ----------------------------
     INSERT INTO `user_hist` VALUES ('1', 'hist_1', '1');
     INSERT INTO `user_hist` VALUES ('2', 'hist_2', '1');
     INSERT INTO `user_hist` VALUES ('3', 'hist_3', '1');
     INSERT INTO `user_hist` VALUES ('4', 'hist_4', '1');
     INSERT INTO `user_hist` VALUES ('5', 'hist_5', '1');
     */

    var queryManager = new QueryManager(json,1);
    var countSql = 'select count(1) from $tableName$ where yn = ? ';
    var valueSql = 'select * from $tableName$ where yn = ? limit $pageIndex$ , $pageSize$';
    var sql = 'select * from $tableName$ where yn = ? ';


    it('test sequenceList first table',function(done){
        queryManager.queryForSequenceList(countSql,valueSql,[1],0,4,function(err,results){
            should.not.exists(err);
            results.length.should.equal(4);
            done();
        });
    });

    it('test sequenceList two table',function(done){
        queryManager.queryForSequenceList(countSql,valueSql,[1],3,4,function(err,results){
            should.not.exists(err);
            results.length.should.equal(4);
            done();
        });
    });

    it('test sequenceList second table',function(done){
        queryManager.queryForSequenceList(countSql,valueSql,[1],4,4,function(err,results){
            should.not.exists(err);
            results.length.should.equal(2);
            done();
        });
    });

    it('test sequenceList no result',function(done){
        queryManager.queryForSequenceList(countSql,valueSql,[1],5,4,function(err,results){
            should.not.exists(err);
            results.length.should.equal(0);
            done();
        });
    });

    it('test sequenceList no result',function(done){
        queryManager.queryForList(sql,[1],function(err,results){
            should.not.exists(err);
            console.log(results);
            results.length.should.equal(2);
            results[0].length.should.equal(9);
            results[1].length.should.equal(5);
            done();
        });
    });
});