class automator {
    constructor(effect,name,baseTime){
        this.effect = effect;
        this.name = name;
        this.baseTime = baseTime;
        this.level = 0;
        this.lastFire = 0;
        this.element = document.createElement("div");
        this.enabled = false;
        this.buffered = false;
    }
    use(){
        if((player.actualTime-this.lastFire > this.getFreq()&& this.enabled && this.level > 0) || this.buffered){
            if(this.effect()){
                this.lastFire = Date.now();
                this.buffered = false;
            }else{
                this.buffered = true;
            }
        }
    }
    getCost(){
        return Math.pow(2,this.level)
    }
    getFreq(){
        return Math.max(50,this.baseTime*Math.pow(2,-Math.max(0,this.level-1)));
    }
    upgrade(){
        if(player.mp >= this.getCost() && this.level > 0){
            player.mp -= this.getCost();
            this.level++;
        }
        automatorModule.update();
        heavenModule.update();
    }
    enable(){
        if(!this.enabled && this.level > 0){
            this.enabled = true;
        }else if(this.enabled){
            this.enabled = false;
        }
        this.update();
    }
    init(){
        this.element.classList.add("automator");
        let content = "";
        content += '<div class="autoTitle">'+this.name+'<br>AUTOMATOR</div>';
        content += '<div class="autoDelay">'+scientificNote(Math.max(500,this.baseTime*Math.pow(2,-this.level))/1000,2)+'s</div>';
        content += '<div class="autoEnabled">Disabled</div>'
        content += '<div class="compressBtn automatorBtn">UPGRADE<br><span class="compressCost">'+scientificNote(this.getCost(),0)+' MP</span></div>'
        this.element.innerHTML = content;
        this.element.getElementsByClassName("autoEnabled")[0].onclick = this.enable.bind(this);
        this.element.getElementsByClassName("automatorBtn")[0].onclick = this.upgrade.bind(this);
        document.getElementById("automatorTab").appendChild(this.element);
        this.update();
    }
    update(){
        if(this.level == 0){
            this.element.getElementsByClassName("autoEnabled")[0].classList.add("autoUnavailable");
            this.element.getElementsByClassName("automatorBtn")[0].getElementsByClassName("compressCost")[0].innerHTML = "LOCKED";
            this.element.getElementsByClassName("automatorBtn")[0].classList.add("autoUnavailable");
        }else {
            this.element.getElementsByClassName("autoEnabled")[0].classList.remove("autoUnavailable");
            this.element.getElementsByClassName("automatorBtn")[0].getElementsByClassName("compressCost")[0].innerHTML = scientificNote(this.getCost(),0) + " MP";
            if(this.level > 0 && player.mp >= this.getCost()){
                this.element.getElementsByClassName("automatorBtn")[0].classList.remove("autoUnavailable");
            }else{
                this.element.getElementsByClassName("automatorBtn")[0].classList.add("autoUnavailable");
            }
        }
        if(this.enabled){
            this.element.getElementsByClassName("autoEnabled")[0].style.backgroundColor = "cyan";
            this.element.getElementsByClassName("autoEnabled")[0].style.color = "black";
            this.element.getElementsByClassName("autoEnabled")[0].innerHTML = "ON";

        }else{
            this.element.getElementsByClassName("autoEnabled")[0].style.backgroundColor = "#222";
            this.element.getElementsByClassName("autoEnabled")[0].style.color = "white";
            this.element.getElementsByClassName("autoEnabled")[0].innerHTML = "OFF";
        }
        if(this.getFreq() >= 10000){
            this.element.getElementsByClassName("autoDelay")[0].innerHTML = scientificNote(this.getFreq()/1000,0)+'s';
        }else{
            this.element.getElementsByClassName("autoDelay")[0].innerHTML = scientificNote(this.getFreq()/1000,2)+'s';
        }


    }
}



var automatorModule = {
    timer : 0,
    automatorList : [],

    init(){
        automatorModule.automatorList.push(new automator(() => {ifBuyAll = true;buyAll(); return true;},"DadiDim", 1000));
        automatorModule.automatorList.push(new automator(releaseModule.use.bind(),"Release", 20000));
        automatorModule.automatorList.push(new automator(compressionModule.use.bind(),"Compression", 20000));
        automatorModule.automatorList.push(new automator(heavenModule.use.bind(),"Heaven", 180000));
        
        

        automatorModule.automatorList.forEach(element => {
            element.init();
        });
    },

    use(){
        automatorModule.automatorList.forEach(element => {
            element.use();
        });
    },

    update(){
        automatorModule.automatorList.forEach(element => {
            element.update();
        });
    },

    checkUnlocks(){
        if(heavenUpgrades.getUpgrade("dimAu").unlocked && automatorModule.automatorList[0].level == 0){
            automatorModule.automatorList[0].level = 1;
            automatorModule.automatorList[0].enable();
        }
        if(heavenUpgrades.getUpgrade("relAu").unlocked && automatorModule.automatorList[1].level == 0){
            automatorModule.automatorList[1].level = 1;
            automatorModule.automatorList[0].enable();
        }
        if(heavenUpgrades.getUpgrade("compAu").unlocked && automatorModule.automatorList[2].level == 0){
            automatorModule.automatorList[2].level = 1;
            automatorModule.automatorList[0].enable();
        }
        if(heavenUpgrades.getUpgrade("heavAu").unlocked && automatorModule.automatorList[3].level == 0){
            automatorModule.automatorList[3].level = 1;
            automatorModule.automatorList[0].enable();
        }
        automatorModule.update()
    },

    loadUnlocks: (list) => {
        for(i=0;i<automatorModule.automatorList.length;i++){
            if(list[i] == undefined){
                list[i] = 0;
            }
            automatorModule.automatorList[i].level = list[i];
        }
    },

    saveUnlocks: (list) => {
        for(i=0;i<automatorModule.automatorList.length;i++){
            list[i] = automatorModule.automatorList[i].level;
        }
    }
}