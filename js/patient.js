function getKel(drugtype, crcl) {
	if(drugtype == 'vanc') {
		return 0.00083*crcl + 0.0044;
	}
}


var Patient = function() {
    var sex = 'M'
    var height = 0;
    var weight = 0;
    var abw = 0;
    var crcl = 0;
    var ibw = 0;
    var age = 0;
    var bee = 0;
    var mee = 0;
    var age = 0;
    var bsa = 0.0;
    var stressfactor = 1.0;
    var proteinreq = 1.0;
    var calcproteinreq = 0.0;	// gm/kg/day
    var goalfat = 0.3;
    var race = 'nonaa';

    this.setSex = function(sexVal) {
        this.sex = sexVal;
        return this;
    };
    
    this.setRace = function(newRace) {
    	this.race = newRace;
    	return this;
    }

    this.setAge = function(age) {
        this.age = age;
        return this;
    };
    
    this.calculateBSA = function() {
    	// Height is in cm in the Patient object
    	// Formula: 0.20247 x height (m)^0.725 x weight (kg)^0.425
    	b = 0.20247 * Math.pow(this.height/100, 0.725) * Math.pow(this.weight, 0.425);
    	this.bsa = b;
    	return this;
    };

    this.setHeight = function(value, units) {
        if (units == 'in') {
            this.height = 2.54 * value;
        } else {
            this.height = value;
        }
        this.setIBW();
        return this;
    };

    this.setWeight = function(value, units) {
        if (units == 'lbs') {
            this.weight = value / 2.2;
        } else {
            this.weight = value;
        }
        return this;
    };

    this.setIBW = function() {
        // Get height in inches
        h = this.height / 2.54;
        // get IBW base factor
        baseibw = (this.sex == 'M') ? 50 : 45.5;
        this.ibw = baseibw + ( (h - 60) * 2.3);
        return this;
    };

    this.setABWFactor = function(factor) {
        factor = factor || 0.4;
        if (this.weight < this.ibw) {
            this.abw = this.weight;
            return this;
        }
        this.abw = round((this.weight - this.ibw) * 0.4 + this.ibw, 2);
        return this;
    };
    
    this.setProteinReq = function(factor) {
    	factor = factor || 1.0;
    	this.proteinreq = factor;
    	this.calcproteinreq = this.proteinreq * this.abw;
    	return this;
    }

    this.calculateBEE = function() {
        // console.log(this.weight, this.age, this.height);
        if (this.sex == 'M') {
            this.bee = 66.5 + (13.75 * this.weight) + (5.003 * this.height) - (6.775 * this.age)
        } else {
            this.bee = 655.1 + (9.563 * this.weight) + (1.850 * this.height) - (4.676 * this.age)
        }
        this.bee = Math.floor(this.bee);
        return this;
    };

    this.calculateMEE = function(sf) {
        this.stressfactor = sf;
        this.mee = this.bee * this.stressfactor;
        this.mee = Math.floor(this.mee);
        return this;
    };
    
    this.getABW = function() {
    	return this.abw;
    }
    
    this.getWeight = function() {
    	return this.weight;
    }
};