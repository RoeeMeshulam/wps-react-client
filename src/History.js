function Get(){
    return localStorage.getItem('Query');
}

function Set(proccessedLayer){
    localStorage.setItem('Query', localStorage.getItem('Query') + proccessedLayer)
}