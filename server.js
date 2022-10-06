const presets = {
  fast: {
    steps: 10,
    diffusion: 'k_euler_ancestral',
    cfgScale: 10
  },
  slow: {
    steps: 100,
    diffusion: 'k_euler_ancestral',
    cfgScale: 10
  },
  extreme: {
    steps: 20,
    diffusion: 'k_euler_ancestral',
    cfgScale: 55
  }
}




import Replicate from "./replicate.js";
import stability from "stability-client";
const { generateAsync } = stability;

import fetch from "node-fetch";
//import { Readable } from 'stream'
//import got from "got"
import cors from "@fastify/cors";

const token = process.env["REP_API"];

import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*",
});

fastify.route({
  method: "GET",
  url: "/",
  schema: {
    querystring: {
      text: { type: "string" },
      token: { type: "string" },
      server: { type: "string" },
      preset: { type: "string" },
      width: { type: "number" },
      height: { type: "number" }
    },
  },
  handler: async (request, reply) => {
    let serverTarget = request.headers['x-pasthrough-auth-target'] || request.query.server || 'dreamstudio'
    serverTarget = serverTarget.toString().toLowerCase()
    console.log('serverTarget: ', serverTarget)
    
    const authKey = request.headers['x-pasthrough-auth'] || request.query.token
    
    const text = request.query.text;
    console.log('Prompt: ', text);
    
    const preset = request.query.preset
    const presetData = preset ? presets[preset] : ''
    console.log(presetData)
    
    if (text && authKey) {
      if (serverTarget === "dreamstudio") {
        try {
          const { res, images } = await generateAsync({
            prompt: text,
            apiKey: authKey,
            ...presetData,
            width: request.query.width || 512,
            height: request.query.height || 512,
          });
          reply.type(images[0].mimeType)
          reply.send(images[0].buffer)
        } catch (e) {
          console.log(e)
        }
      
      } else {
        
        //Replicate
        
        const replicate = new Replicate({ token: authKey }, { pollingInterval: 500 });

        
        const model = await replicate.models.get(
          "stability-ai/stable-diffusion"
        );
        const prediction = await model.predict({
          prompt: text,
          width: 512,
          num_inference_steps: 20,
        });
        const swinModel = await replicate.models.get("jingyunliang/swinir")
        const upscaledImage = await swinModel.predict({image: prediction.pop()})

        console.log(prediction);
        console.log(upscaledImage)

        //reply.type('image/png')
        //const stream = got.stream(prediction[0])
        //console.log(stream)

        //const response = await fetch(prediction[0]);
        //const myStream = new Readable({
        //read () {
        //  this.push(stream)
        //  this.push(null)
        //}
        //})

        //reply.send(stream)

        return upscaledImage;
      }
      //reply.redirect(prediction[0])
    } else return ["found no prompt :("];
  },
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);
  }
);
