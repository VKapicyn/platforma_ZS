$('.number').change((e)=>{
    $('.main').html('');
    if(e.target.value<=40){
        for(let i=0;i<e.target.value;i++){
            let cl='chtype'+i;
            let nt='ntype'+i;
            let el=$(' <div class="block">введите вопрос: </div> ');
            el.append(' <input type="text" class="question"></input> ');
            el.append(` формат ответа: <select class=${cl}><option value="1">текст</option><option value="2">2 варианта ответа</option><option value="3">3 варианта ответа</option><option value="4">4 варианта ответа</option></select> `)
            el.append(`<div class=${nt}></div>`)
            $('.main').append(el);
            $('.'+cl).change((e)=>{
                $('.'+nt).html('');
                if(e.target.value == 2){$('.'+nt).append('введите варианты ответов: 1) <input type="text" class="answer"></input> 2) <input type="text" class="answer"></input> ')}
                if(e.target.value == 3){$('.'+nt).append('введите варианты ответов: 1) <input type="text" class="answer"></input> 2) <input type="text" class="answer"></input> 3) <input type="text" class="answer"></input> ')}
                if(e.target.value == 4){$('.'+nt).append('введите варианты ответов: 1) <input type="text" class="answer"></input> 2) <input type="text" class="answer"></input> 3) <input type="text" class="answer"></input> 4) <input type="text" class="answer"></input> ')}
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
    obj.accessLVL=$('.lvl').val();
    let i=0;
    $('.block').each(function(){
        let mas_ans=[]
        obj.data.question[i]=$(this).children('.question').val()
        $(this).children('div:last-child').children('.answer').each(function(){
            mas_ans=[...mas_ans,$(this).val()]
        })
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
    
})
