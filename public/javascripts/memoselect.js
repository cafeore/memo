$(function(){

});
$(function(){
  


  $('#tableContent').hide();
  $('#tableedit').bind('click',function(){
    if($('#tableContent').css('display')==='none'){
      $('#tableContent').slideDown();
    } else {
      $('#tableContent').slideUp();
    }
  });

  
  $('#clear').click(function(){
    $("#tableContent ul").each(function() {
      $(this).find('input.title').val('');
    });
  });

  $('#submit').click(function(event){
    var title = $('#title').val();
    swal({
      title: title+'を追加しますか？',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '追加'
    },
    function(isConfirm){
      //var title = $('#title').val();
      //var timeString = getTimeString();
      if(isConfirm){
        var now = new Date();
        var month = now.getMonth() + 1; // 月
        var day = now.getDate(); // 日
        var hour = now.getHours(); // 時
        var min = now.getMinutes(); // 分
        if(month<10)month='0'+month;
        if(day<10)day='0'+day;
        if(hour<10)hour='0'+hour;
        if(min<10)min='0'+min;
        var MemoData = {
          title:title,
          body:'',
          createTime: month+"/"+day+"/"+hour+":"+min,
          editTime: month+"/"+day+"/"+hour+":"+min,
          Error: false
        };
          $.ajax({
            url: './createPage',
            contentTypy: 'application/JSON',
            type: 'POST',
            dataType: 'json',
            scriptCharset:'utf-8',
            timeout: 10000,
            data:MemoData,
            success : function(reply){
              console.log(reply);
              if(reply.Error===false){
                /*var DOM='<tr>'+
                          '<div class="table">'+
                            '<td class="titleCell">'+reply.title+'</td>'+
                            '<td class="edittimeCell">'+reply.editTime+'</td>'+
                            '<td class="createTimeCell">'+reply.createTime+'</td>'+
                          '</div>'+
                          '<td class="checkbox">'+'<input type="checkbox" name="check" value="reply.title">'+'</td>'+
                        '</tr>';
                $(DOM).appendTo('tbody');*/
                location.reload();
                swal(
                  '保存成功',
                  '保存に成功しました',
                  'success'
                );

              }else if(reply.Error===true){
                
                swal(
                  '保存失敗',
                  '同じ名前のメモが存在します',
                  'error'
                );
              }
            },
            error : function(){
              swal(
                '保存失敗',
                'サーバーでエラーが起きたようです',
                'error'
              );
            }
          });
        }
      });
  });

  $('tbody').on('click','.table',function(){
    var thisTitle = $(this).children('.titleCell').text();
    window.location.href = './editPage?title='+ encodeURI(thisTitle.trim());
  });

  
  $('#save').click(function(event){
    var now = new Date();
    var month = now.getMonth() + 1; // 月
    var day = now.getDate(); // 日
    var hour = now.getHours(); // 時
    var min = now.getMinutes(); // 分
    if(month<10)month='0'+month;
    if(day<10)day='0'+day;
    if(hour<10)hour='0'+hour;
    if(min<10)min='0'+min;
    var saveMemoData = {
      title:$('#title').text().trim(),
      body:$('#body').val(),
      lastedittime:month+"/"+day+"/"+hour+":"+min
    };
    $.ajax({
      url:'./saveMemo',
      contentTypy:'application/JSON',
      type:'POST',
      dataType:'json',
      scriptCharset:'utf-8',
      timeout:10000,
      data:saveMemoData,
      success:function(reply){
        swal({
        title:'保存完了',
        html:'<p>メモ保存しました<br/>メモ一覧へ遷移しますか?</p>',
        type:'success',
        confirmButtonText: 'メモ一覧へ遷移',
        showCancelButton: true,
        allowOutsideClick: false
      },function(){
        window.location.href = './edit';
      });
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
        swal(
          '保存失敗',
          'サーバーとの接続中にエラーが発生しました',
          'error'
        );
      }
    });
  });

  $('#delete').click(function(event) {
    swal({
      title:"選択しているメモをすべて削除します",
      text:"よろしいですか？",
      type:'warning',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'削除'
    },
    function(isConfirm){
      if(isConfirm){
        $('[name="check"]:checked').each(function(){
          var deltitle= {
            title: String($(this).val())
          };
          $.ajax({
            url: './deleteMemo',
            contentTypy: 'application/JSON',
            type: 'POST',
            dataType: 'json',
            scriptCharset:'utf-8',
            timeout: 10000,
            data:deltitle,
            success : function(reply){
              swal(
                  '削除成功',
                  '削除に成功しました',
                  'success'
              );
            },
            error : function(reply){
              swal(
                  '保存失敗',
                  'サーバーでエラーが起きたようです',
                  'error'
              );
            }
          });
        });
        location.reload();
      }
    });
  });
});


//僕は日本を信じてるから日本以外はつかえないよね