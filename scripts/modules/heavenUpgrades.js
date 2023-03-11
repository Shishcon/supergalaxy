var heavenUpgrades = {

    upgradeList : [],


    init : () => {

        heavenUpgrades.upgradeList.push(new hUpgrade("ddBoost", "Gain a boost to your DadiDims per every heaven",1,0,1.1,"multiplier",player,"mpPrestigeCount"));
        heavenUpgrades.upgradeList.push(new hUpgrade("compBoost", "Gain a boost to your compressions per every heaven",1,0,1.05,"multiplier",player,"mpPrestigeCount"));
        heavenUpgrades.upgradeList.push(new hUpgrade("relBoost", "Gain a boost to your releases per every heaven",1,0,1.1,"multiplier",player,"mpPrestigeCount"));


        heavenUpgrades.upgradeList.forEach(element => {
            element.printElement();
        });
    },
    update: () => {
        heavenUpgrades.upgradeList.forEach(element => {
            element.checkAvailability();
            console.log(element)
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
        if(this.type = "multiplier"){
            this.element.innerHTML = this.desc+"<br>Multiplier: "+this.benefit+"x<br>(currently: "+scientificNote(this.getPower(),2)+"x)<br><span class=\"compressCost\">"+scientificNote(this.getCost(),2)+" MP</span>";
        }else if(this.type = "unlock"){
            this.element.innerHTML = this.desc+"<br><span class=\"compressCost\">"+scientificNote(this.getCost(),2)+" MP</span>";
        }
    }

    getCost(){
        return this.costBase*Math.pow(10,this.costExp);
    }

    buy(){
        if(player.mp >= this.getCost()){
            player.mp -= this.getCost();
            this.unlocked = true;
            this.checkAvailability();
            heavenModule.update();
            heavenUpgrades.update();
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




