var debugField = document.getElementById("debug");
document.getElementById("debugBtn").onclick = getDebugCommand;
function getDebugCommand(){
    var command = debugField.value;
    command = command.split(' ');
    debugField.value = "";
    if(command[0] == "add"){
        console.log("add")
        if(command[1] == "DM"){
            console.log("DM")
            if(Number(command[2]) > 0){
                if(Number(command[3]) > 0){
                    console.log(Number(command[2]) + "e" + Number(command[3]))
                    player.dm += Number(command[2]) * Math.pow(Number(command[3]),10);
                    return;
                }
                
            }
            
        }
        if(command[1] == "DM"){
            
        }
    }
    else if(command[0] == "force"){
        if(command[1] == "compression"){
            if(Number(command[2]) > 0){
                for(i=0;i<Number(command[2]);i++){
                    player.dm = compressionModule.getCost();
                    compressionModule.use();
                }
            }
        }
        else if(command[1] == "release"){
            if(Number(command[2]) > 0){
                for(i=0;i<Number(command[2]);i++){
                    player.dm = releaseModule.getCost();
                    releaseModule.use();
                }
            }
        }
    }






}



/*
USAGE:
add <currency> <amount> <times of ten>
#used to add currency#
        currencies: DM
        example: add DM 2 10 //adds 2e10 DM

force <behaviour> <times>
#used to force prestige behaviours#
        behaviours: compression, release
        example: force compression 2 //forces compression 2 times


!WARNING!
usage of debug line is only for testing purposes and can break the game
!END!

*/