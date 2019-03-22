
    
exports.getPage = (req, res) =>{
    let stakehold;
    if (req.params.id == 'sh')
        stakehold = true;
    else
        stakehold = false;

    console.log(req.params.id)
    res.render('registration.html', {
        stakehold
    })
}