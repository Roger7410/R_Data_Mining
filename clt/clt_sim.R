ptm <- proc.time()
means20<-rep(NA,10000)
for (i in 1:10000){
  samp20<-rnorm(20,50,7)
  means20[i]<-mean(samp20)
}
sd(samp20)
par(mfrow=c(2,1))
par(mar=c(1,1,1,1))
hist(rnorm(10000,50,7),breaks=50,xlim=c(30,70))
hist(means20,breaks=50,xlim=c(30,70))
proc.time() - ptm
