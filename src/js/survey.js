$('.send').click((e)=>{
    console.log(1)
    let obj={
        answer:[]
    };
    $('.data').each(function(){
        if($(this).children('.ans_select').val()){console.log($(this).children('.ans_select').val()); obj.answer=[...obj.answer,$(this).children('.ans_select').val()]}
        if($(this).children('.ans_text').val()){console.log($(this).children('.ans_text').val()); obj.answer=[...obj.answer,$(this).children('.ans_text').val()]}
    })
    obj=JSON.stringify(obj)
    fetch(window.location.href+"/reg",{
        method: 'post',  
        headers: {  
        "Content-type": "application/json; charset=UTF-8"  
        },  
        body: obj  })
        .then(res => res.text()).then((e)=>{$('.result').html(e)})
        .catch(res => res.text()).then((e)=>{$('.result').html(e)})
  
})
$('.file_an').click((e)=>{
    fetch(window.location.href+'/annotation').then(e=>console.log(e))
})
console.log($('.send'))