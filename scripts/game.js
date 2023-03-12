


function scientificNote(liczba, precise){
           
            if(liczba<1000){
                if(precise){
                    return liczba.toFixed(precise);
                }else{
                    return Math.floor(liczba);
                }
                
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
                if(player.dm >= player.getDimCost(dim) && player.getDimCost(dim) != Infinity){
                player.dm -=  player.getDimCost(dim);
                player.dims[dim]++;
                player.dimsBought[dim]++;
                if(player.dm >= player.getDimCost(dim) && player.dimsBought[dim]%10 != 0){
                    player.buyDim(dim);
                }
                player.updateDimInfo(dim);
                return true;
                }
            },
            bulkBuyDim : (dim) => {
                while(player.buyDim(dim));
            },

            updateDimInfo : (dim) => {
                if(player.getDimCost(dim) != Infinity){
                    document.getElementById('buyD'+(dim+1)).innerHTML = scientificNote(player.getDimCost(dim))+" DM";
                    
                }else{
                    document.getElementById('buyD'+(dim+1)).innerHTML = "Infinity";
                    

                }
                if(player.dims[dim] != Infinity){
                    document.getElementById('countD'+(dim+1)).innerHTML = scientificNote(player.dims[dim])+"x";
                }else{
                    document.getElementById('countD'+(dim+1)).innerHTML = "Infinite";
                }
                
                document.getElementById('multiD'+(dim+1)).innerHTML = "x"+scientificNote(Math.pow(2,Math.floor(player.dimsBought[dim]/10))*releaseModule.getPower()*heavenUpgrades.getUpgrade("ddBoost").getPower()*heavenModule.getPower(),1);
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
                saveFile.data.mp = player.mp;
                saveFile.data.mpPrestigeCount = player.mpPrestigeCount;
                heavenUpgrades.saveUnlocks(saveFile.data.unlockList);
                window.localStorage.setItem("saveData",JSON.stringify(saveFile.data));
                showNotification("Game Saved!")
            },
            reset:()=>{
                window.localStorage.removeItem("saveData");
                prestige();
            },
            load:()=>{
                if(window.localStorage.length == 0){
                    return;
                }

                saveFile.data = JSON.parse(window.localStorage.getItem("saveData"));

                player.dm = 10;
                player.ts = 0;
                player.dims = [0,0,0,0,0,0,0,0];
                player.dimsBought = [0,0,0,0,0,0,0,0];
                player.compressions = 0;
                player.releases = 0;
                player.mp = 0;
                player.mpPrestigeCount = 0;
                if(saveFile.data.unlockList == undefined){
                    saveFile.data.unlockList = [];
                }

                if(saveFile.data.dm){
                    player.dm = saveFile.data.dm;
                }
                if(saveFile.data.ts){
                    player.ts = saveFile.data.ts;
                }
                if(saveFile.data.dims){
                    player.dims = saveFile.data.dims;
                }
                if(saveFile.data.dimsBought){
                    player.dimsBought = saveFile.data.dimsBought;
                }
                if(saveFile.data.compressions){
                    player.compressions = saveFile.data.compressions;
                }
                if(saveFile.data.releases){
                    player.releases = saveFile.data.releases;
                }
                if(saveFile.data.mp){
                    player.mp = saveFile.data.mp;
                }
                if(saveFile.data.mpPrestigeCount){
                    player.mpPrestigeCount = saveFile.data.mpPrestigeCount;
                }
                heavenUpgrades.loadUnlocks(saveFile.data.unlockList);
                
                

                updateTs();
                compressionModule.update();
                releaseModule.update();
                heavenModule.update();
                heavenUpgrades.update();
            },
            data : {
                dm : 10,
                mp : 0,
                ts : 0,
                dims : [],
                dimsBought : [],
                compressions : 0,
                releases : 0,
                mpPrestigeCount : 0,
                unlockList : [],
            }
            
        }
        document.getElementById('saveBtn').onclick = saveFile.save;

        function incrementFormula(dim){

            let incrementation = 1;

            incrementation *= player.dims[dim]; //dimCount

            incrementation *= calculateTs(); //Tickspeed


            incrementation *= Math.pow(2,Math.floor(player.dimsBought[dim]/10)) //Buy 10 multiplier

            incrementation *= releaseModule.getPower(); //Release bonus

            incrementation *= heavenUpgrades.getUpgrade("ddBoost").getPower(); //10% boost

            incrementation *= heavenModule.getPower();

            if(dim == 0){ //Display income/sec
                if(player.dm != Infinity){
                    document.getElementById('cashIncome').innerHTML = scientificNote(incrementation,1);
                }else{
                    document.getElementById('cashIncome').innerHTML = "Infinite";
    
                }
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
            if(player.dm != Infinity){
                document.getElementById('cashCount').innerHTML = scientificNote(player.dm);
            }else{
                document.getElementById('cashCount').innerHTML = "Infinite";

            }

            
            
            buyAll();
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
            if(player.dm >= Math.pow(10,3) * Math.pow(10, player.ts)  && Math.pow(10,3) * Math.pow(10, player.ts) != Infinity){
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
                if(player.dm >= player.getDimCost(i) && player.getDimCost(i) != Infinity){
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
            
            if(player.dm >= compressionModule.getCost() && compressionModule.getCost() != Infinity){
                document.getElementById('compressBtn').classList.remove("relInactive")
                document.getElementById('compressBtn').classList.add("compActive")
            }else{
                document.getElementById('compressBtn').classList.add("relInactive")
                document.getElementById('compressBtn').classList.remove("compActive")
            }
            

            //release
            if(player.dm >= releaseModule.getCost() && releaseModule.getCost() != Infinity){
                document.getElementById('releaseBtn').classList.remove("relInactive")
                document.getElementById('releaseBtn').classList.add("relActive")
            }else{
                document.getElementById('releaseBtn').classList.add("relInactive")
                document.getElementById('releaseBtn').classList.remove("relActive")
            }

            if(player.mpPrestigeCount > 0 || player.dm == Infinity){
                document.getElementById('heavenModule').style.display = "block";
            }else{
                document.getElementById('heavenModule').style.display = "none";
            }

            if(player.dm == Infinity){
                document.getElementById('heavenBtn').classList.remove("relInactive")
                document.getElementById('heavenBtn').classList.add("heavenActive")
            }else{
                document.getElementById('heavenBtn').classList.add("relInactive")
                document.getElementById('heavenBtn').classList.remove("heavenActive")
            }

        }

        function showBuyable(block){
            block.classList.remove("cantBuy");
            
        }
        function hideBuyable(block){
            block.classList.add("cantBuy");
        }

        function buyAll(){
            if(!ifBuyAll){
                return;
            }
            buyTs(true);
            for(i=player.dims.length-1;i>=0;i--){
                player.bulkBuyDim(i);
                
            }
            
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

        document.getElementById('barD1').onclick = function(){player.bulkBuyDim(0)};
        document.getElementById('barD2').onclick = function(){player.bulkBuyDim(1)};
        document.getElementById('barD3').onclick = function(){player.bulkBuyDim(2)};
        document.getElementById('barD4').onclick = function(){player.bulkBuyDim(3)};
        document.getElementById('barD5').onclick = function(){player.bulkBuyDim(4)};
        document.getElementById('barD6').onclick = function(){player.bulkBuyDim(5)};
        document.getElementById('barD7').onclick = function(){player.bulkBuyDim(6)};
        document.getElementById('barD8').onclick = function(){player.bulkBuyDim(7)};

        var ifBuyAll = false;
        document.getElementById('btnMax').onpointerdown = function(){ifBuyAll = true;};
        //document.getElementById('btnMax').ontouchstart = function(e){ifBuyAll = true;e.preventDefault()};
        document.getElementById('btnMax').onpointerup = function(){ifBuyAll = false;};
        //document.getElementById('btnMax').ontouchend = function(e){ifBuyAll = false;e.preventDefault()};

        //TS upgrades
        document.getElementById('buyTs').onclick = function(){buyTs()};
        document.getElementById('barTs').onclick = function(){buyTs(true)};
        
        
        function calculateTs(){
            let ticksMulti = player.tsMulti+1;
            ticksMulti += compressionModule.getPower(); //Compression bonus
                       
            return Math.pow(ticksMulti,player.ts)
        }

        function buyTs(max){
            if(max){
                
                while(player.dm >= Math.pow(10,3) * Math.pow(10, player.ts) && Math.pow(10,3) * Math.pow(10, player.ts) != Infinity){
                    player.dm -= Math.pow(10,3) * Math.pow(10, player.ts);
                    player.ts++;
                    
                }
                updateTs();
                return;
            }
            if(player.dm >= Math.pow(10,3) * Math.pow(10, player.ts) && Math.pow(10,3) * Math.pow(10, player.ts) != Infinity){
                player.dm -= Math.pow(10,3) * Math.pow(10, player.ts);
                player.ts++;
                
                updateTs();
            }
            
        }

        function updateTs(){
            document.getElementById('buyTs').innerHTML = scientificNote(Math.pow(10,3) * Math.pow(10, player.ts));
            document.getElementById('multiTs').innerHTML = "Bought " + player.ts + " times";
                if(calculateTs() < Math.pow(10, 3)){
                    document.getElementById('countTs').innerHTML = calculateTs().toFixed(3)+"<br> tick/sec";
                }else{
                document.getElementById('countTs').innerHTML = scientificNote(calculateTs())+"<br> tick/sec";
                }
            player.updateDimInfo(7);
        }

        function prestige(){
            player.dm = 10;
            if(heavenUpgrades.getUpgrade("startBoost1").unlocked){
                player.dm = Math.pow(10,heavenUpgrades.getUpgrade("startBoost1").benefit);
            }
            player.dims = [0,0,0,0,0,0,0,0];
            player.dimsBought = [0,0,0,0,0,0,0,0];
            player.ts = 0;
            updateTs();
            compressionModule.update();
            releaseModule.update();
            heavenModule.update();
            heavenUpgrades.update();
        }

        
        heavenModule.init();
        heavenUpgrades.init();
        compressionModule.init();
        releaseModule.init();
        
        updateTs();
        
       
        saveFile.load();
        var interval = 40;
        var timer = setInterval(income,interval);