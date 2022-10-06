/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

import Replicate from './replicate.js'
import fetch from 'node-fetch'
import { Readable } from 'stream'
import got from "got"




const token = process.env['REP_API']

const replicate = new Replicate({token: token});


import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})

fastify.route({
  method: 'GET',
  url: '/',
  schema: {
    // request needs to have a querystring with a `name` parameter
    querystring: {
      text: { type: 'string' }
    }
  },
  // this function is executed for every request before the handler is executed
  preHandler: async (request, reply) => {
    // E.g. check authentication
  },
  handler: async (request, reply) => {
    console.log(request.query)
    const text = request.query.text
    console.log(text)
    if(text){
    const model = await replicate.models.get('stability-ai/stable-diffusion');
    console.log(model)
    const prediction = await model.predict({ text: "test"});
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

    return prediction
      //reply.redirect(prediction[0])
    }
    else return ['error']
  }
})

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
