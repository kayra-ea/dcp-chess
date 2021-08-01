#!/usr/bin/env node

/**
 * @file    engine-dcp-job.js
 *              
 *          This is the node application that deploys the dcp-job for the web chess engine's AI move calculations. This dcp application subscribes to all relevent scheduler events and relays them back to the React front-end.
 *          This dcp job will deploy to the *** compute group specific for this demo.
 *
 *          Note: Your keystore should be placed in your home directory in .dcp/default.keystore.
 *              When using the dcp-client API in NodeJS, this keystore will be used for communicating over DCP.
 *
 * @author  Kayra E-A, kayra@kingsds.network
 * @date    July 2021
 */

const SCHEDULER_URL = new URL('https://scheduler.distributed.computer');
//const SCHEDULER_URL = bew URL('http://scheduler.kayra.office.kingsds.network');

/** Main program entry point */
async function main() {
  const compute = require('dcp/compute');
  const wallet = require('dcp/wallet');
  let startTime;

  const job = compute.for(
    ['red', 'green', 'yellow', 'blue', 'brown', 'orange', 'pink'],
    (colour) => {
      progress(0);
      let sum = 0;
      for (let i = 0; i < 10000; i += 1) {
        progress(i / 10000);
        sum += Math.random();
      }
      return { colour, sum };
    },
  );

  job.on('accepted', () => {
    console.log(` - Job accepted by scheduler, waiting for results`);
    console.log(` - Job has id ${job.id}`);
    startTime = Date.now();
  });

  job.on('readystatechange', (arg) => {
    console.log(`new ready state: ${arg}`);
  });

  job.on('result', (ev) => {
    console.log(
      ` - Received result for slice ${ev.sliceNumber} at ${
        Math.round((Date.now() - startTime) / 100) / 10
      }s`,
    );
    console.log(` * Wow! ${ev.result.colour} is such a pretty colour!`);
  });

  job.public.name = 'DCP chess job, nodejs';

  const ks = await wallet.get(); /* usually loads ~/.dcp/default.keystore */
  job.setPaymentAccountKeystore(ks);
  
  /*job.computeGroups = [
    {
      joinKey: 'kayra',
      joinSecret: 'iscool',
    }
  ];*/

  const results = await job.exec(compute.marketValue);
  console.log('results=', Array.from(results));

  let jobReport = await job.getJobInfo(job.id);
  console.log('jobReport: ', jobReport);
}

/* Initialize DCP Client and run main() */
require('dcp-client')
  .init(SCHEDULER_URL)
  .then(main)
  .catch(console.error)
  .finally(process.exit);
