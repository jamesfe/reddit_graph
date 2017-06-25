# Notes on Today's work

## Deleted Items Graph & Comparison to Sampling

Today I added a new graph that charts out deleted posts on average (more on this later) vs deleted posts in the target dataset (/r/The_Donald).  

First, the sampling: I thought picking 0.25% of reddit's comments and seeing if they were deleted or not was a good effort for sampling.  Why 0.25%?  I calculated that roughly 0.25% of traffic on reddit is from /r/The_Donald. 

This means I have to run my analysis program twice and generate two JSONs: one for the donald, one for the sampling.  More importantly for me here, this means that I have to load two JSONs inside one async handler function.  This is bad, bad, bad, bad.  I feel bad for doing it.  Maybe I should generate a single JSON but I know for sure I'll have to do this again with API calls one day and I won't control the API calls.  

The two JSONs are intertwined, in fact: my scale bar is loaded off the max of the more heavily censored (my assumption was correct in this case and the sampling was less censored).  I nest one handler inside the other here (**bad**) but in the future I should really load both JSONs and munge the data if I need to, then handle the computations (scales, axis, etc) and then render afterward.  

How do I do this?  Feel free to tweet me.  @jimmysthoughts.

## Currying 

Anyway, I was able to pull off a nice trick to save a few lines of code and some complexity (hopefully) by executing my first "production" currying of a function.  Here's the commit: [https://github.com/jamesfe/reddit_graph/commit/0e9df27f3189bf317ccd67d1c0a495147e106088]

I used to think currying was dumb, maybe useful but dangerous at best, but I think with some maturity I have overcome this belief.  Maybe this usage was stupid (-21 lines + 19 lines, 2 lines of savings) but it's the future that I am happy for - I won't have to repeat these lines over again and the worst case is a single character error that throws things off, which in this code you may see, is very easy to do.
