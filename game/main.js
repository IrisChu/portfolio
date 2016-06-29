// Initialize Phaser, and creates a 500x490px game
var game = new Phaser.Game(500, 490, Phaser.AUTO, 'gameDiv');

// Creates a new 'main' state that will contain the game
var mainState = {

    // Function called first to load all the assets
    preload: function() { 
        
        // Change the background color of the game
        game.stage.backgroundColor = 'ffffff';

        // Load the cube sprite
        game.load.image('cube', 'assets/cube.png');  

        // Load the wall sprite
        game.load.image('wall', 'assets/wall.png');      
    },

    // Fuction called after 'preload' to setup the game 
    create: function() { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the cube on the screen
        this.cube = this.game.add.sprite(100, 245, 'cube');
        game.physics.arcade.enable(this.cube);

        // Call the 'up' function when the up arrow is hit
        var upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.up, this); 

		// Call the 'down' function when the down arrow is hit
        var downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downKey.onDown.add(this.down, this); 
		
		// Call the 'right' function when the right arrow is hit
        var rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        rightKey.onDown.add(this.right, this); 
		
		// Call the 'left' function when the right arrow is hit
        var leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftKey.onDown.add(this.left, this); 
		
        // Create a group of 20 walls
        this.walls = game.add.group();
        this.walls.enableBody = true;
        this.walls.createMultiple(20, 'wall');  

        // Timer that calls 'addRowOfwalls' ever 2 seconds
        this.timer = this.game.time.events.loop(2000, this.addRowOfwalls, this);           

        // Add a score label on the top left of the screen
        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#000000" });  
    },

    // This function is called 60 times per second
    update: function() {
        // If the cube is out of the world (too high or too low), call the 'restartGame' function
        if (this.cube.inWorld == false)
            this.restartGame(); 

        // If the cube overlap any walls, call 'restartGame'
        game.physics.arcade.overlap(this.cube, this.walls, this.restartGame, null, this);      
    },

    // Make the cube go up 
    up: function() {
        // Add a vertical velocity to the cube
        this.cube.body.velocity.y = -130;
		this.cube.body.velocity.x = 0;
    },
	
	// Make the cube go down 
    down: function() {
        // Add a vertical velocity to the cube
        this.cube.body.velocity.y = 130;
		this.cube.body.velocity.x = 0;
    },
	
	// Make the cube go right 
    right: function() {
        this.cube.body.velocity.x = 60;
		this.cube.body.velocity.y = 0;
    },
	
	// Make the cube go left 
    left: function() {
        this.cube.body.velocity.x = -60;
		this.cube.body.velocity.y = 0;
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

    // Add a wall on the screen
    addOnewall: function(x, y) {
        // Get the first dead wall of our group
        var wall = this.walls.getFirstDead();

        // Set the new position of the wall
        wall.reset(x, y);

        // Add velocity to the wall to make it move left
        wall.body.velocity.x = -150; 
               
        // Kill the wall when it's no longer visible 
        wall.checkWorldBounds = true;
        wall.outOfBoundsKill = true;
    },

    // Add a row of 6 walls with a hole somewhere in the middle
    addRowOfwalls: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOnewall(500, i*60+10);   
    
        this.score += 1;
        this.labelScore.text = this.score;  
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main'); 