var start = Date.now();

require('dotenv').config();

////////////// IMPORTS/CONSTANTS START HERE //////////////

const {
    Client,
    IntentsBitField,
    Message,
    AttachmentBuilder,
    WebhookClient
} = require('discord.js');

const axios = require('axios')

const noblox = require('noblox.js')

const {
    default: Uwuifier
} = require('uwuifier');
const wawa = new Uwuifier({
    spaces: {
        faces: 0.5,
        actions: 0.5,
        stutters: 0.25,
    },
    words: 2,
    exclamations: 4
})

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

const cookie = process.env.COOKIE // important
const apikey = process.env.API_KEY // important

const webhookClient = new WebhookClient({
    id: process.env.WEBHOOK_ID,
    token: process.env.WEBHOOK_TOKEN
})


////////////// FUNCTIONS START HERE //////////////

function makeid(length) {
    // thx stackoverflow
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

////////////////////////////

async function startApp() {
    // i actually hardly ever use this but some api stuff requires auth so.....
    const currentUser = await noblox.setCookie(cookie)
    console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
}
startApp()
noblox.setAPIKey(apikey)

////////////////////////////


client.on('ready', async (c) => {
    console.log("yipee the bot is online");
    var delta = (Date.now() - start) / 1000
    console.log(`${delta} seconds to start`)
});

////////////// COMMANDS START HERE //////////////

client.on('interactionCreate', async (interaction) => { // if spam best spam
    if (!interaction.isChatInputCommand()) return;
    // i use fetch and axios for some reason
    // axios better tho

    // unavoidable if spam
    if (interaction.commandName === 'get-subplaces') {
        await interaction.deferReply()
        const placeid = interaction.options.get('place-id').value
        let csrf = await noblox.getGeneralToken()
        console.log(`Place ID Entered: ${placeid}`)
        try {
            // Getting universeId
            const response = await axios.get(`https://games.roblox.com/v1/games/multiget-place-details/?placeIds=${placeid}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `.ROBLOSECURITY=${cookie}`,
                    "x-csrf-token": csrf
                }
            })
            // Getting Subplaces
            if (response.data[0] === undefined) {
                interaction.channel.send("Invalid placeId (the UID is undefined)")
                interaction.deleteReply()
            } else {
                const universeid = response.data[0].universeId
                interaction.channel.send(`Fetched universeId: **${universeid}** for place '**${response.data[0].name}**'`)
                const response2 = await axios.get(`https://develop.roblox.com/v1/universes/${universeid}/places?isUniverseCreation=false&limit=100&sortOrder=Asc`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Cookie": `.ROBLOSECURITY=${cookie}`,
                        "x-csrf-token": csrf
                    }
                })
                let finaldata = new AttachmentBuilder(Buffer.from(JSON.stringify(response2.data.data, null, 2), "utf-8"), {
                    name: `subplaces-${placeid}.json`
                })
                interaction.channel.send({
                    files: [finaldata],
                    content: `All done! There are: **${response2.data.data.length} places** total for the game '**${response.data[0].name}**'`
                })
                interaction.deleteReply()
            }

        } catch (error) {
            console.log(error)
        }
    }
    if (interaction.commandName === 'get-datastore-entry') {
        // useless command that doesn't work, i didn't setup the api key properly
        const universeid = interaction.options.get('universe-id').value
        const dname = interaction.options.get('datastore-name').value
        const ekey = interaction.options.get('entry-key').value

        try {
            const entry = await noblox.getDatastoreEntry({
                universeId: universeid,
                datastoreName: dname,
                entryKey: ekey,
            })
            console.log(entry.data)
        } catch (error) {
            interaction.reply(`${error}`)
        }

    }
    if (interaction.commandName === 'markiplier') {
        // 6
        interaction.reply("https://cdn.discordapp.com/attachments/834863400696676393/1112086267757330512/Screenshot_300.png")
    }
    if (interaction.commandName === 'get-product-info') {
        // not that useful
        await interaction.deferReply()
        const assetid = interaction.options.get('asset-id').value
        try {
            const productInfo = await noblox.getProductInfo(assetid)
            const atc = new AttachmentBuilder(Buffer.from(JSON.stringify(productInfo, null, 2), 'utf-8'), {
                name: `info-${assetid}.json`
            })
            interaction.channel.send({
                files: [atc],
                content: `Asset ID: ${assetid} (${interaction.user.username})`
            })
            interaction.deleteReply()
        } catch (error) {
            interaction.channel.send(`${error}`)
            interaction.deleteReply()
        }
    }
    if (interaction.commandName === 'geolocation') {
        // i swear this is not used for malicious purposes
        await interaction.deferReply()
        const address = interaction.options.get('address').value
        const response = await axios.get(`http://ip-api.com/json/${address}?fields=status,message,continent,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,reverse,mobile,proxy,query`)
        // oh boy
        const status = response.data.status
        try {
            if (status === 'success') {
                console.log(response.data)
                // get ready for the constants
                const country = response.data.country
                const countrycode = response.data.countryCode
                const region = response.data.region
                const regionName = response.data.regionName
                const city = response.data.city
                const district = response.data.district
                const zip = response.data.zip
                const latitude = response.data.lat
                const longitude = response.data.lon
                const timezone = response.data.timezone
                const isp = response.data.isp
                const organization = response.data.org
                const as = response.data.as
                const reverse = response.data.reverse
                const mobile = response.data.mobile
                const proxy = response.data.proxy
                const ipquery = response.data.query

                let string = `Don't worry, I gotchu\n\n**IP Entered: **${ipquery}\n**Status: **SUCCESS\n\n**Country: **${country} (${countrycode})\n**Region: **${regionName} (${region})\n**City: **${city}\n**District: **${district}\n**Zip Code: **${zip}\n\n**Latitude: **${latitude}\n**Longitude: **${longitude}\n\n**Timezone: **${timezone}\n**ISP: **${isp}\n**Organization: **${organization}\n**AS: **${as}\n**Reverse DNS: **${reverse}\n**Mobile connection: **${mobile}\n**Proxy: **${proxy}`

                interaction.editReply(string)
            } else {
                interaction.editReply('Geolocation failed! ' + response.data.message)
            }
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }


    if (interaction.commandName === 'delete-webhook') {
        // congrats discord on being this dumb
        const url = interaction.options.get('url').value
        try {
            let erasefromlife = async () => {
                let web = fetch(`${url}`, {
                    method: 'DELETE'
                })
                return (await web)
            }
            let g = await erasefromlife()
            let fart = await g.json()
            console.log(fart)
            interaction.reply(fart)
        } catch (error) {
            console.log("Caught error")
            interaction.reply(`${error}`)
        }
    }


    if (interaction.commandName === 'joke') {
        // funnier without punchline
        await interaction.deferReply()
        const punchline = interaction.options.get('punchline')?.value
        console.log(punchline)
        try {
            let getjoke = async () => {
                let response = await axios.get(
                    "https://official-joke-api.appspot.com/random_joke"
                )
                return response.data
            }
            let fa = await getjoke()
            if (punchline === true || punchline === undefined) {
                interaction.editReply(fa.setup + "\n\n" + fa.punchline)
            } else {
                interaction.editReply(fa.setup)
            }
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }



    if (interaction.commandName === "love") {
        // favorite command by many
        await interaction.deferReply();
        const usertext = interaction.options.get('name').value

        const options = {
            method: 'GET',
            url: 'https://love-calculator.p.rapidapi.com/getPercentage',
            params: {
                sname: makeid(16),
                fname: usertext
            },
            headers: {
                'X-RapidAPI-Key': process.env.XRAPID_API_KEY,
                'X-RapidAPI-Host': 'love-calculator.p.rapidapi.com'
            }
        };
        try {
            const response = await axios.request(options);
            const result = await response;
            const string = `Your compatibility with **${usertext}** is: **${result.data.percentage}**% - *${result.data.result}*\nRequest: ${usertext} ${result.data.sname}`
            console.log(result.data)
            if (string.length >= 2000) {
                interaction.editReply("Fuck you dolphin")
            } else {
                interaction.editReply(string)
            }
        } catch (error) {
            interaction.editReply(`${error}`);
        }
    }



    if (interaction.commandName === "get-pronouns") {
        // command no one will use
        await interaction.deferReply()
        const platform = interaction.options.get('platform').value
        const userid = interaction.options.get('userid').value

        try {
            const response = await axios.get(`https://pronoundb.org/api/v2/lookup?platform=${platform}&ids=${userid}`)
            console.log(response.data)
            console.log(JSON.stringify(response.data))
            interaction.editReply('You want to look for: "en: []" (' + userid + ')```json\n' + JSON.stringify(response.data, null, 2) + '```' + JSON.stringify(response.data).userid + userid)

        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }


    if (interaction.commandName === "uwu") {
        // :)
        await interaction.deferReply()
        const fattext = interaction.options.get('text').value
        const uwuifiedsentence = wawa.uwuifySentence(fattext)
        if (uwuifiedsentence.length >= 2000) {
            interaction.editReply("Too long, buddy.")
            console.log(`${uwuifiedsentence.length} -- Too Long.`)
        } else {
            interaction.editReply(uwuifiedsentence)
            console.log(`${uwuifiedsentence.length} -- Short enough`)
        }
    }



    if (interaction.commandName === "age") {
        // doesn't work with fake names :(
        await interaction.deferReply()
        const name = interaction.options.get('name').value
        const response = await axios.get(`https://api.agify.io/?name=${name}`)
        console.log(response.data)
        try {
            interaction.editReply(`**${response.data.name}** is ${response.data.age} years old`)
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }



    if (interaction.commandName === "gender") {
        // doesn't work with fake names :(
        await interaction.deferReply()
        const name = interaction.options.get('name').value
        const response = await axios.get(`https://api.genderize.io/?name=${name}`)
        console.log(response.data)
        try {
            interaction.editReply(`**${name}** is probably a **${response.data.gender}**. (**${response.data.probability * 100}**% sure)`)
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }



    if (interaction.commandName === 'password') {
        // i thought of making this command tell you if your password is breached or not, but i won't do that yet
        await interaction.deferReply()
        //wait(2500)
        const password = interaction.options.get('input').value
        if (password === 'epicfisheater123') {
            interaction.deleteReply()
            let fart = new AttachmentBuilder(Buffer.from(cookie, 'utf-8'), {
                name: "wawa.txt"
            })
            interaction.channel.send({
                content: "I'm not sending the cookie anymore"
            }) // this used to send my roblox cookie
        } else {
            interaction.editReply("EPIC FAIL!!! 🤑")
        }
    }



    if (interaction.commandName === 'bored') {
        // pretty repetitive but whatever
        await interaction.deferReply()
        const response = await axios.get('https://boredapi.com/api/activity/')
        try {
            interaction.editReply(`You should ${response.data.activity.toLowerCase()}!`)
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }



    if (interaction.commandName === 'number') {
        // broken ass command lol
        await interaction.deferReply()
        const number = interaction.options.get('number').value
        const type = interaction.options.get('number')?.value
        const response = await axios.get(`http://numbersapi.com/${number}/${type}`)
        console.log(response)
        try {
            interaction.editReply(`${response.data}`)
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }



    if (interaction.commandName === 'fact') {
        // can someone fact check?
        await interaction.deferReply()
        const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random')
        console.log(response.data)
        try {
            interaction.editReply(`${response.data.text}`)
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }



    if (interaction.commandName === 'tiktok-tts') {
        // one of my favorite commands :)
        await interaction.deferReply()
        const message = interaction.options.get('message').value
        const voice = interaction.options.get('voice').value
        let check = (message.length >= 300)

        try {
            const status = await axios.get('https://tiktok-tts.weilnet.workers.dev/api/status')
            const statuscheck = status.data.success
            console.log(statuscheck)
            if (statuscheck === true) {
                interaction.channel.send("API Online (200)")
                if (check === true) {
                    interaction.editReply(`Too long, sorry... (${message.length}/300)`)
                } else {
                    const response = await axios.post(`https://tiktok-tts.weilnet.workers.dev/api/generation`, { // casually stole this lol 
                        text: message,
                        voice: voice
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    console.log(`${interaction.user.username} requests audio file: data:audio/mpeg;base64,${response.data.data}`)
                    // fucking bitch line below took me an hour to make
                    let atc = new AttachmentBuilder(Buffer.from(response.data.data.replace('data:audio/ogg; codecs:opus;base64,', ''), 'base64'), {
                        name: `${interaction.user.username}_${makeid(16)}.mp3`
                    })
                    interaction.channel.send({
                        files: [atc],
                        content: `Aight buh, whatever you say (${message.length}/300)\nVoice Selected: ${voice}\nYour input: *${message}*`
                    })
                    interaction.deleteReply()
                }
            } else {
                interaction.channel.send("Yo, the API is offline. Guhh???")
            }
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }



    if (interaction.commandName === 'clubette') {
        // silly goose
        await interaction.deferReply({
            ephemeral: true
        })
        const message = interaction.options.get('message').value
        if (message.length > 2000) {
            interaction.editReply("You're a silly little buddy if you think I'm gonna send that")
        } else {
            try {
                webhookClient.send({
                    content: message
                })
                console.log(`${interaction.user.username}#${interaction.user.discriminator} said: ${message}`)
                interaction.editReply("Submitted!")
            } catch (error) {
                interaction.editReply(`Something went wrong: ${error}`)
            }
        }
    }



    if (interaction.commandName === 'send-webhook') {
        // cool command (works)
        await interaction.deferReply({
            ephemeral: true
        })
        const id = interaction.options.get('id').value
        const webtoken = interaction.options.get('token').value
        const message = interaction.options.get('message').value

        const finalwebhook = new WebhookClient({
            id: id,
            token: webtoken
        })
        try {
            console.log(`${interaction.user.username}#${interaction.user.discriminator} requests to send ${message} to ${id},${webtoken}`)
            finalwebhook.send({
                content: message
            })
            interaction.editReply("Submitted")
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }



    if (interaction.commandName === 'get-game-instances') {
        // can't decode usernames sry
        await interaction.deferReply()
        const placeid = interaction.options.get('placeid').value
        const servertype = interaction.options.get('type')?.value
        try {
            if (servertype === undefined) {
                const servers = await noblox.getGameInstances(placeid, "Public")
                const attachment = new AttachmentBuilder(Buffer.from(JSON.stringify(servers, null, 2), "utf-8"), {
                    name: `servers-${placeid}-${"PUBLIC"}.json`
                })
                interaction.channel.send({
                    files: [attachment],
                    content: `Here you go 🐟🐟🐟`
                })
                interaction.deleteReply()
            } else {
                const servers = await noblox.getGameInstances(placeid, servertype)
                const attachment = new AttachmentBuilder(Buffer.from(JSON.stringify(servers, null, 2), "utf-8"), {
                    name: `servers-${placeid}-${servertype.toUpperCase()}.json`
                })
                interaction.channel.send({
                    files: [attachment],
                    content: `Here you go 🐟🐟🐟`
                })
                interaction.deleteReply()
            }
        } catch (error) {
            interaction.editReply(`${error}`)
        }
    }



    if (interaction.commandName === 'fish') {
        await interaction.deferReply()

        interaction.editReply('https://cdn.discordapp.com/attachments/830183852516966431/1117543248597106799/Mr-Humphead-Wrasse.png')
    }



    if (interaction.commandName === 'zbot') {
        await interaction.deferReply({
            ephemeral: true
        })
        if (interaction.options.getSubcommand() === 'linked') {
            const key = interaction.options.get('key').value
            try {
                let response = await axios.get(`http://zbot.figmentcoding.me/get-guid/${key}`)
                if (response.data === 'None') {
                    interaction.editReply('Not set | Key not linked')
                } else {
                    interaction.editReply(`Set | Key belongs to ${response.data}`)
                }
            } catch (error) {
                interaction.editReply(`Invalid key | -1`)
            }
        }
    }



    if (interaction.commandName === 'bot-speak') {
        await interaction.deferReply({
            ephemeral: true
        })
        if (interaction.user.id === '247074510614953985') {
            const message = interaction.options.get('message').value
            if (message.length > 2000) {
                interaction.editReply("Too long, try again")
            } else {
                try {
                    interaction.channel.send({
                        content: message
                    })
                    interaction.editReply("Submitted!")
                } catch (error) {
                    interaction.editReply(`Something went wrong: ${error}`)
                }
            }
        } else {
            interaction.editReply("You're not allowed to use this command")
        }
    }


    if (interaction.commandName === 'ping') {
        await interaction.deferReply()
        // calculate the time it takes to send a message
        const sent = await interaction.channel.send('Pinging...');
        const timeDiff = (sent.editedAt || sent.createdAt) - (interaction.editedAt || interaction.createdAt);
        await interaction.editReply(`Pong! This message had a latency of ${timeDiff}ms.`);
        sent.delete();
    }
})

////////////// COMMANDS ENDS HERE //////////////

let funny_strings = [
    'fart',
    'markiplier',
    'fnm04',
    'dolphin',
    'noob',
    'patrick',
    'kou',
    '776476163441950790'
]

// is github copilot good? 

const responses = {
    fart: 'Woah buddy, did you just say fart? You can`t say that, man',
    markiplier: 'https://tenor.com/view/kevin-die-kevin-markiplier-punch-crazy-makiplier-gif-14961644',
    fnm04: 'https://cdn.discordapp.com/attachments/1041057118503043193/1113449776705454180/image.png',
    dolphin: 'https://tenor.com/view/dolphin-muzzle-gif-27683039',
    noob: 'https://tenor.com/view/pro-vs-noob-cod-king22-gru-irl-gru-cosplay-and-cartoon-gif-16819849',
    patrick: 'https://cdn.discordapp.com/attachments/834863400696676393/1116846661763858432/patrick.png',
    kou: 'WHAT YOU WANT BITCH!'
};

/////////////// Message Create Section ///////////////

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    let rng = Math.floor(Math.random() * 10000)
    const content = msg.content
    const uppercontent = content.toUpperCase()

    if (msg.channelId === '1116852105504899092') {
        console.log(msg.content)
        try {
            if (msg.content !== '') {
                const response = await axios.get(`https://tenor.googleapis.com/v2/search?q=${msg.content}&key=${process.env.TENOR_CODE}`)
                // tenor api cool :)
                let random = Math.floor(Math.random() * (response.data.results.length / 3))
                msg.reply(response.data.results[random].itemurl)
                console.log(`Randomness: ${random}`)
            } else {
                msg.reply(`This is you: \☠ because yo dumbass message doesn't have CONTENT. WHAT YOU WANT ME TO SEARCH???`)
            }
        } catch (error) {
            msg.reply(`${error}`)
        }

    } else {
        // Username
        funny_strings.some(funny_string => {
            if (uppercontent.includes(funny_string.toUpperCase())) {
                msg.reply(responses[funny_string]);
                return true;
            }
            return false;
        });
    }
    console.log(`${msg.author.username} got ${rng}/10000`)
    if (rng === 1) {
        msg.reply("You just got a 1/10000 chance!")
    }
})

/////////////// Message Create Section ///////////////


/*
client.on('messageDelete', async (msg) => { // deleted message logger basically, couldn't get it to work with webhooks...
    let check = msg.author.id === '776476163441950790'
    const usersays = `**${msg.author.username}#${msg.author.discriminator}**: `
    if (!(msg.length >= 2000) && !(check)) {
        msg.channel.send({
            content: `${usersays}${msg.content}`
        })
    } else {
        msg.channel.send({
            content: `${msg.author.username}:[Message Invalid]`
        })
    }
})
*/

client.login(process.env.TOKEN)