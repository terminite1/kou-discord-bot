require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType, ApplicationCommandType } = require('discord.js')

const numbah = ApplicationCommandOptionType.Number

const commands = [
    {
        name: 'get-subplaces',
        description: 'Gets places via API using the games PlaceID.',
        options: [
            {
                name: 'place-id',
                description: "The PlaceID",
                type: numbah,
                required: true,
            }
        ]
    },
    {
        name: 'get-datastore-entry',
        description: "Get a user's datastore entries.",
        options: [
            {
                name: "universe-id",
                description: "Place's UID",
                type: numbah,
                required: true,
            },
            {
                name: "datastore-name",
                description: "Datastore's name",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "entry-key",
                description: "Datastore entry key",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'markiplier',
        description: "markiplier command"
    },
    {
        name: 'get-product-info',
        description: "Get product information using AssetID.",
        options: [
            {
                name: "asset-id",
                description: "Product AssetID",
                type: numbah,
                required: true
            }
        ]
    },
    {
        name: 'geolocation',
        description: "Get Geolocation and other info from an IP",
        options: [
            {
                name: "address",
                description: "The Internet Protocol address",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'delete-webhook',
        description: "Deletes the webhook given to the command.",
        options: [
            {
                name: "url",
                description: "Webhook URL",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "joke",
        description: "Replies with a joke!",
        options: [
            {
                name: "punchline",
                description: "Whether to include the punchline or not (true default)",
                type: ApplicationCommandOptionType.Boolean,
                required: false,

            }
        ]
    },
    {
        name: "love",
        description: "Calculate your love percentage!",
        options: [
            {
                name: "name",
                description: "The person's name",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "get-pronouns",
        description: "Get a user's pronouns! (PronounDB)",
        options: [
            {
                name: "platform",
                description: "The platform to fetch the id from",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "Discord",
                        value: "discord",
                    },
                    {
                        name: "GitHub",
                        value: "github",
                    },
                    {
                        name: "Minecraft",
                        value: "minecraft"
                    },
                    {
                        name: "Twitch",
                        value: "twitch"
                    },
                    {
                        name: "Twitter",
                        value: "twitter"
                    }
                ],
            },
            {
                name: "userid",
                description: "The UserID (relevant to the platform)",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ],
        required: true,
    },
    {
        name: "uwu",
        description: "Tuwns stwings :3 into siwwy *looks at you* w-wittwe texts *runs away*",
        options: [
            {
                name: "text",
                description: "Text t-to uwuify OwO",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "age",
        description: "Gets an age of a name!",
        options: [
            {
                name: "name",
                description: "The name to get from",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: "gender",
        description: "Guess the gender based off of a name!",
        options: [
            {
                name: "name",
                description: "The name to guess from",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "password",
        description: "Enter the correct password.",
        options: [
            {
                name: "input",
                description: "The password",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "bored",
        description: "Responds with something to do when you're bored!",
    },
    {
        name: "number",
        description: "Returns the meaning of a number.",
        options: [
            {
                name: "number",
                description: "The number (or date MM/DD - or 'random')",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "type",
                description: "The type of number (defaults to trivia)",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                    {
                        name: "Trivia",
                        value: "trivia"
                    },
                    {
                        name: "Math",
                        value: "math",
                    },
                    {
                        name: "Date",
                        value: "date"
                    },
                    {
                        name: "Year",
                        value: "year"
                    }
                ]
            }
        ]
    },
    {
        name: "fact",
        description: "Generates a random fact"
    },
    {
        name: "tiktok-tts",
        description: "Returns thingy",
        options: [
            {
                name: "message",
                description: "Message to send",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "voice",
                description: "Voice to generate in",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "Female 1 (US)",
                        value: "en_us_001"
                    },
                    {
                        name: "Male 1 (US)",
                        value: "en_us_006"
                    },
                    {
                        name: "Male 2 (US)",
                        value: "en_us_007"
                    },
                    {
                        name: "Male 3 (US)",
                        value: "en_us_009"
                    },
                    {
                        name: "Male 4 (US)",
                        value: "en_us_010"
                    },
                    {
                        name: "Male 1 (BR)",
                        value: "br_005"
                    },
                    {
                        name: "Male 2 (KR)",
                        value: 'kr_004'
                    },
                    {
                        name: "Ghostface (Scream)",
                        value: "en_us_ghostface"
                    },
                    {
                        name: "Chewbacca (Star Wars)",
                        value: 'en_us_chewbacca'
                    },
                    {
                        name: "Alto (Singing)",
                        value: "en_female_f08_salut_damour"
                    },
                    {
                        name: "Sunshine Soon (Singing)",
                        value: 'en_male_m03_sunshine_soon'
                    },
                    {
                        name: "Glorious (Singing)",
                        value: "en_female_ht_f08_glorious"
                    },
                    {
                        name: "It Goes Up (Singing)",
                        value: "en_male_sing_funny_it_goes_up"
                    },
                    {
                        name: "Chipmunk (Singing)",
                        value: "en_male_m2_xhxs_m03_silly"
                    },
                    {
                        name: "Dramatic (Singing)",
                        value: "en_female_ht_f08_wonderful_world"
                    },
                ]
            }
        ]
    },
    {
        name: "clubette",
        description: "Make clubette speak in the #clubette-speech channel",
        options: [
            {
                name: "message",
                description: "What to make clubette say (all submissions are anonymous)",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "send-webhook",
        description: "Send a message to a custom URL",
        options: [
            {
                name: "id",
                description: "The webhook's id (webhooks/id)",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "token",
                description: "The webhook's token (webhooks/id/token)",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "message",
                description: "The message to send to the webhook",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "get-game-instances",
        description: "Gets the servers of a place",
        options: [
            {
                name: "placeid",
                description: "Id of the place (Wow!)",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "type",
                description: "Type of server to look for",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                    {
                        name: "Public",
                        value: "Public"
                    },
                    {
                        name: "Friend",
                        value: "Friend"
                    },
                    {
                        name: "VIP",
                        value: "VIP"
                    }
                ]
            }
        ]
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("farting on the commands");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        )

        console.log("done registering")
    } catch (error) {
        console.log(`whoopsies there was an error: ${error}`);
    }
})();