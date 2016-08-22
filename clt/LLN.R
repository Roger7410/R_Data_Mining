lln=vector()  #initialize vector to store coin flips
res<-vector() # initialize vector to keep track of empirical probability
n<-10000      # set number of flips 
for (i in 1:n){
     lln<-c(lln,sample(0:1,1))
     res<-c(res,sum(lln)/length(lln))
}
plot(res) 
mean(res[9001:10000]) # find mean of the last thousand flips
sd(res[9001:10000])   # find the standard deviation of the last thousand flips
