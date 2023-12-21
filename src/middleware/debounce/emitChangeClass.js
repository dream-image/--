export function emitChangeClass(a,b,c,d){
    let timeout
    return function(){
        clearTimeout(timeout)
        timeout=setTimeout(()=>{
                a()
                b()
                if(d==null || d==undefined)
                    c()
                else c(d)
            },1000)  
    }
    
}