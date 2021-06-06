function redirect_to_game(category_name){
    console.log('it works on click')
    // console.log(category_name.innerText)
    location.replace(`questions/${category_name.innerText}`)
}