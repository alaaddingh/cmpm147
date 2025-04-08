// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
 const fillers = {
  audience: ["wizard","witch", "student", "homie"],
  location_prefix: ["Olde", "The Misty", "Ancient", "Murkey", "Lonely", "Far Far Away"],
  location_title: ["Deer Hyde", "Frog Skin", "Ogre Odor", "Locksmith", "Granny", "Swole Troll"],
  potion_substance: ['Elixer', 'Caffienated Beverage', 'Potion', 'Warm Milk'],
  potion_container: ["Flask", "Hydro Flask", "Bottle", "Sack", "Jug"],
  potion_material: ["Play Doh", "Unicorn Carcass", "Drywall", "Rusty Metal"],
  ingredient: ["a Lion Mane", "some Chin Whiskers", "some Troll Phlegm", "some Crunchy Berries", "a Phoenix Feather", "some Beetle Blend"],
  potion_effect: ["Call your parents", "Regret life decisions at 2 am", "Levitate, but only 5mm from the ground", "become an excellent battle rapper", "become invisibile but for as long as you refrain from blinking"],
  enemies: ["Indocrinated Goblins", "Your Opps", "Poor Tippers", "Orcs with exceptionally poor hygiene", "Centrist Hyenas"],
}


/**
* const template = `$adventurer, heed my $message!
* 
* I have just come from $pre$post where the $people folk are in desperate need. Their town has been overrun by $baddies. You must venture forth at once, taking my $item, and help them.
* 
* It is told that the one who can rescue them will be awarded with $num $looty $loots. Surely this must tempt one such as yourself!
* `;
**/

const template = `Greetings, $audience! I am Ambrose, an elder Bard from the Kingdom of 
  $location_prefix $location_title. I come here bearing a tool for you to help you in your journey.
  Take this $potion_container from my hand. It is made from the finest $potion_material, so please handle this with care.
  This here is a magical $potion_substance that was crafted using $ingredient. When you consume this substance, you gain the ability to
  $potion_effect. Use this when neccessary, especially when battling $enemies. Good luck!`


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();

}

main();
