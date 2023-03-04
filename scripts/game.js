 function scientificNote(liczba){
           
            if(liczba<1000){
                return Math.floor(liczba);
            }
            let exponent = Math.floor(Math.log10(liczba));
            
            return (liczba/Math.pow(10,exponent)).toFixed(2)+"e"+exponent;

        }

        

        var player = {

            //currencies
            dm : 10,
            mp : 0,

            //Dadidims
            dims : [0,0,0,0,0,0,0,0],
            dimsBaseCost : [10,100,10000,1000000,1000000000,100000000000000,1000000000000000000,1000000000000000000000000],
            dimsCostIncrement : [3,4,5,6,8,10,12,15],
            dimsBought : [0,0,0,0,0,0,0,0],

            getDimCost : (dim) => {
                return player.dimsBaseCost[dim] * Math.pow(10, Math.floor(player.dimsBought[dim]/10)*player.dimsCostIncrement[dim]);//Math.pow(Math.pow(10,),(2*(dim)));
            
            },
            buyDim : (dim) => {
                if(player.dm >= player.getDimCost(dim)){
                player.dm -=  player.getDimCost(dim);
                player.dims[dim]++;
                player.dimsBought[dim]++;
                if(player.dm >= player.getDimCost(dim) && player.dimsBought[dim]%10 != 0){
                    player.buyDim(dim);
                }
                player.updateDimInfo(dim);
                }
            },
            updateDimInfo : (dim) => {
                document.getElementById('buyD'+(dim+1)).innerHTML = scientificNote(player.getDimCost(dim))+" DM";
                document.getElementById('countD'+(dim+1)).innerHTML = scientificNote(player.dims[dim])+"x";
                document.getElementById('barD'+(dim+1)).getElementsByClassName('buy10BarBought')[0].style.width = (player.dimsBought[dim]%10)*10+'%';
                document.getElementById('barD'+(dim+1)).getElementsByClassName('buy10Bar')[0].style.width = 
                Math.min(10,Math.floor(((player.dimsBought[dim]%10))+(player.dm/player.getDimCost(dim))))*10+'%';
            },


            //DM miniPrestiges
            releases : 0,
            compressions : 0,

            //Tickspeed
            ts : 0,
            tsMulti : 0.125,

            ////Infinity (Prestige 1)////
            
            mpPrestigeCount : 0,




            //Upgrades 
            mpUpgrades : {

                unlocked : [false],
                cost : [1],
                /*
                upgrade[0] - base player.tsMulti 0.125 -> 0.150
                upgrade[1] - Release multiplayer 2x -> 2.2x
                
                upgrade[2] - 1st DadiDim production boosted by (1+player.mpPrestigeCount/5)x
                upgrade[3] - 2nd DadiDim production boosted by (1+player.mpPrestigeCount/5)x
                upgrade[4] - 3rd DadiDim production boosted by (1+player.mpPrestigeCount/5)x
                upgrade[5] - 4th DadiDim production boosted by (1+player.mpPrestigeCount/5)x
                */
            },


            //Misc
            actualTime : Date.now(),


            
            
        }

        var saveFile = {
            save:()=>{
                saveFile.data.dm = player.dm;
                saveFile.data.ts = player.ts;
                saveFile.data.dims = player.dims;
                saveFile.data.dimsBought = player.dimsBought;
                saveFile.data.compressions = player.compressions;
                saveFile.data.releases = player.releases;
                window.localStorage.setItem("saveData",JSON.stringify(saveFile.data));
            },
            load:()=>{
                if(window.localStorage.length == 0){
                    return;
                }

                saveFile.data = JSON.parse(window.localStorage.getItem("saveData"));

                
                player.dm = saveFile.data.dm;
                player.ts = saveFile.data.ts;
                player.dims = saveFile.data.dims;
                player.dimsBought = saveFile.data.dimsBought;
                player.compressions = saveFile.data.compressions;
                player.releases = saveFile.data.releases;


                updateTs();
                compressionModule.update();
                releaseModule.update();
            },
            data : {
                dm : 10,
                ts : 0,
                dims : [],
                dimsBought : [],
                compressions : 0,
                releases : 0,
            }
            
        }
        document.getElementById('saveBtn').onclick = saveFile.save;

        function incrementFormula(dim){

            let incrementation = 1;

            incrementation *= player.dims[dim]; //dimCount

            incrementation *= calculateTs(); //Tickspeed


            incrementation *= Math.pow(2,Math.floor(player.dimsBought[dim]/10)) //Buy 10 multiplier

            incrementation *= Math.pow(2,player.releases); //Release bonus

            if(dim == 0){ //Display income/sec
                document.getElementById('cashIncome').innerHTML = scientificNote(incrementation);
            }

            incrementation *= ((Date.now() - player.actualTime)/1000); //delta time


            return incrementation;
        }

        function income(){
            
            for(i=player.dims.length-1;i>0;i--){
                player.dims[i-1] += incrementFormula(i);
                player.updateDimInfo(i-1);
            }
            player.updateDimInfo(7);
            player.dm += incrementFormula(0);
            document.getElementById('cashCount').innerHTML = scientificNote(player.dm);

            checkAvilability();
            checkMamiPercentage();

            player.actualTime = Date.now();
        }

        function checkMamiPercentage(){
            let percentage = (Math.max(1,Math.log10(player.dm))/Math.log10(Math.pow(10,308)*1.7)*100).toFixed(2);
            if(player.dm == Infinity){
                document.getElementById('mamiBar').style.width = 0;
                document.getElementById('mamiPercentage').style.color = "orange";
                document.getElementById('mamiPercentage').innerHTML = "Dominate me, Mami! ~";
                return;
            }
            document.getElementById('mamiBar').style.width = percentage+"%";
            document.getElementById('mamiPercentage').innerHTML = percentage+"%";
        }

        function checkAvilability(){
            //ts
            if(player.dm >= Math.pow(10,3) * Math.pow(10, player.ts)){
                showBuyable(document.getElementById('buyTs'));
                document.getElementById('barTs').style.borderColor = "magenta";
                document.getElementById('barTs').style.backgroundColor = "purple";
                document.getElementById('barTs').style.color = "#FFF";
            }else{
                hideBuyable(document.getElementById('buyTs'));
                document.getElementById('barTs').style.borderColor = "#777";
                document.getElementById('barTs').style.backgroundColor = "#111";
                document.getElementById('barTs').style.color = "#777";
            }
            //dims
            for(i=0;i<player.dims.length;i++){
                let upgradeBtn = document.getElementById('buyD'+(i+1));
                if(player.dm >= player.getDimCost(i)){
                    showBuyable(upgradeBtn);
                    document.getElementById('barD'+(i+1)).style.borderColor = "lime";
                    document.getElementById('barD'+(i+1)).style.color = "#FFF";
                }else{
                    hideBuyable(upgradeBtn);
                    document.getElementById('barD'+(i+1)).style.borderColor = "#777";
                    document.getElementById('barD'+(i+1)).style.color = "#777";
                }
            }

            //compression
            
            if(player.dm >= compressionModule.getCost()){
                document.getElementById('compBlock').classList.remove("compInactive")
                document.getElementById('compBlock').classList.add("compActive")
            }else{
                document.getElementById('compBlock').classList.add("compInactive")
                document.getElementById('compBlock').classList.remove("compActive")
            }
            

            //release
            if(player.dm >= releaseModule.getCost()){
                document.getElementById('relBlock').classList.remove("relInactive")
                document.getElementById('relBlock').classList.add("relActive")
            }else{
                document.getElementById('relBlock').classList.add("relInactive")
                document.getElementById('relBlock').classList.remove("relActive")
            }

        }

        function showBuyable(block){
            block.classList.remove("cantBuy");
            
        }
        function hideBuyable(block){
            block.classList.add("cantBuy");
        }

        for(i=0;i<player.dims.length;i++){
            document.getElementById('buyD'+(i+1)).innerHTML = scientificNote(player.getDimCost(i))+" DM";
        }
        

        document.getElementById('buyD1').onclick = function(){player.buyDim(0)};
        document.getElementById('buyD2').onclick = function(){player.buyDim(1)};
        document.getElementById('buyD3').onclick = function(){player.buyDim(2)};
        document.getElementById('buyD4').onclick = function(){player.buyDim(3)};
        document.getElementById('buyD5').onclick = function(){player.buyDim(4)};
        document.getElementById('buyD6').onclick = function(){player.buyDim(5)};
        document.getElementById('buyD7').onclick = function(){player.buyDim(6)};
        document.getElementById('buyD8').onclick = function(){player.buyDim(7)};

        //TS upgrades
        document.getElementById('buyTs').onclick = function(){buyTs()};
        document.getElementById('barTs').onclick = function(){buyTs(true)};
        updateTs();
        
        function calculateTs(){
            let ticksMulti = player.tsMulti+1;
                if(player.mpUpgrades.unlocked[0]){  //mpUgrade[0]
                    ticksMulti += 0.050;
                }
            ticksMulti += player.compressions * compressionModule.benefitRatio; //Compression bonus
                       
            return Math.pow(ticksMulti,player.ts)
        }

        function buyTs(max){
            if(max){
                
                while(player.dm >= Math.pow(10,3) * Math.pow(10, player.ts)){
                    player.dm -= Math.pow(10,3) * Math.pow(10, player.ts);
                    player.ts++;
                    
                }
                updateTs();
                return;
            }
            if(player.dm >= Math.pow(10,3) * Math.pow(10, player.ts)){
                player.dm -= Math.pow(10,3) * Math.pow(10, player.ts);
                player.ts++;
                
                updateTs();
            }
            
        }

        function updateTs(){
            document.getElementById('buyTs').innerHTML = scientificNote(Math.pow(10,3) * Math.pow(10, player.ts));
                if(calculateTs() < Math.pow(10, 3)){
                    document.getElementById('countTs').innerHTML = calculateTs().toFixed(3)+" tick/sec";
                }else{
                document.getElementById('countTs').innerHTML = scientificNote(calculateTs())+" tick/sec";
                }
            player.updateDimInfo(7);
        }

        function prestige(){
            player.dm = 10;
            player.dims = [0,0,0,0,0,0,0,0];
            player.dimsBought = [0,0,0,0,0,0,0,0];
            player.ts = 0;
            updateTs();
            compressionModule.update();
            releaseModule.update();
        }


        compressionModule.init();
        releaseModule.init();
       
        saveFile.load();
        var interval = 40;
        var timer = setInterval(income,interval);