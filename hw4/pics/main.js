/* jslint laxbreak: true, forin: false, white: false, onevar: false, debug: true, plusplus: false, maxerr: 100, evit:true */

/* global process:true, require:true */

var util=require('util'), // http client / server lib
url = require('url'),
http = require('http'), // http client / server lib
path = require('path'),
paperboy = require('paperboy'),
GAME = require('./rahoi');

var gamedb = {}; // later to be replaced with a db

SPTL = {
    commPort : 1973,
    host : "localhost",
    handleGet : function(req, res){
        // if the basename is webservice or collect, pass request through
        // if basename is collect, pass request through
        // else if 
        var q = url.parse(req.url, true);
        var basename = q.pathname;
        // it's either a file request or a command
        if (q.query && q.query.action){
            // it's an action
            this.handleAction(q, req, res);
        }else{
            // it's a file request                    
            this.handleFile(req, res);
        }
    },
    addPlayer : function(q, resp){
        // add a player to a game
        var player = q.player;
        var whichGame = gamedb[q.game];
        
        if (whichGame){
            whichGame.addPlayer(player);
            resp.game = whichGame;
            resp.results.push({code: 0, message: "found game "+q.game});
        }else{
            resp.results.push({code: -1, message: "no game "+q.game});
        }
    },
    newGame : function(q, resp){
        var name = q.game;          
        var newGame = GAME.newGame(name);
        gamedb[name] = newGame;
        
        resp.results.push({code: 0, message: "new game created"});
        resp.game = newGame;
    },
    listGames : function(q, resp){
        var games = Object.keys(gamedb), list=[];
            
        for (var a=0; a< games.length; a++){
        	var g = gamedb[games[a]];
            list.push({game : g.name, status : g.status, players : g.players.length});
        }
        resp.results.push({code: 0, message: "found all "+list.length+" games"});
        resp.games = list;
    },
    playTile : function(q, resp){
        var game = gamedb[q.game],
            problem = true, 
            result = {code: 0, message: "played "+q.tile+" in game "+q.game};
            
        if (game){        
            problem = game.playTile(q.tile);
            
            if (problem){
                resp.results.push(problem); 
            }else{
                resp.results.push(result);
            }
        
            resp.game = game;
        }else{
            resp.results.push({code: -1, message: "no game "+game});
            resp.game = null;
        }
    },
    buyShares : function(q, resp){
        var game = gamedb[q.game];
        var x, s, c, companies, shares, purchase;
        
        if (game){
            if (q.company && q.shares){
                companies = q.company.split(",");
                console.log(JSON.stringify(companies));
                shares = q.shares.split(",");
                purchase = [];
                
                for (x=0; x< companies.length; x++){
                    c = companies[x],
                    s = shares[x];
                    
                    purchase.push({
                        company : c,
                        shares : s*1
                    });
                    resp.results.push({code: 1, message: "bought "+s+" shares of "+c});			    
                }
                game.buySellShares(q.player, purchase, false);
			}else{
				game.addEvent(q.player, "bought", q.player+ " bought nothing");
			}
            game.changeStatus();
            
            resp.game = game;
        }else{
            resp.results.push({code: -1, message: "no game "+game});
            resp.game = null;
        }
    },
    startCompany : function(q, resp){
        var game = gamedb[q.game];
        if (game){
            var status = game.startCompany(q.company);
        
            resp.results.push({code: status, message: "started "+q.company+" in game "+q.game});
            resp.game = game;
        }else{
            resp.results.push({code: -1, message: "no game "+game});
            resp.game = null;
        }
    },
    startGame : function(q, resp){
        var game = gamedb[q.game];
        if (game){
            game.start();
        
            resp.results.push({code: 0, message: "started "+q.game});
            resp.game = game;
        }else{
            resp.results.push({code: -1, message: "no game "+game});
            resp.game = null;
        }
    },
    end : function(q, resp){
    	var game = gamedb[q.game];
        if (game){
            game.end(q.end !== "false");
        
            resp.results.push({code: 0, message: "game over "+q.game});
            resp.game = game;
        }else{
            resp.results.push({code: -1, message: "no game "+game});
            resp.game = null;
        }
    },
    decide : function(q, resp){
    	var game = gamedb[q.game];
        if (game){
        	var merger = {
        		winner : game.companies[q.winner],
        		loser : game.companies[q.loser]
        	};
        	
        	if (q.three){
				merger.three = game.companies[q.three];
			}
	
			if (q.four){
				merger.four = game.companies[q.four];
			}
        	
            game.decide(merger);
        
            resp.results.push({code: 0, message: "decided "+q.game});
            resp.game = game;
        }else{
            resp.results.push({code: -1, message: "no game "+game});
            resp.game = null;
        }
    },
    merge : function(q, resp){
    	var game = gamedb[q.game];
        if (game){
            game.mergePlay(q.player, q.trade*1, q.sell*1);
        
            resp.results.push({code: 0, message: "handled merge turn "+q.game});
            resp.game = game;
        }else{
            resp.results.push({code: -1, message: "no game "+game});
            resp.game = null;
        }
    },
    handleAction : function(que, req, res){
        var starts=[], ends=[], status=null, response={results:[]}, withCallback="", q=que.query;
               
         if (q.action === "new"){
            this.newGame(q, response);
         }
         
         if (q.action === "startCompany"){
         	this.startCompany(q, response);
         }
         
         if (q.action === "join"){
            this.addPlayer(q, response);       
         }
         
         if (q.action === "decide"){
            this.decide(q, response);       
         }
         
         if (q.action === "merge"){
            this.merge(q, response);       
         }
         
         if (q.action === "end"){
            this.end(q, response);       
         }
         
         if (q.action === "game"){         
            response.results.push({code: 0, message: "found game "+q.game});
            response.game = gamedb[q.game];
         }
         
         if (q.action === "play"){
            this.playTile(q, response);
         }
         
         if (q.action === "start"){
            this.startGame(q, response);
         }
         
         if (q.action === "buy"){
            this.buyShares(q, response);
         }
         
         if (q.action === "list" || q.action === "new"){
            this.listGames(q, response);
         }
         
         
      if (q.callback){
            // being called from script include
             res.writeHead(200, {'Content-Type': 'text/javascript'});
             withCallback += q.callback + "(";
             withCallback += JSON.stringify(response)+ ");";
        }else if (q.variable){
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            withCallback += q.variable + "= ";
            withCallback += JSON.stringify(response)+ ";";
        }else{
            res.writeHead(200, {'Content-Type': 'application/json'});
            withCallback = JSON.stringify(response);
        }
        res.end(withCallback);
    },
    handlePost : function(req, res, postBody){
        var newFeedSettings = JSON.parse(postBody);
        if (newFeedSettings){
            // might be a good place to validate
            // and make sure the functions match the ones that are actually there
            util.puts("Got something");
        }
        var response={results:[{code: 0, message: "success"}]};
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(JSON.stringify(response));
    },
    handleFile : function(req, res){
        var ip = req.connection.remoteAddress;
          paperboy
            .deliver("files", req, res)
            .addHeader('Expires', 300)
            .addHeader('X-PaperRoute', 'Node')
            .before(function() {

            }.bind(this))
            .after(function(statCode) {
              //log(statCode, req.url, ip);
            }.bind(this))
            .error(function(statCode,msg) {
              res.writeHead(statCode, {'Content-Type': 'text/plain'});
              res.write("Error: " + statCode);
              res.end();
              util.puts("Error: "+statCode + " " +msg);
            }.bind(this))
            .otherwise(function(err) {
              var statCode = 404;
              res.writeHead(statCode, {'Content-Type': 'text/plain'});
              res.write("Error: " + statCode);
              res.end();
              util.puts("Error: "+statCode+" " +err);
            }.bind(this));
    },
    server : function (req, res) {
      var body = "";
      req.addListener("data", function (data) {
        body += data;
      });
      req.addListener("end", function () {
        if (req.method === "GET"){
            this.handleGet(req, res);
        }else{
            this.handlePost(req, res, body);
        }
      }.bind(this));
    },
    startup: function(){
        http.createServer(this.server.bind(this)).listen(this.commPort, this.host);
        util.puts("slapital running at http://"+this.host+":"+this.commPort);        
    }
};
// get next player in merge
// hand out bonuses
// liquidate companies
// bag - board - dead - merging - player - company

SPTL.startup();

var newGame = GAME.newGame("test");
newGame.addPlayer("jon");
newGame.addPlayer("mig");
newGame.addPlayer("cody");
newGame.addPlayer("tiberius");
gamedb[newGame.name] = newGame;