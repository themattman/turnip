## Design Docs

### Synchronize commit numbers with the database

* Have the updateInterval create new db entries for the new timestamp
* The hook catcher should only be updating the last entry, not inserting 

### Todo

* (check) Add authentication to start/stop buttons
* (check) Sanitize data upon hook, only save necessary data
* (check) commit feed fade in
* test top 10 update
* clean up / refactor - (check) emitter for hook should move from router to process
* get rid of collection undef issue
* make sure in each file all require()s are used
* Static graphs?
* load balancer
* separate server for getting hooks
* cost estimate
* Make buttons to see larger graphs, larger graphs send less % of total points