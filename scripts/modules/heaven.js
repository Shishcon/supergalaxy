var heavenModule = {
    baseCost : Infinity,
    costIncrement : 0,
    benefitRatio : 1.5,
    income : 1,

    getCost : () => {
        return heavenModule.baseCost;
    },
    update : () => {
        if(compressionModule.getCost() != Infinity){
            document.getElementById('heavenIncome').innerHTML = "Reach Infinity";
        }else{
            document.getElementById('heavenIncome').innerHTML = "+"+heavenModule.income+" MP";
        }
        document.getElementById('mpCount').innerHTML = player.mp;
        /*//document.getElementById('heavenCount').innerHTML = player.mpPrestigeCount + " Heavens";
        
        //if(heavenModule.getPower() >= 1000){
            document.getElementById('mpBoost').innerHTML = scientificNote(heavenModule.getPower());
        }else{
            document.getElementById('mpBoost').innerHTML = heavenModule.getPower().toFixed(2);

        }*/
        

    },
    getPower: () => {
        return Math.pow(heavenModule.benefitRatio,0);
    },
    use : () => {
        if(player.dm == heavenModule.getCost()){
            player.mpPrestigeCount+=1;
            player.mp+=heavenModule.income;
            player.compressions = 0;
            player.releases = 0;
            prestige();
            return true;
        }
        return false;
    },
    init : () => {
        document.getElementById('heavenBtn').onclick = function(){heavenModule.use();};
        heavenModule.update();
    }

}
