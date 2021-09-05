# How to read/edit these files
These files are databases that the extension reads from. Because of that, you can modify them as much as you want!
Here's a list of JSON files we recommend you mess around with first, and how to do it.
## capeInfo.json
Used for Minecraft cape descriptions.
Example usage:
```json
{
    "capes": {
        "Put a NameMC data-cape-hash here!": {
            "name": "Cool Cape",
            "description": "A pretty cool cape that I really like, personally."
        },
        "d3c7ac835b24eb29": {
            "name": "Millionth Customer",
            "description": "Given to akronman1 for purchasing the one millionth copy of Minecraft"
        }
    }
}
```
## customCapes.json
Used for custom capes on profiles and the capes page.
Example usage:
```json
{
    "Cape Name": {
        "description": "Cape Description",
        "src": "https://awesome.website.com/capefile.png",
        "users": ["array", "of", "uuids"]
    },
    "Bacon Cape": {
        "description": "I really like bacon...",
        "src": "https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/af/Bacon_Cape_%28texture%29.png",
        "users": ["1f66d9d9b3964ed58f72f47bde34ffe4"]
    }
}
```
