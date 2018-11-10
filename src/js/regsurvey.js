$('.number').change((e)=>{
    $('.main').html('');
    if(e.target.value<=40){
        for(let i=0;i<e.target.value;i++){
            let cl='chtype'+i;
            let nt='ntype'+i;
            let na='num_ans'+i
            let el=$(' <div class="block">введите вопрос: </div> ');
            el.append(' <input type="text" class="question"></input> ');
            el.append(` формат ответа: <select class=${cl}><option value="1">текст</option><option value="2">больше двух вариантов ответа</option></select> `)
            el.append(`<div class=${nt}></div>`)
            $('.main').append(el);
            $('.'+cl).change((e)=>{
                $('.'+nt).html('');
                
                if(e.target.value == 2){$('.'+nt).append(`введите количество вариантов ответа: <input type="text" class=${na}></input> `)}
                $('.'+na).change((e)=>{
                    console.log(1);
                        $('.'+nt).children().each(function(){
                           if($(this).attr("class") == "answer" || $(this).attr("class") == "ansres"){$(this).remove();console.log($(this).attr("class"))}
                        })
                        $('.'+nt).append('<span class="ansres"><br>введите варианты ответов: </span>')
                    for(let i=0;i<e.target.value;i++){
                        $('.'+nt).append(' <input type="text" class="answer"></input> ');
                    }
                })
            })
        }
    }
})
$('button').click((e)=>{
    let obj={
        data:{
            question:[],
            answer:[]
        }
    }
    obj.name=$('.name').val();
    obj.description=$('.description').val();
    obj.accessLVL=$('.lvl').val();
    obj.firstDate=$('.first_date').val();
    obj.lastDate=$('.last_date').val();
    let i=0;
    $('.block').each(function(){
        let mas_ans=[]
        obj.data.question[i]=$(this).children('.question').val()
        $(this).children('div:last-child').children('.answer').each(function(){
            mas_ans=[...mas_ans,$(this).val()]
        })
        if (mas_ans.length == 0 ){mas_ans='text';console.log(1)}
        obj.data.answer[i]=mas_ans;
        i++;
    })
    obj=JSON.stringify(obj)
    fetch("/createsurvey/reg",{
        method: 'post',  
        headers: {  
        "Content-type": "application/json; charset=UTF-8"  
        },  
        body: obj  })
        .then(res => res.text()).then((e)=>{$('.result').html(e)})
        .catch(res => res.text()).then((e)=>{$('.result').html(e)})
        
    
})
