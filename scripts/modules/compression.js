        var compressionModule = {
            baseCost : 24,
            costIncrement : 15,
            benefitRatio : 0.02,
        
            getCost : () => {
                return Math.pow(10,compressionModule.baseCost) * Math.pow(10, player.compressions*compressionModule.costIncrement);
            },
            update : () => {
                document.getElementById('buyComp').innerHTML = scientificNote(compressionModule.getCost());
                document.getElementById('countComp').innerHTML = player.compressions+' (+'+(compressionModule.benefitRatio*player.compressions).toFixed(3)+'x)';

            },
            use : () => {
                if(player.dm >= compressionModule.getCost()){
                    player.compressions++;
                    prestige();
                }
            },
            init : () => {
                document.getElementById('buyComp').onclick = function(){compressionModule.use();};
                compressionModule.update();
            }
        
        }
        