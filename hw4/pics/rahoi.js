/* jslint laxbreak: true, forin: false, white: false, onevar: false, debug: true, plusplus: false, maxerr: 100, evit:true */

/* global process:true, require:true */

function fisherYates ( myArray ) {
  var i = myArray.length;
  if ( i === 0 ){return false;}
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}

var AI = require('./ai').ai;

var actorBase = {
	giveMoney : function(amount, stayQuiet){
		if (typeof(this.money)!=="undefined"){
			this.money += amount;
			if (!stayQuiet){
				this.log(this.name, "got", this.name+" got $"+amount);
			}
		}
	},
    giveTiles : function(tiles, val, owners){
        var ts = tiles, value = val || true;

        if (!Array.isArray(ts)){
            ts = [ts];
        }
        for (var x=0; x< ts.length; x++){
            this.tiles[ts[x]] = value;
            if (owners){
                owners[ts[x]] = this;            
            }
        }
        
        this.setSize();
    },
    pickTiles : function(howMany){
    	var tiles =[], bag = Object.keys(this.tiles);
		for (var x=0; x< howMany; x++){
			var tile = bag.splice(Math.floor(bag.length * Math.random()), 1)[0];
			tiles.push(tile);
		}
		return tiles;
    },
    setSize : function(){
        var guys = Object.keys(this.tiles);        
        var s = this.size = guys.length;
        // 0 -6 this.price = ((s - 2) * 100) + this.initialPrice;
        // 7 - 10  = 6
        // 11 - 20 = 7       
        // 21 - 30 = 8
        // 31 - 40 = 9
        // 41+ = 10
        if (this.price){
            if (s >= this.config.finalShelf){
                s = 10; 
            }else if (s >= 31){
                s = 9;
            }else if (s >= 21){
                s = 8;
            }else if (s >= 11){
                s = 7;
            }else if (s >= 6){
                s = 6;
            }
            this.price = ((s - 2) * 100) + this.initialPrice;
            this.bonus = this.price * 10;
        }
    },
    takeAwayTiles : function(tiles){
    	var ts = tiles;
        if (typeof(tiles)==="undefined"){
            ts = Object.keys(this.tiles);
        }else if (typeof(tiles)==="number"){
        	// ts = take some randomly
        	ts = this.pickTiles(tiles);
        }else if (!Array.isArray(ts)){
            ts = [ts];
        }
        
        // remove these tiles from this.tiles
        for (var x=0; x< ts.length; x++){
            delete this.tiles[ts[x]];
        }

        this.setSize();
        
        return ts;
    }
};

var newActor = function(name, type, logFunc){
    var props = {
        name : {value : name, enumerable: true, writable: false},
        type : {value : type, enumerable: true, writable: false},
        tiles : {value : {}, enumerable: true, writable: true},
        size : {value : 0, enumerable: true, writable: true}
    };
    
    if (logFunc){
    	props.log = {value : logFunc, enumerable : false};
    }
    return props;
};

var baseGame = {
        addEvent : function(sub, verb, txt){
        	var evt = {
        		subject : sub,
        		verb : verb,
        		text : txt
        	};
            console.log(txt);
            this.events.unshift(evt);
        },
        getOne : function(name){
        	if (typeof(name)!=="string"){
        		return name
        	}
            var p = null, group = this.players;

            for (var i=0; i< group.length; i++){
                var playa = group[i];
                if (playa.name === name){
                    return playa;
                }
            }
            //console.log("can't find player "+name +" in " +JSON.stringify(this.players));
            return null;
        },
        start : function(){
            var ps = this.players, 
                bag = this.bag, 
                board = this.board;
                
            fisherYates(ps);
            
            // hand out tiles
            for (var i=0; i< ps.length; i++){
                var playa = ps[i];
                playa.turn = false;
                playa.giveTiles(bag.takeAwayTiles(this.defs.startingTiles), null, this.owners);
            }
            board.giveTiles(bag.takeAwayTiles(ps.length * 10), "board", this.owners);
            ps[0].turn = true;
            this.changeStatus("playing");
        },
        addPlayer : function(name){
            var player = this.newPlayer(name);
            // TODO a better mechanism for creating bots
            if (name.indexOf("bot") !== -1){
            	player.isBot = true;
            }else{
            	player.isBot = false;
            }
            // setup companies
            for (var n=0; n< this.defs.compnames.length; n++){
                player.shares[this.defs.compnames[n]] = 0;
            }
            this.players.push(player);
            this.people[name] = player;
        },
        guy : function(isMerge){
            var turn = this.turn;
            if (isMerge){
                turn = this.mergeTurn; 
            }
            return this.players[turn];
        },
        canEnd : function(){
            var c, can = true, 
                comps = Object.keys(this.companies);
            for (x=0; x< comps.length; x++){
                c = this.companies[comps[x]];
                if (c.size >= this.defs.finalShelf){
                    return true;
                }
                if (c.status === "active" && c.size < this.defs.safe){
                    can = false;
                }
            }
            // all companies safe
            // one company larger than 41
            // no playable tiles
            return can;
        },
        end : function(should){
        	if (should){
        		var comps = Object.keys(this.companies);
        		comps.forEach(function(k){
        			var c = this.companies[k];
        			if (c.status === "active"){
						c.kill();
						c.status = "available";
						this.players.forEach(function(p){
							if (p.shares[c.name]){
								this.buySellShares(p, [{
									company : c.name
								}], true);
							}
						}, this);
        			}
        		}.bind(this));
        		var max = 0, victor = null;
        		
        		this.players.forEach(function(p){
					if (p.money > max){
						max = p.money;
						victor = p;
					}
				}, this);
				
				this.addEvent(this.guy(), "ended", "The game is over. "+victor.name+ " won.");
				this.changeStatus("over");
        	}else{
        		this.changeStatus();
        	}
        },
        canBuy : function(){
            var c, x, comps = Object.keys(this.companies),
                p = this.guy();
            for (x=0; x< comps.length; x++){
                c = this.companies[comps[x]];
                if (c.status === "active" && c.shares > 0 && p.money > c.price){
                    return true;
                }  
            }
            return false;
        },
        canStart : function(){
        	// number of companies available to start
            var startable = [], 
            	x, comps = Object.keys(this.companies);
            
            for (x=0; x< comps.length; x++){
                c = this.companies[comps[x]];
                if (c.status === "available"){
                    startable.push(c);
                }
            }
            return startable;
        },
        
        changeStatus : function(status){
            var next = status, s = this.status;

            if (status){
                this.status = next;
                console.log("changing status to "+next);
                this.botPlay();
                return;
            }
            if (s === "open" || s === "buying" || s === "ending"){
            	if (s === "buying" && this.canEnd()){
					next = "ending";
                }else{
                	next = this.nextPlayer();
                }
            }else if (s === "playing" || s === "selling" || s === "starting" || s === "merging"){
                if (this.canBuy()){
                    next = "buying";
                }else{
                	if (this.canEnd()){
						next = "ending";
					}else{
						next = this.nextPlayer();
					}
                }
            }else if (s === "deciding"){
                next = "merging";
            }else if (s === "ending"){
            	next = this.nextPlayer();
            }
            
            console.log("changing status to "+next);
            this.status = next;
            this.botPlay();
        },
        botPlay : function(){
        	var guy = this.guy();
            if (guy.isBot){
            	console.log(guy.name+" is a bot");
            	AI.ask(this);
            }
        },
        playTile : function(tile){
            var owner=null, 
                companies = {}, 
                tiles =[tile],
                numCompanies = 0, 
                onBd = 0, 
                label="board",
                noCompanies = {
                    code: -1, 
                    message: "no companies are available to start"
                };
                
            console.log("playing "+tile);
            var holder = this.owners[tile];
            console.log(holder.name+" owns that tile");
                        
            // find current status
            if (holder.type !== "bag" && holder.type !== "player"){
            	return {
            	    code: -1, 
            	    message: "illegal play"
            	};
            }else{
                var neighbors = this.findAdjTiles(tile);
                console.log(tile+" is neighbored by "+neighbors.join(", "));
                for (var x=0; x< neighbors.length; x++){
                    var t = neighbors[x];
                    owner = this.owners[t];
                    
                    console.log(t + " is owned by "+owner.name);
                    
                    if (owner.type === "board"){
                        onBd++;
                    	var blob = this.getBlob(t, {});
                        tiles = tiles.concat(blob);
                    }else if (owner.type === "company"){
                        tiles.push(t);
                        companies[owner.name] = owner;
                    }
                }
                
                numCompanies = Object.keys(companies).length;
                console.log(tile + " is neighbored by "+numCompanies + " companies and "+onBd+ " boardTiles");
                
                if (numCompanies === 1){
                	console.log("growing");
                    // growing a company
                    holder.takeAwayTiles(tile);
                    Object.keys(companies).forEach(function(c){
                        companies[c].giveTiles(tiles, null, this.owners);
                        label = companies[c].name;
                    }.bind(this));
                    this.addEvent(holder.name, "played", holder.name+" played "+ tile);
                    this.changeStatus();
                    this.board.giveTiles(tiles, label);
                    
                }else if (numCompanies > 1){
                    // merger OR DEAD TILE TODO
                    this.merge(tile, tiles, holder, companies);
                    
                    // straightforward merger?
                    // if so, do it
                    // if not, prompt for input
                }else if (onBd > 0){
                    // start a company
                    var startable = this.canStart();
                    if (startable.length > 1){
						this.changeStatus("starting");
						holder.takeAwayTiles(tile);
						this.quarantine.giveTiles(tiles, null, this.owners);
						this.addEvent(holder.name, "played", holder.name+" played "+ tile);
						this.board.giveTiles(tiles, "start");
                    }else if (startable.length === 1){
                    	holder.takeAwayTiles(tile);
                    	this.quarantine.giveTiles(tiles, null, this.owners);
                    	this.addEvent(holder.name, "played", holder.name+" played "+ tile);
                    	this.startCompany(startable[0].name)
                    }else{
                        return noCompanies;
                    }
                }else{
                    // just playing it alone on the board
                    console.log("placed "+tiles.join(", ")+" on the board");
                    this.addEvent(holder.name, "played", holder.name+" played "+ tile);
                    this.changeStatus();
                    holder.takeAwayTiles(tile);
                    this.board.giveTiles(tiles, label, this.owners);
                }
            }
            return false;
        },
        merge : function(tile, blob, holder, companies){
            var allSafe = true, tie = false, sizes={};
            Object.keys(companies).forEach(function(c){
                var c = companies[c];
                if (c.size < this.defs.safe){
                    allSafe = false;
                }
                if (!sizes[c.size]){
                    sizes[c.size] = [];
                }else{
                    tie = true;
                }
                sizes[c.size].push(c);                
            }.bind(this));
            
            holder.takeAwayTiles(tile);
            /*
                holder.takeAwayTiles(tile);
                    this.quarantine.giveTiles(tile, null, this.owners); 
            */
            if (allSafe){
                // this tile is dead
                this.board.giveTiles(tile, "dead", this.owners);
                this.addEvent(tile, "is dead", tile+" is dead");
                return;
            }else if (tie){
                // gotta set the status to "deciding" and ask the user what to do
                this.addEvent(holder.name, "played", holder.name+" played "+ tile);
                this.board.giveTiles(tile, "merging");
                this.setupMergers(sizes);
                this.changeStatus("deciding");
            }else{
                // straightforward
                this.addEvent(holder.name, "played", holder.name+" played "+ tile);
                this.board.giveTiles(tile, "merging");
                this.setupMergers(sizes);
                this.changeStatus("merging");
                this.startMerger();
            }
            this.quarantine.giveTiles(blob, null, this.owners);
            return;
        },
        setupMergers : function(sizes){
        	// sizes is a hash of arrays
        	var m = this.merger = {
        		// winner : guy
        		// loser : guy2
        		// order : [guy2, guy3, guy4]
        		order : []
        	};
        	        	
        	// hand out bonuses for the smallest company first
			var uniqueSizes = Object.keys(sizes).sort(function(a,b){return b-a;});
			
			for (var x=0; x< uniqueSizes.length; x++){
				var level = sizes[uniqueSizes[x]];
				if (level.length === 1){
					level = level[0];
				}
				m.order.push(level);
			}
			
			if (!Array.isArray(m.order[0])){
				// only one winner
				m.winner = m.order.shift();
				
				if (!Array.isArray(m.order[0])){
					m.loser = m.order.shift();
				}
			}
        },
        decide : function(merger){
        	this.merger = merger;
        	merger.order = [];
        	if (merger.three){
        		merger.order.push(merger.three);
        	}
        	if (merger.four){
        		merger.order.push(merger.four);
        	}
        	
        	this.changeStatus("merging");
        	
        	try {
				this.startMerger();
			}catch(e){
				console.log(e.message);
			}
        },
        startMerger : function(){
        	var m = this.merger;			
        	var txt = this.guy().name +" merged " + m.loser.name+ " into " +m.winner.name;
			this.addEvent(this.guy().name, "merged", txt);
			
            m.winner.status = "growing";
            m.loser.kill();
                    
            this.nextMergeTurn();
            // winner.giveTiles(loser.takeAwayTiles, null, this.owners);
        },
        rebalance : function(company){
        	var sizes = {};
        	
        	this.players.forEach(function(p){
        		var howMany = p.shares[company.name];
        		if (howMany > 0){
        			if (!sizes[howMany]){
        				sizes[howMany] = [];
        			}
        			sizes[howMany].push(p);
        		}
        	});
        	
        	var szs = Object.keys(sizes).sort(function(a,b){return b-a;});
        	company.maj = sizes[szs[0]] || [];
        	if (company.maj.length === 1 && szs.length > 1){
        		company.min = sizes[szs[1]];
        	}
        },
        newPlayer : function(name){
        	var pobj = newActor(name, "player", this.addEvent.bind(this));
        	pobj.tiles.enumerable = true;
        	
            var player = Object.create(actorBase, pobj);
            player.money = this.defs.cash;
            player.shares = {};
            
            return player;
        },
        startCompany : function(name){
            var company = this.companies[name],
                player = this.guy();
            if (company){
                company.status = "active";
                var guys = this.quarantine.takeAwayTiles();
                company.giveTiles(guys, null, this.owners);
                this.board.giveTiles(guys, name);
                
                this.addEvent(player.name, "started", player.name +" started "+ company.name);
                // give the player a complimentary share
                player.shares[name] += 1;
                company.shares -= 1;
                this.rebalance(company);
                
                //this.addEvent(player.name, "got", "1 share", company.name);
            }else{
                // problem
                throw("that company doesn't exist!");
            }
            this.changeStatus();
            // TODO - optional sell phase
        },
        buySellShares : function(playerName, comps, isSell){
            // player name, array of { company : "saxson", shares : 3 }
            var name, c, num, i=0, verb = "bought", player = this.getOne(playerName);
            
            if (comps && comps.length){
                for (i=0; i< comps.length; i++){
                    name = comps[i].company;
                    c = this.companies[name];
                    num = comps[i].shares || player.shares[name];
                    
                    if (isSell){
                        num *= -1;
                        verb = "sold"
                    }
                    var spend = Math.round(c.price * num);
                    player.money -= spend;
                    player.shares[name] += num;
                    c.shares -= num;
                    this.rebalance(c);
                    if (isSell){
                    	num *= -1;
                    	spend *= -1;
                    }
                    var txt = player.name+ " "+verb+" "+ num + " " +c.name+ " for $"+spend;
                    this.addEvent(player.name, verb, txt);
                }            
            }else{
            	this.addEvent(player.name, verb, player.name+ " bought nothing");
            }
            
            return;
            // TODO - optional sell phase
        },
        nextPlayer : function(){
            // give outgoing player his tiles
            var guy = this.guy();
            // find dead tiles
            var needs = this.defs.startingTiles - guy.size;
            guy.giveTiles(this.bag.takeAwayTiles(needs), null, this.owners);
                        
            if (this.status !== "open"){
                this.turn++;
            }
            if (this.turn === this.players.length){
                this.turn = 0;
            }
            for (var x=0; x< this.players.length; x++){
                this.players[x].turn = false;
            }
            this.guy().turn = true;
            return "playing";
        },
        mergePlay : function(playerName, trade, sell){
        	var txt, winner = this.merger.winner, 
        		loser = this.merger.loser, 
        		guy = this.getOne(playerName),
        		diff = trade % this.defs.tradeRatio;
        		// if player sent too much, round off the amount 
				trade -= diff;
        	
        	if (trade > 0){
				var tradeIn = Math.floor(trade/this.defs.tradeRatio); //guy.shares[loser.name];
				
				// take away <trade> num shares of loser
				guy.shares[loser.name] -= trade;
				loser.shares += trade;
				
				// give <tradeIn> num shares of winner
				guy.shares[winner.name] += tradeIn;
				winner.shares -= tradeIn;
				
				txt = guy.name+ " traded "+trade+" of "+loser.name+ " for "+tradeIn+ " of "+winner.name;
				this.addEvent(guy.name, "traded", txt);
			}
			
			if (sell > 0){
				guy.shares[loser.name] -= sell;
				var total = loser.price * sell;
				guy.giveMoney(total, false);
				loser.shares += sell;
				txt = guy.name+" sold "+sell+ " shares of "+loser.name+" for $"+total;
				this.addEvent(guy.name, "sold", txt);
			}
			
			if (sell === 0 && trade === 0){
				txt = guy.name+" kept all "+loser.name;
				this.addEvent(guy.name, "traded", txt);
			}else{
				this.rebalance(loser);
				this.rebalance(winner);
			}
						
			this.nextMergeTurn();
        },
        getMergerCompanies : function(){
        	// TODO - delete this function
        	var o = {};
        	
        	var comps = Object.keys(this.companies);
        		
        	comps.forEach(function(c){
        		if (c.status === "dying"){
        			o.loser = c;
        		}else if (c.status === "growing"){
        			o.winner = c;
        		}
        	});
        	
        	return o;
        },
        nextMergePlayer : function(){
        	var begin;
        		
        	if (this.mergeTurn === null){
                begin = this.turn;
            }else{
            	begin = this.mergeTurn + 1;
            	if (begin === this.players.length){
                    begin = 0;
                }
                if (begin === this.turn){
					return null;            
				}
            }
            
            this.mergeTurn = begin;
            return this.players[begin];
        },
        nextMergeTurn : function(){
            var guy;
			
			for (var x=0; x< this.players.length; x++){
				guy = this.nextMergePlayer();
				if (!guy){
					this.endMerger();
                    return;
				}else if (this.hasShares(guy, this.merger.loser)){
					break;
				}
			}
        },
        endMerger : function(){
        	// end this merger, start any others
			this.mergeTurn = null;		
			// this loser is done
			// give his tiles to the victor	
			this.merger.loser.status = "available";
			
			var tiles = this.merger.loser.takeAwayTiles();
			
			this.merger.winner.giveTiles(tiles, null, this.owners);
			this.board.giveTiles(tiles, this.merger.winner.name);
			
			// if this is the last part of a larger merger, onto the next merger.
			
			if (this.merger.order.length > 0){
				console.log("more mergers");
				// there are other mergers
				this.merger.loser = this.merger.order.pop();
				this.startMerger();
				
			}else{
				console.log("all done this merger");
				// all done - carry on
				// set the status of the winner to "active"
				this.merger.winner.status = "active";
								
				// take all the tiles from loser and give to winner
				tiles = this.quarantine.takeAwayTiles();
				this.merger.winner.giveTiles(tiles, null, this.owners);
				
				this.board.giveTiles(tiles, this.merger.winner.name);
				// take all tiles from the quarantine, too
				
				this.merger = {};
				
				// go to either buying or selling
				this.changeStatus();
			}			
			
        },
        hasShares : function(guy, company){
            var x, comps = Object.keys(guy.shares);
            
            for (x=0; x< comps.length; x++){
                if (company.name === comps[x] && guy.shares[comps[x]]){
                    return true;
                }
            }
            
            return false;
        },
        newCompany: function(name, initialPrice){
            var comp = Object.create(actorBase, newActor(name, "company", this.addEvent.bind(this)));
            comp.status = "available";
            comp.price = initialPrice;
            comp.initialPrice = initialPrice;
            comp.bonus = 10*initialPrice;
            comp.shares = this.defs.sharesPerComp;
            comp.maj = [];
            comp.min = [];
            comp.kill = function(game){
            	var num = 0,
            		that = this;
            		
            	this.log(this.name, "dying", this.name+" is dying");
            	
            	if (this.maj.length > 1 || this.min.length === 0){
            		// give all the bonus money to the majority shareholders
            		this.maj.forEach(function(guy){
            			guy.giveMoney(Math.round((that.bonus * 1.5) / that.maj.length));
            			//guy.money += Math.round((that.bonus * 1.5) / that.maj.length);
            		});
            	}else{
            		// some money for both levels;
            		this.maj[0].giveMoney(that.bonus);
            		this.min.forEach(function(guy){
            			guy.giveMoney(Math.round((that.bonus / 2) / that.min.length));
            			//guy.money += Math.round((that.bonus / 2) / that.min.length);
            		});
            	}
            	this.status = "dying";
            	/*this.status = "available";
            	this.price = 0;
            	this.bonus = 0; 
            	*/
            	// take away its tiles?
            };
            comp.config = this.defs;
            comp.config.enumerable = false;
            return comp;
        },
        setup : function(){
            // setup companies
            for (var n=0; n< this.defs.compnames.length; n++){
                var comp = this.newCompany(this.defs.compnames[n], this.defs.prices[n]);
                this.companies[comp.name] = comp;
            }
            
            // setup the bag
            var bag = [];
            var rows = this.defs.rows, cols = this.defs.cols;
            for (var x=1; x<= rows; x++){
                for (var a=1; a<= cols; a++){
                    var tile = x+String.fromCharCode(64+a);
                    bag.push(tile);
                }
            }
            
            // give the bag all these tiles to hold
            this.bag.giveTiles(bag, null, this.owners);
        },
        findAdjTiles : function(tile){
            var col, row, adj = [], where=1, num=tile[0];
            
            // find the top, bottom, left and right for this guy
            if (tile.length > 2){
                where = 2;
                num = tile[0]+tile[1];
            }
            
            col = parseInt(num, 10);
            row = tile.charCodeAt(where);
            
            if (col-1 > 0){
                adj.push(col-1+tile[where]);
            }
            if (col+1 < 13){
                adj.push(col+1+tile[where]);
            }
            if (row-1 > 64){
                adj.push(col+String.fromCharCode(row-1));
            }
            if (row+1 < 74){
                adj.push(col+String.fromCharCode(row+1));
            }
            
            return adj;
        },
        getBlob : function(tile, blob){
        	// finds the whole blob of contiguous tiles
        	//  connected to this tile
            var x, nabes = this.findAdjTiles(tile);
            blob[tile] = true;
                        
            for (x=0; x< nabes.length; x++){
            	if (this.board.tiles[nabes[x]] && !blob[nabes[x]]){
            		// it's on the board
            		this.getBlob(nabes[x], blob);
            	}
			}
            return Object.keys(blob);
        }
    };


var localDefs = {
    cash : 6000,
    tradeRatio : 2,
    startingTiles : 6,
    sharesPerTurn : 3,
    rows : 12,
    selling : false,
    cols : 9,
    safe : 11,
    finalShelf : 41,
    sharesPerComp : 25,
    compnames : ["saxson", "zeta", "fusion", "hydra", "america", "quantum", "phoenix"],
    prices : [200,200,300,300,300,400,400]
};

var baseProps = function(){
	var bag = newActor("bag", "bag");
	bag.tiles.enumerable =  false;

	var quarantine = newActor("quarantine", "quarantine");
	quarantine.tiles.enumerable = false;
	
    return {
        status : {value : "open", enumerable: true, writable: true},
        turn : {value : 0, enumerable: true, writable : true},
        merger : {value : {}, enumerable: true, writable : true},
        mergeTurn : {value : null, enumerable: true, writable : true},
        players : {value : [], enumerable: true},
        people : {value : {}, enumerable: true, writable : true},
        bag : {value : Object.create(actorBase, bag), enumerable: true},
        board : {value : Object.create(actorBase, newActor("board", "board")), enumerable: true},
        owners : {value : {}, enumerable: true, writable: true},
        events : {value : [], enumerable: true},
        quarantine : {value : Object.create(actorBase, quarantine), enumerable: true, writable: true},
        companies : {value : {}, enumerable: true, writable: true}
    };
};
    
exports.newGame = function(name, defaults){
    var defs = defaults || localDefs;
    var base = baseProps();
    var game = Object.create(baseGame, base);
    game.name = name;
    game.defs = defs;
    game.setup();
    
    return game;
};