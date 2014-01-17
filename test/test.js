/**
 * Created by quyang on 14-1-13.
 */
var should = require('should');
var json = require('../examples/config.json');
var QueryManager = require('../lib/QueryManager.js');

describe('test shard',function(){
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

    it('test list ',function(done){
        queryManager.queryForList(sql,[1],function(err,results){
            should.not.exists(err);
            results.length.should.equal(2);
            results[0].length.should.equal(9);
            results[1].length.should.equal(5);
            done();
        });
    });

    it('test sortList 4-7 ',function(done){
        var idKeySql = 'select id id,score from $tableName$ where yn = ? ';
        var pageSql = 'select * from $tableName$ where id in ( $ids$ ) and yn = ? ';
        queryManager.queryForSortList(idKeySql,pageSql,[1],2,4,'score',false,function(err,results){
            should.not.exists(err);
            results.length.should.equal(4);
            done();
        });
    });

    it('test sortList 0-3 ',function(done){
        var idKeySql = 'select id id,score from $tableName$ where yn = ? ';
        var pageSql = 'select * from $tableName$ where id in ( $ids$ ) and yn = ? ';
        queryManager.queryForSortList(idKeySql,pageSql,[1],0,4,'score',false,function(err,results){
            should.not.exists(err);
            results.length.should.equal(4);
            done();
        });
    })

    it('test sortList 11-12 ',function(done){
        var idKeySql = 'select id id,score from $tableName$ where yn = ? ';
        var pageSql = 'select * from $tableName$ where id in ( $ids$ ) and yn = ? ';
        queryManager.queryForSortList(idKeySql,pageSql,[1],4,4,'score',false,function(err,results){
            should.not.exists(err);
            results.length.should.equal(2);
            done();
        });
    })
});