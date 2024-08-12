-- SQL to manually deploy the smart contract (shouldn't be necessary)

-- Create the batch job
insert into batch_job
  (id,
   run_in_a_transaction,
   status,
   job_type,
   created,
   updated)
values
  ('deployVotingSmartContract-000',
   false,
   'N',  -- New status
   'deployVotingSmartContract',
   now(),
   now());


-- Update the batch job for rerun
update batch_job
   set status = 'N',
       message = null
 where job_type = 'deployVotingSmartContract';

