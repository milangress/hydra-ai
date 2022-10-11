# hydra-ai

 🚧 WIP 🚧

Script and proxy to work with AI in [Hydra](https://github.com/ojack/hydra/).

API & Funktions are WIP and gonna change

```Js
await loadScript('https://hydra-ai-milan.glitch.me/ai.js')

keyDreamstudio.value = "YOUR Dreamstudio API KEY"

//or
keyReplicate.value = "YOUR Replicate API KEY"
settings.value.server = "Replicate"

s0.initAi('an closeup of a hydra', 'extreme', 10000000)
```

The reference to your key `keyDreamstudio.value = "YOUR Dreamstudio API KEY"` can (and should) be removed afterwards


```Js
await loadScript('https://hydra-ai-milan.glitch.me/ai.js')

s0.initAi('an closeup of a hydra', 'extreme', 10000000)

src(s0).out()

```
