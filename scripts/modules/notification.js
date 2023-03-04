function showNotification(msg){
    var notification = document.createElement("div");
    notification.classList+="notification";
    notification.innerHTML = msg;
    var notes = document.getElementsByClassName("notification");
    for (let i = 0; i < notes.length; i++) {
        const element = notes[i];
        element.style.bottom = (Number(element.style.bottom.split('px')[0])+70)+"px";
        
    }

    
    document.body.appendChild(notification);
    setTimeout(function(){notification.remove()},3000);

}