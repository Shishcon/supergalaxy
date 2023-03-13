var heavenUpgrades = {

    upgradeList : [],


    init : () => {

        heavenUpgrades.upgradeList.push(new hUpgrade("ddBoost", "Gain a boost to your DadiDims per every heaven",1,0,1.1,"multiplier",player,"mpPrestigeCount"));
        heavenUpgrades.upgradeList.push(new hUpgrade("compBoost", "Gain a boost to your compressions per every heaven",1,0,1.05,"multiplier",player,"mpPrestigeCount"));
        heavenUpgrades.upgradeList.push(new hUpgrade("relBoost", "Gain a boost to your releases per every heaven",1,0,1.1,"multiplier",player,"mpPrestigeCount"));
        heavenUpgrades.upgradeList.push(new hUpgrade("startBoost1", "Always start with 1.00e5 DM after each compression, release and heaven",5,0,5,"unlock",player,"dm"));
        
        heavenUpgrades.upgradeList.push(new hUpgrade("dimAu", "Unlock DadiDim automator, so you won't have to buy dimensions manually",5,0,1.1,"unlock",player,"dm"));
        heavenUpgrades.upgradeList.push(new hUpgrade("relAu", "Unlock release automator, so you won't have to release manually",10,0,1.1,"unlock",player,"dm"));
        heavenUpgrades.upgradeList.push(new hUpgrade("compAu", "Unlock compression automator, so you won't have to compress manually",15,0,1.1,"unlock",player,"dm"));
        heavenUpgrades.upgradeList.push(new hUpgrade("heavAu", "Unlock heaven automator, so you won't have to get over heaven manually",30,0,1.1,"unlock",player,"dm"));
        /*
        heavenUpgrades.upgradeList.push(new hUpgrade("achivBoost", "Gain a boost to your DadiDims based on how many achievement you have unlocked.",20,0,1.5,"multiplier",player,"dm"));
        */

        heavenUpgrades.upgradeList.forEach(element => {
            element.printElement();
        });
    },
    update: () => {
        heavenUpgrades.upgradeList.forEach(element => {
            element.checkAvailability();
        });
    },

    getUpgrade: (name) => {
        
        return heavenUpgrades.upgradeList.find(element => element.name == name);
        
    },

    loadUnlocks: (list) => {
        for(i=0;i<heavenUpgrades.upgradeList.length;i++){
            if(list[i] == undefined){
                list[i] = false;
            }
            heavenUpgrades.upgradeList[i].unlocked = list[i];
        }
    },

    saveUnlocks: (list) => {
        for(i=0;i<heavenUpgrades.upgradeList.length;i++){
            list[i] = heavenUpgrades.upgradeList[i].unlocked;
        }
    }




}

class hUpgrade {
    constructor(name,description,costBase,costExp,benefit,type,effectObj,effectBase){
        this.name = name;
        this.desc = description;
        this.costBase = costBase;
        this.costExp = costExp;
        this.unlocked = false;
        this.benefit = benefit;
        this.effectObj = effectObj;
        this.effectBase = effectBase;
        this.type = type;
        this.element = document.createElement("div");
        this.element.classList = "compressBtn upgrade upgUnavailable";
        this.updateDesc();
        
        this.element.onclick = this.buy.bind(this);

    }
    updateDesc(){
        let descContent = "";
        descContent = '<div class="upgText">';
        if(this.type == "multiplier"){
            descContent += this.desc+"<br>Multiplier: "+this.benefit+"x<br>(currently: "+scientificNote(this.getPower(),2)+"x)";
        }else if(this.type == "unlock"){
            descContent += this.desc+"<br>";
        }
        descContent += "</div><br><span class=\"compressCost\">"+scientificNote(this.getCost(),0)+" MP</span";
        this.element.innerHTML = descContent;
        }

    getCost(){
        return this.costBase*Math.pow(10,this.costExp);
    }

    buy(){
        if(player.mp >= this.getCost() && !this.unlocked){
            player.mp -= this.getCost();
            this.unlocked = true;
            this.checkAvailability();
            heavenModule.update();
            heavenUpgrades.update();
            automatorModule.checkUnlocks();
        }
    }
    getPower(){
        if(!this.unlocked){
            return 1;
        }
        return Math.max(1,Math.pow(this.benefit,this.effectObj[this.effectBase]));
    }
    checkAvailability(){
        this.updateDesc();
        if(this.unlocked){
            this.element.classList.add("upgUnlocked");
            this.element.classList.remove("upgUnavailable");
            this.element.getElementsByClassName("compressCost")[0].innerHTML = "BOUGHT";
        }else if(player.mp >= this.getCost() && !this.unlocked){
            this.element.classList.remove("upgUnavailable");
        }else if(player.mp < this.getCost() && !this.unlocked){
            this.element.classList.add("upgUnavailable");
        }
    }
    printElement(){
        document.getElementById("upgradeTab").appendChild(this.element);
        this.checkAvailability();
    }
    

}




