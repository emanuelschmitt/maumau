export default function randomBotName(): string {
    const names: string[] = [
        "Albert", "Allen", "Bert", "Bob", "Cecil", "Clarence", "Elliot", "Elmer", "Ernie", 
        "Eugene", "Fergus", "Ferris", "Frank", "Frasier", "Fred", "George", "Graham", "Harvey", 
        "Irwin", "Larry", "Lester", "Marvin", "Neil", "Niles", "Oliver", "Opie", "Ryan", "Toby",
            "Ulric", "Ulysses", "Uri", "Waldo", "Wally", "Walt", "Wesley", "Yanni", "Yogi", "Yuri"
        ];
    const random = Math.floor(Math.random() * (names.length - 1))
    return "BOT " + names[random]
}