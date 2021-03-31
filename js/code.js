var APP = APP || {};

function round(dec, numPlaces) {
	return Math.round(dec * Math.pow(10, numPlaces)) / Math.pow(10, numPlaces);
}

function roundToNearest(value, roundTo) {
	v = Math.floor(value / roundTo);
	// if the modulo is > 1/2 the roundTo, round up to next interval, else keep current
	if ((value % roundTo) / value > 0.5) {
		v += roundTo;
	}
	return v * roundTo;
}

function closest(num, arr) {
	var curr = arr[0];
	var diff = Math.abs(num - curr); 
	for (i = 0; i < arr.length; i++) {
    	var newdiff = Math.abs(num - arr[i]);
    	if (newdiff < diff) {
    		diff = newdiff;
    		curr = arr[i];
    	}
    }
	return curr;
}

function sampleData() {
	$("#txtAge").val('41');
	$("#txtHeight").val('170.18');
	$("#txtWeight").val('90.8');
}

function nextVancInterval(validints, halflife) {
	// Find first valid interval that's > 1.4x the half life
	mins = halflife * 1.4;
	for (var i = 0; i<validints.length; i++) {
		if (validints[i] > mins) {
			return validints[i];
		}
	}
}

APP.TPN = (function($) {
    var ptinfo = new Patient();
    var pntype = 'tpn';
    var fatvol = 0.0;
    var aaconc = 0.0;
    var choconc = 0.0;
    var rate = 0;
    var totalfluid = 0;
    var dailykcal = 0.0;
    var dailyprotein = 0.0;
    var useTNA = false;
    var tnaType = null;
    
    var setFatVolume = function(vol) {
    	fatvol = vol || 0;
    };
    
    var setAAConcentration = function(conc) {
    	aaconc = conc || 0.0;
    };
    
    var setCHOConcentration = function(conc) {
    	choconc = conc || 0.0;
    };
    
    var getDailyKcal = function() {
    	return dailykcal;
    };
    
    var getDailyProtein = function() {
    	return dailyprotein;
    };
    
    var getFatPercentage = function() {
    	if (tnaType == 'kabi') {
    		return Math.floor(390 / 850 * 100);
    	} else if(tnaType == 'peri') {
    		return Math.floor(350 / 675 * 100);
    	} else {
    		return Math.floor(((fatvol * 2) / dailykcal)*100);
    	}
    };
    
    var setRate = function(newRate) {
    	rate = newRate || 0;
    	totalfluid = 24 * rate;
    	if (useTNA) {
    		if(tnaType == 'kabi') {
    			// Kabiven = 850kcal/L, 390kcal/L lipid, 330kcal/L Dextrose, 33.1gm/L AA
    			dailyprotein = totalfluid * 33.1 / 1000;
    			dailykcal = totalfluid / 1000 * 850;
    		} else {
    			// Perikabiven = 675 kcal/L, 350 kcal/L lipid, 230kcal/L Dextrose, 23.6gm/L AA
    			dailyprotein = totalfluid * 23.6 / 1000;
    			dailykcal = totalfluid / 1000 * 675;
    		}
    	} else {
	    	if (fatvol > 0 && aaconc > 0 && choconc > 0 && rate > 0) {
	    		// Calc 24 hr protein and carbs
	    		dailyprotein = totalfluid * aaconc;
	    		dailykcal = (totalfluid * choconc * 4) + (fatvol * 2);
	    		if (pntype == 'ppn') {
	    			dailykcal += (dailyprotein * 3.4);
	    		}
	    	}
    	}
    };
    
    var setType = function(newType) {
    	pntype = newType;
    };
    
    var setTNA = function(kabiven, perikabiven) {
    	useTNA = true;
    	if (kabiven) {
    		tnaType = 'kabi';
    	} else {
    		tnaType = 'peri';
    	}
    };
    
    var printDebugInfo = function() {
    	//console.log(fatvol, aaconc, choconc, totalfluid, dailykcal, dailyprotein);
    };

    return {
        'ptinfo': ptinfo,
        'setFatVolume': setFatVolume,
        'setAAConcentration': setAAConcentration,
        'setCHOConcentration': setCHOConcentration,
        'printDebugInfo': printDebugInfo,
        'pntype': pntype,
        'dailykcal': getDailyKcal,
        'dailyprotein': getDailyProtein,
        'setRate': setRate,
        'getFatPercentage': getFatPercentage,
        'setPNType': setType,
        'setTNA': setTNA
    };
})(jQuery);

