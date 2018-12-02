const Discord = require ('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const queue = new Map();

var prefix = "//"
var servers = {};

client.login(process.env.TOKEN);

client.login(process.env.TOKEN);

function play(connection, message) {
  
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() { 
    if (server.queue[0]) play(connection, message);

    else connection.disconnect();

  });
}


client.on('message', message => {
  if (message.channel.type === "dm") return; 

});

client.on("ready", () => {
    console.log("Bot Reafy !");
    client.user.setActivity("Prefixe = //.En Developpement");
});

client.on('message' , message => {
  if(message.content === "Bonjour"){

  if(message.author.id === "260039734678519808"){
    message.reply("Bonjour Dieu Eclipse") 
  }

  else if(message.author.id === "435083780793958402"){
    message.reply("Bonjour ElPatron EsteG") 
  }

   else {
    message.reply("Salut !");
    console.log("wsh");
   }
  }
   

   if(message.content === prefix + "aide"){
    var help_embed = new Discord.RichEmbed()
    .setColor("#FF0000")
    .setTitle("Ceci sont les commandes du bot !")
    .setDescription("Dev By Eclipse")
    .setThumbnail(message.author.avatarURL)
    .addField("Commandes", "//aide permet d'afficher les commandes (provisoires) du bot ! \n //statistiques permet d'afficher vos statistiques vis a vis de votre compte discord ! \n //info permet d'avoir des informations sur le serveur et le bot !")
    .addField("Interaction", "Bonjour permet une interaction avec le bot")
    .addField("Modération", "//kick pour kick une personne. \n //ban pour ban une personne. \n //clear (nombre) pour effacer des messages du chat. \n //mute | //unmute pour muter|unmuter les personnes du serv. \n //warn|//deletewarns pour warn|unwarn les gens. \n //seewarns pour voir les warns d'une personne.")
    .addField("Musique", "//play Pour lancer une musique avec un lien youtube ! \n //skip pour passer une musique \n //stop pour faire quitter le bot")
    .setFooter("Menu d'aide")
    message.channel.sendEmbed(help_embed);
    console.log("Aide demandée");           
  }

  var fs = require('fs');
 
let warns = JSON.parse(fs.readFileSync("./warns.json", "utf8"));
 
if (message.content.startsWith(prefix + "warn")){
 
if (message.channel.type === "dm") return;
 
var mentionned = message.mentions.users.first();
 
if(!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) return message.reply("**:x: Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**").catch(console.error);
 
if(message.mentions.users.size === 0) {
 
  return message.channel.send("**:x: Vous n'avez mentionnée aucun utilisateur**");
 
}else{
 
    const args = message.content.split(' ').slice(1);
 
    const mentioned = message.mentions.users.first();
 
    if (message.member.hasPermission('MANAGE_GUILD')){
 
      if (message.mentions.users.size != 0) {
 
        if (args[0] === "<@!"+mentioned.id+">"||args[0] === "<@"+mentioned.id+">") {
 
          if (args.slice(1).length != 0) {
 
            const date = new Date().toUTCString();
 
            if (warns[message.guild.id] === undefined)
 
              warns[message.guild.id] = {};
 
            if (warns[message.guild.id][mentioned.id] === undefined)
 
              warns[message.guild.id][mentioned.id] = {};
 
            const warnumber = Object.keys(warns[message.guild.id][mentioned.id]).length;
 
            if (warns[message.guild.id][mentioned.id][warnumber] === undefined){
 
              warns[message.guild.id][mentioned.id]["1"] = {"raison": args.slice(1).join(' '), time: date, user: message.author.id};
 
            } else {
 
              warns[message.guild.id][mentioned.id][warnumber+1] = {"raison": args.slice(1).join(' '),
 
                time: date,
 
                user: message.author.id};
 
            }
 
            fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {if (err) console.error(err);});
 
message.delete();
 
            message.channel.send(':warning: | **'+mentionned.tag+' à été averti**');
 
message.mentions.users.first().send(`:warning: **Warn |** depuis **${message.guild.name}** donné par **${message.author.username}**\n\n**Raison:** ` + args.slice(1).join(' '))
 
          } else {
 
            message.channel.send("Erreur mauvais usage: "+prefix+"warn <user> <raison>");
 
          }
 
        } else {
 
          message.channel.send("Erreur mauvais usage: "+prefix+"warn <user> <raison>");
 
        }
 
      } else {
 
        message.channel.send("Erreur mauvais usage: "+prefix+"warn <user> <raison>");
 
      }
 
    } else {
 
      message.channel.send("**:x: Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**");
 
    }
 
  }
 
}
 
 
 
  if (message.content.startsWith(prefix+"seewarns")||message.content===prefix+"seewarns") {
 
if (message.channel.type === "dm") return;
 
if(!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) return message.reply("**:x: tu n'as pas la permission `Gérer le serveur` dans ce serveur**").catch(console.error);
 
    const mentioned = message.mentions.users.first();
 
    const args = message.content.split(' ').slice(1);
 
    if (message.member.hasPermission('MANAGE_GUILD')){
 
      if (message.mentions.users.size !== 0) {
 
        if (args[0] === "<@!"+mentioned.id+">"||args[0] === "<@"+mentioned.id+">") {
 
          try {
 
            if (warns[message.guild.id][mentioned.id] === undefined||Object.keys(warns[message.guild.id][mentioned.id]).length === 0) {
 
              message.channel.send("**"+mentioned.tag+"** n'a aucun warn :eyes:");
 
              return;
 
            }
 
          } catch (err) {
 
            message.channel.send("**"+mentioned.tag+"** n'a aucun warn :eyes:");
 
            return;
 
          }
 
          let arr = [];
 
          arr.push(`**${mentioned.tag}** a **`+Object.keys(warns[message.guild.id][mentioned.id]).length+"** warns :eyes:");
 
          for (var warn in warns[message.guild.id][mentioned.id]) {
 
            arr.push(`**${warn}** - **"`+warns[message.guild.id][mentioned.id][warn].raison+
 
            "**\" warn donné par **"+message.guild.members.find("id", warns[message.guild.id][mentioned.id][warn].user).user.tag+"** a/le **"+warns[message.guild.id][mentioned.id][warn].time+"**");
 
          }
 
          message.channel.send(arr.join('\n'));
 
        } else {
 
          message.channel.send("Erreur mauvais usage: "+prefix+"seewarns <user> <raison>");
 
          console.log(args);
 
        }
 
      } else {
 
        message.channel.send("Erreur mauvais usage: "+prefix+"seewarns <user> <raison>");
 
      }
 
    } else {
 
      message.channel.send("**:x: Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**");
 
    }
 
  }
 
 
 
 
 
  if (message.content.startsWith(prefix+"deletewarns")||message.content===prefix+"deletewarns") {
 
if (message.channel.type === "dm") return;
 
if(!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) return message.reply("**:x: Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**").catch(console.error);
 
   const mentioned = message.mentions.users.first();
 
    const args = message.content.split(' ').slice(1);
 
    const arg2 = Number(args[1]);
 
    if (message.member.hasPermission('MANAGE_GUILD')){
 
      if (message.mentions.users.size != 0) {
 
        if (args[0] === "<@!"+mentioned.id+">"||args[0] === "<@"+mentioned.id+">"){
 
          if (!isNaN(arg2)) {
 
            if (warns[message.guild.id][mentioned.id] === undefined) {
 
              message.channel.send(mentioned.tag+" n'a aucun warn");
 
              return;
 
            } if (warns[message.guild.id][mentioned.id][arg2] === undefined) {
 
              message.channel.send("**:x: Ce warn n'existe pas**");
 
              return;
 
            }
 
            delete warns[message.guild.id][mentioned.id][arg2];
 
            var i = 1;
 
            Object.keys(warns[message.guild.id][mentioned.id]).forEach(function(key){
 
              var val=warns[message.guild.id][mentioned.id][key];
 
              delete warns[message.guild.id][mentioned.id][key];
 
              key = i;
 
              warns[message.guild.id][mentioned.id][key]=val;
 
              i++;
 
            });
 
            fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {if (err) console.error(err);});
 
            if (Object.keys(warns[message.guild.id][mentioned.id]).length === 0) {
 
              delete warns[message.guild.id][mentioned.id];
 
            }
 
            message.channel.send(`Le warn de **${mentioned.tag}**\': **${args[1]}** a été enlevé avec succès!`);
 
            return;
 
          } if (args[1] === "tout") {
 
            delete warns[message.guild.id][mentioned.id];
 
            fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {if (err) console.error(err);});
 
            message.channel.send(`Les warns de **${mentioned.tag}** a été enlevé avec succès!`);
 
            return;
 
          } else {
 
            message.channel.send("Erreur mauvais usage: "+prefix+"clearwarns <utilisateur> <nombre>");
 
          }
 
        } else {
 
          message.channel.send("Erreur mauvais usage: "+prefix+"clearwarns <utilisateur> <nombre>");
 
        }
 
      } else {
 
       message.channel.send("Erreur mauvais usage: "+prefix+"clearwarns <utilisateur> <nombre>");
 
      }
 
    } else {
 
      message.channel.send("**:x: Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**");
 
    }
 
  }

  if(message.content === prefix + "info"){
      var info_embed = new Discord.RichEmbed()
      .setColor("#F6FE00")
      .setTitle("Voici les informations sur moi et le serveur")
      .addField(" :robot: Nom :", `${client.user.tag}`, true)
      .addField("Tag du bot :hash:", `#${client.user.discriminator}`)
      .addField(":id: ", `${client.user.id}`)
      .addField("Nombre de Membres", message.guild.memberCount)
      .addField("En Devellopement par Eclipse", "Ë̷̢̼͓́͋̇̂̒̉̀̈̀̊̋͒͝clipse_#9792")
      .setFooter("Info - Bot")
      message.channel.sendMessage(info_embed)
      console.log("Info")
  }
  if(message.content.startsWith(prefix + "kick")){
    if(!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) return message.channel.send("Tu n'as pas le droit !");

    if(message.mentions.users.size == 0){
      return message.channel.send("Vous devez mentionner un utilisateur")
    }
    var kick = message.guild.member(message.mentions.users.first());
    if(!kick) {
       return message.channel.send("Je ne sais pas si l'utilisateur existe :sad:")
    }

    if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
      return message.channel.send("Je n'ai pas la permission pour kick :sob:");
    }

    kick.kick().then(member => {
        message.channel.send(`${member.user.username} est kick par ${message.author.username}`);
    });
  }

  if(message.content.startsWith(prefix + "ban")){
    if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.channel.send("Tu n'as pas le droit !");

    if(message.mentions.users.size == 0){
      return message.channel.send("Tu dois mentionner un utilisateur")
    }
    var ban = message.guild.member(message.mentions.users.first());
    if(!ban) {
       return message.channel.send("Je ne sais pas si l'utilisateur existe :sad:")
    }

    if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
      return message.channel.send("Je n'ai pas la permission pour ban :sob:");
    }

    ban.ban().then(member => {
        message.channel.send(`${member.user.username} est ban par ${message.author.username}`);
    });
  }
  if(message.content.startsWith(prefix + "clear")){
    if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tu n'as pas le droit !");
    let args = message.content.split(" ").slice(1);

    if(!args[0]) return message.channel.send("Tu dois préciser un nombre de message a supprimer !")
    message.channel.bulkDelete(args[0]).then(() => {
          message.channel.send(`${args[0]} ont été supprimés !`);
    })
  }
  if(message.content.startsWith(prefix + "mute")) {
    if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return message.channel.send("Tu n'as pas le droit !");

    if(message.mentions.users.size === 0) {
        return message.channel.send('Tu dois mentionner un utilisateur !');
    }

    var mute = message.guild.member(message.mentions.users.first());
    if(!mute) {
        return message.channel.send("Je ne sais pas si l'utilisateur existe :sad:");
    }

    if(!message.guild.member(client.user).hasPermission("ADMINISTRATOR")) return message.channel.send("Je n'ai pas la permission pour le mute :sob:");
    message.channel.overwritePermissions(mute, { SEND_MESSAGES: false}).then(member => {
        message.channel.send(`${mute.user.username} est mute !`);
    })
}


if (!message.content.startsWith(prefix)) return;

var args = message.content.substring(prefix.length).split(" ");

switch (args[0].toLowerCase()) { 

    case "statistiques":

    var userCreateDate = message.author.createdAt.toString().split(" ");
    var msgauthor = message.author.id;

    var stats_embed = new Discord.RichEmbed()
    .setColor("#6699FF")
    .setTitle(`Statistiques du joueurs : ${message.author.username}`)
    .addField(`ID du joueurs :id:`, msgauthor, true)
    .addField(`Date d'inscription du joueur :`, userCreateDate[1] + ' ' + userCreateDate[2] + ' ' + userCreateDate[3])
    .setThumbnail(message.author.avatarURL)
    message.reply("Tu peux regarder tes messages privés !")
    message.author.send(stats_embed);

    break;
    
   case "play":

    if (!args[1]) {

   message.channel.sendMessage("Tu dois m’indiquer un lien YouTube"); 

   return;

   }

   if(!message.member.voiceChannel) {

   message.channel.sendMessage(":x: Tu dois être dans un salon vocal"); 

   return;

   }


   if(!servers[message.guild.id]) servers[message.guild.id] = {

   queue: []

   };


   var server = servers[message.guild.id];


   server.queue.push(args[1]);

   if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {

   play(connection, message) 

   });

   break; 

   case "skip":

   if(!message.member.voiceChannel) {

   message.channel.sendMessage(":x: Tu dois être dans un salon vocal"); 

   return;

   }

   var server = servers[message.guild.id];

   if(server.dispatcher) server.dispatcher.end();

   break;

   case "stop":

   if(!message.member.voiceChannel) 

   return message.channel.send(":x: Tu dois être dans un salon vocal");

   message.member.voiceChannel.leave();

   break;

}
});
