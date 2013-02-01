## Design Docs

# System Design

### Graph Data

* Onload
  * Grab 10 most recent data points and display
* Ondata
  * Overwrite all graph data with 10 most recent data points and update graph

### Leaderboard

* Onload
  * Grab top 10 results
* Ondata
  * Refresh entire 10 results

### Feed

* Onload
  * Grab all the commits
* Ondata
  * Put this new commit at top spot

# Synchronize commit numbers with the database

* Have the updateInterval create new db entries for the new timestamp
* The hook catcher should only be updating the last entry, not inserting 


# Todo

* (check) Add authentication to start/stop buttons
* (check) Sanitize data upon hook, only save necessary data
* (check) commit feed fade in
* (check) make sure in each file all require()s are used
* (check) Support for multiple types of graphs (unstacked)
* (check) page specifically for a commit message feed
* [DOTHIS] top 10 refresh properly
* [DOTHIS] graph real-time refresh
* [DOTHIS] convert jade to HTML and .send not .render
* [DOTHIS] put (no leaders/no messages placeholder for the bottom tables and graph onload if no data arrives)
* [DOTHIS] to refresh graph, overwrite var graph and construct new graph with new data, then delete old graph

* clean up / refactor - (check) emitter for hook should move from router to process
* get rid of collection undef issue
* Static graphs?
* load balancer
* separate server for getting hooks
* cost estimate
* Make buttons to see larger graphs, larger graphs send less % of total points

START TIME = 1359759600