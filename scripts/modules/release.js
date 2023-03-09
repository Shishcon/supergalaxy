var releaseModule = {
    baseCost : 30,
    costIncrement : 20,
    benefitRatio : 2,

    getCost : () => {
        return Math.pow(10,releaseModule.baseCost) * Math.pow(10, player.releases*releaseModule.costIncrement);
    },
    update : () => {   
        if(releaseModule.getCost() != Infinity){
            document.getElementById('releaseCost').innerHTML = scientificNote(releaseModule.getCost())+" DM";
        }else{
            document.getElementById('releaseCost').innerHTML = "Infinity";
        }
        document.getElementById('releaseCount').innerHTML = player.releases;//+' ('+scientificNote((Math.pow(releaseModule.benefitRatio,player.releases)))+'x)';    
        document.getElementById('releaseBoost').innerHTML = ' ('+scientificNote(releaseModule.getPower(),1)+'x)';    

    },
    use : () => {
        if(player.dm >= releaseModule.getCost() && releaseModule.getCost() != Infinity){
            player.releases++;
            player.compressions = 0;
            prestige();
            
        }
    },
    getPower : () =>{
        if(player.releases == 0){
            return 1;
        }
        return Math.pow(releaseModule.benefitRatio,player.releases)*heavenModule.getPower();
    },
    init : () => {
        document.getElementById('releaseBtn').onclick = function(){releaseModule.use();};
        releaseModule.update();
    }

}
