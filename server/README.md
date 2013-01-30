## Design Docs

### Synchronize commit numbers with the database

* Have the updateInterval create new db entries for the new timestamp
* The hook catcher should only be updating the last entry, not inserting 

### Todo

* (check) Add authentication to start/stop buttons
* (check) Sanitize data upon hook, only save necessary data
* commit feed fade in
* test top 10 update
* clean up / refactor - emitter for hook should move from router to process
* get rid of collection undef issue
* make sure all require()s are used
* Static graphs?
* load balancer
* separate server for getting hooks
* cost estimate