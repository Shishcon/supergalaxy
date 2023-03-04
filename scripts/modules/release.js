var releaseModule = {
    baseCost : 30,
    costIncrement : 20,
    benefitRatio : 2,

    getCost : () => {
        return Math.pow(10,releaseModule.baseCost) * Math.pow(10, player.releases*releaseModule.costIncrement);
    },
    update : () => {   
        document.getElementById('buyRel').innerHTML = scientificNote(releaseModule.getCost());
        document.getElementById('countRel').innerHTML = player.releases+' ('+scientificNote((Math.pow(releaseModule.benefitRatio,player.releases)))+'x)';    
    },
    use : () => {
        if(player.dm >= releaseModule.getCost()){
            player.releases++;
            player.compressions = 0;
            prestige();
            
        }
    },
    init : () => {
        document.getElementById('buyRel').onclick = function(){releaseModule.use();};
        releaseModule.update();
    }

}
