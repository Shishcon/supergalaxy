        var compressionModule = {
            baseCost : 15,
            costIncrement : 15,
            benefitRatio : 0.02,
        
            getCost : () => {
                return Math.pow(10,compressionModule.baseCost) * Math.pow(10, player.compressions*compressionModule.costIncrement);
            },
            update : () => {
                document.getElementById('compressCost').innerHTML = scientificNote(compressionModule.getCost())+"DM";
                document.getElementById('compressCount').innerHTML = player.compressions;
                document.getElementById('compressBoost').innerHTML = '(+'+(compressionModule.benefitRatio*player.compressions).toFixed(3)+'x)';

            },
            use : () => {
                if(player.dm >= compressionModule.getCost()){
                    player.compressions++;
                    prestige();
                }
            },
            init : () => {
                document.getElementById('compressBtn').onclick = function(){compressionModule.use();};
                compressionModule.update();
            }
        
        }
        