# hydra-ai

 🚧 WIP 🚧

Script and proxy to work with AI (specifically Stable diffusion) in [Hydra](https://github.com/ojack/hydra/).

API & Functions are WIP and going to change

```Js
await loadScript('https://hydra-ai-milan.glitch.me/ai.js')

keyDreamstudio.value = "YOUR Dreamstudio API KEY"

//or
keyReplicate.value = "YOUR Replicate API KEY"
settings.value.server = "Replicate"

s0.initAi('a closeup of a hydra')
```

The reference to your key `keyDreamstudio.value = "YOUR Dreamstudio API KEY"` can (and should) be removed afterwards

It gets saved in your local storage, which is not really secure and could be stolen by other scripts running on the same domain… still thinking about a better solution. But the local storage means that can share the script with other people, and it's going to use their own API Key


```Js
await loadScript('https://hydra-ai-milan.glitch.me/ai.js')

s0.initAi('a closeup of a hydra')

src(s0).out()

```

## Plans

- improve the API-Key situation
- Simplify the API
- General model support
- local support (through replicate cog)
