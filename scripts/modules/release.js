var releaseModule = {
    baseCost : 30,
    costIncrement : 20,
    benefitRatio : 2,

    getCost : () => {
        return Math.pow(10,releaseModule.baseCost) * Math.pow(10, player.releases*releaseModule.costIncrement);
    },
    update : () => {   
        document.getElementById('releaseCost').innerHTML = scientificNote(releaseModule.getCost())+" DM";
        document.getElementById('releaseCount').innerHTML = player.releases;//+' ('+scientificNote((Math.pow(releaseModule.benefitRatio,player.releases)))+'x)';    
        document.getElementById('releaseBoost').innerHTML = ' ('+scientificNote((Math.pow(releaseModule.benefitRatio,player.releases)))+'x)';    

    },
    use : () => {
        if(player.dm >= releaseModule.getCost()){
            player.releases++;
            player.compressions = 0;
            prestige();
            
        }
    },
    init : () => {
        document.getElementById('releaseBtn').onclick = function(){releaseModule.use();};
        releaseModule.update();
    }

}
