var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var router = express.Router();

var Schema = mongoose.Schema;
var MemoSchema = new Schema({
	title: String,
    body: String,
	edittime: String,
  createtime: String
});
mongoose.model('Memo',MemoSchema);

var UserSchema = new Schema({
  
});

mongoose.connect('mongodb://localhost/memo_db',function(err){
	if(err)console.log(err);
	else console.log('connect success');
});

var Memo = mongoose.model('Memo');

/* GET users listing. */
router.get('/edit', function(req, res, next) {
  Memo.find({},function(err,docs){
    if(err){
      console.log(err);
    }else{
      res.render('memoedit', {
        data:docs
      });
    }
  });
});

router.post('/createPage',function(req, res, next){
  console.log(req.body);
  var reqData=req.body;
  var resData={
    title:reqData.title,
    body:'',
    editTime:reqData.editTime,
    createTime:reqData.createTime,
    Error:false
  };

  var memo=new Memo();
  memo.title=reqData.title;
  memo.body='';
  memo.edittime=reqData.editTime;
  memo.createtime=reqData.createTime;
  Memo.findOne({title:memo.title},function(err,docs){
    if(docs!==null){
      resData.Error=true;
      res.json(resData);
      return false;
    }
    memo.save(function(err){
      if (err)console.log(err);
    });
    Memo.remove({ title:resData.title},function(){
      if (err)console.log(err);
    });
    res.json(resData);
    return false;
  });
});

router.get('/editPage', function(req, res, next) {
  var title = decodeURI(req.query.title).trim();
  Memo.findOne({title:title},function(findFuncErr,docs){
    if(findFuncErr){
      console.log(findFuncErr);
      res.render('Err',{Err:'サーバー内でエラーが発生しました'});
      return false;
    }
    if(docs === null){
      console.log('edit:notFound');
      res.render('Err',{Err:'メモが存在していません'});
      return false;
    }
    res.render('memo_in',{title:title,body:docs.body});
  });
});

router.post('/saveMemo', function(req, res, next){
  var resData=req.body;
  Memo.findOne({title:resData.title},function(findFuncErr,docs){
    console.log(resData.body);
    Memo.update(
      {
        title:resData.title
      },
      {
        $set:{
          body:resData.body,
          editTime:resData.lastedittime
        }
      },
      function(err,result){
      if(err){
        console.log(err);
        return false;
      }
      res.json(resData);
      return false;
    });
  });
});

router.post('/deleteMemo', function(req, res, next){
  var reqData=req.body;
    Memo.remove({title:reqData.title},function (err,result) {
      if(err){
        console.log(err);
        return false;
      }
      if(result.result.n === 0){
        console.log('Delete:notFound');
        return false;
      }
    });
    //console.log(reqData[i]);

  res.json(req.body);
  return false;
});

function escapeProcess(string){
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = router;