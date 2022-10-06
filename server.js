const presets = {
  fast: {
    steps: 15,
    diffusion: 'k_euler_ancestral',
    cfgScale: 10
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
    // request needs to have a querystring with a `name` parameter
    querystring: {
      text: { type: "string" },
      token: { type: "string" },
      server: { type: "string" },
      preset: { type: "string" }
    },
  },
  // this function is executed for every request before the handler is executed
  preHandler: async (request, reply) => {
    // E.g. check authentication
  },
  handler: async (request, reply) => {
    console.log(request.headers['x-pasthrough-auth-recipient']);
    let serverTarget = request.headers['x-pasthrough-auth-target'] || request.query.server || 'dreamstudio'
    serverTarget = serverTarget.toString().toLowerCase()
    console.log('serverTarget: ', serverTarget)
    const authKey = request.headers['x-pasthrough-auth'] || request.query.token
    const text = request.query.text;
    const preset = request.query.preset
    const presetData = preset ? presets[preset] : ''
    console.log('Prompt: ', text);
    if (text) {
      if (serverTarget === "dreamstudio") {
        try {
          const { res, images } = await generateAsync({
            prompt: text,
            apiKey: authKey,
            preset
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
        console.log(model);
        const prediction = await model.predict({
          prompt: text,
          width: 512,
          num_inference_steps: 20,
        });
        console.log(prediction);

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

        return prediction;
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
