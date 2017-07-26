# Notes 26 July 2017

## Longevity Visualization

I plotted a bunch of data from the "longevity" data I created.  It's a lot of data and to be honest, I think I've made a rookie mistake: trying to plot every single point in a 194,823 point dataset.  That's how many people made at least two posts a minimum of 3 days apart in the target subreddit.  

Not only is trying to plot all of this meaningfully on a graph silly, it also takes a lot of compute - about 3 seconds to draw everything.  Not very optimal.

I guess the answer is to go back to the question: "How long are posters staying around?  Is there a lot of turnover?"

I can immediately think of one other solution to how we answer this question: we look at a given day and calculate the average number of days all the users who left that day had stayed.  We can do the same for start dates: looking forward, of all the users who started on day X, how many days do they stay?

A different option is a little more computationally expensive: given our current dataset (essentially timelines with a start and end time), we calculate the number of active timelines per day.  We only have to calculate this once and hopefully the data would be smaller (an int[k] where k=# of days).  Also probably easier to visualize.

## TODO Progress

- [ ] Unit Tests
- [X] Make a smaller JSON
- [ ] Refactor again if possible?
- [ ] Remove references to specific selectors
- [ ] Investigate two other aggregation methods
