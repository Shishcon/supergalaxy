        var compressionModule = {
            baseCost : 15,
            costIncrement : 15,
            benefitRatio : 0.01,
        
            getCost : () => {
                return Math.pow(10,compressionModule.baseCost) * Math.pow(10, ((player.compressions*player.compressions+player.compressions)/2)*compressionModule.costIncrement);
            },
            update : () => {
                if(compressionModule.getCost() != Infinity){
                    document.getElementById('compressCost').innerHTML = scientificNote(compressionModule.getCost())+" DM";
                }else{
                    document.getElementById('compressCost').innerHTML = "Infinity";
                }
                
                document.getElementById('compressCount').innerHTML = player.compressions;
                document.getElementById('compressBoost').innerHTML = '(+'+scientificNote(compressionModule.getPower(),3)+'x)';

            },
            use : () => {
                if(player.dm >= compressionModule.getCost() && compressionModule.getCost() != Infinity){
                    player.compressions++;
                    prestige();
                }
            },
            getPower : () => {
                return (player.compressions * compressionModule.benefitRatio) * heavenModule.getPower();
            },
            init : () => {
                document.getElementById('compressBtn').onclick = function(){compressionModule.use();};
                compressionModule.update();
            }
        
        }
        